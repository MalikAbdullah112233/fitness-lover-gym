import { getItem, setItem, STORAGE_KEYS } from './storageProvider';
import { membersService } from './membersService';
import { GYM_INFO } from '../constants/plansData';

export const feesService = {
  // Get all fee transactions
  async getTransactions() {
    return await getItem(STORAGE_KEYS.TRANSACTIONS);
  },

  // Record a payment for a member
  async recordPayment(paymentData) {
    const { memberId, amount, mode, transactionRef, notes, extendDays = 30 } = paymentData;

    const member = await membersService.getMemberById(memberId);
    if (!member) throw new Error('Member not found');

    const transactions = await getItem(STORAGE_KEYS.TRANSACTIONS);
    const todayStr = new Date().toISOString().split('T')[0];

    // Compute new due date (+extendDays from current due date or today if expired)
    const currentDue = new Date(member.dueDate);
    const today = new Date();
    const baseDate = currentDue > today ? currentDue : today;
    baseDate.setDate(baseDate.getDate() + parseInt(extendDays));
    const newDueDateStr = baseDate.toISOString().split('T')[0];

    // Create receipt record
    const receiptId = `REC-${new Date().getFullYear()}-${String(transactions.length + 1).padStart(3, '0')}`;
    const newTransaction = {
      id: receiptId,
      memberId: member.id,
      memberName: member.name,
      planName: member.planName,
      amount: parseFloat(amount) || member.monthlyFee,
      paymentDate: todayStr,
      dueDate: newDueDateStr,
      mode: mode || 'Cash',
      transactionRef: transactionRef || `REF-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'Success',
      notes: notes || 'Monthly membership fee'
    };

    // Update transactions list
    const updatedTransactions = [newTransaction, ...transactions];
    await setItem(STORAGE_KEYS.TRANSACTIONS, updatedTransactions);

    // Update member record in members service
    await membersService.updateMember(member.id, {
      feeStatus: 'Paid',
      lastPaymentDate: todayStr,
      dueDate: newDueDateStr
    });

    return newTransaction;
  },

  // Get Late Fee Alerts (members past due date)
  async getLateFeeAlerts() {
    const members = await membersService.getMembers();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const alerts = [];
    members.forEach((m) => {
      const due = new Date(m.dueDate);
      due.setHours(0, 0, 0, 0);
      if (today > due && m.feeStatus !== 'Paid') {
        const diffTime = Math.abs(today - due);
        const daysOverdue = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        const estimatedLateFee = daysOverdue > 5 ? (daysOverdue - 5) * 50 : 0; // Rs 50/day after 5 grace days

        alerts.push({
          memberId: m.id,
          memberName: m.name,
          phone: m.phone,
          planName: m.planName,
          monthlyFee: m.monthlyFee,
          dueDate: m.dueDate,
          daysOverdue,
          estimatedLateFee
        });
      }
    });

    return alerts.sort((a, b) => b.daysOverdue - a.daysOverdue);
  },

  // Generate complete receipt object for rendering or printing
  getReceiptObject(transaction, member, gymSettings = null) {
    return {
      receiptNo: transaction.id,
      gym: gymSettings || GYM_INFO,
      date: transaction.paymentDate,
      member: {
        id: member ? member.id : transaction.memberId,
        name: member ? member.name : transaction.memberName,
        phone: member ? member.phone : 'N/A',
        address: member ? member.address : 'N/A'
      },
      payment: {
        planName: transaction.planName,
        amount: transaction.amount,
        mode: transaction.mode,
        ref: transaction.transactionRef,
        nextDueDate: transaction.dueDate,
        notes: transaction.notes
      }
    };
  }
};
