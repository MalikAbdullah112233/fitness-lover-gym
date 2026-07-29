import { getItem, setItem, STORAGE_KEYS } from './storageProvider';
import { MEMBERSHIP_PLANS } from '../constants/plansData';

// Utility to calculate fee status (Paid, Overdue, Pending) based on due date
const calculateFeeStatus = (dueDateStr, currentFeeStatus) => {
  if (!dueDateStr) return 'Pending';
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dueDateStr);
  due.setHours(0, 0, 0, 0);

  if (today > due && currentFeeStatus !== 'Paid') {
    return 'Overdue';
  }
  return currentFeeStatus || 'Paid';
};

export const membersService = {
  // Get all members with updated overdue fee statuses
  async getMembers() {
    const members = await getItem(STORAGE_KEYS.MEMBERS);
    const updated = members.map((m) => ({
      ...m,
      feeStatus: calculateFeeStatus(m.dueDate, m.feeStatus)
    }));
    return updated;
  },

  async getMemberById(id) {
    const members = await this.getMembers();
    return members.find((m) => m.id === id) || null;
  },

  async addMember(newMemberData) {
    const members = await getItem(STORAGE_KEYS.MEMBERS);
    const selectedPlan = MEMBERSHIP_PLANS.find(p => p.id === newMemberData.planId) || MEMBERSHIP_PLANS[0];

    const nextNum = 1000 + members.length + 1;
    const newId = `FLG-${nextNum}`;

    const todayStr = new Date().toISOString().split('T')[0];
    const nextDue = new Date();
    nextDue.setDate(nextDue.getDate() + 30);
    const dueDateStr = nextDue.toISOString().split('T')[0];

    const newMember = {
      id: newId,
      name: newMemberData.name,
      phone: newMemberData.phone,
      email: newMemberData.email || '',
      address: newMemberData.address || '',
      joiningDate: newMemberData.joiningDate || todayStr,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      monthlyFee: selectedPlan.price,
      dueDate: newMemberData.dueDate || dueDateStr,
      lastPaymentDate: todayStr,
      feeStatus: newMemberData.feeStatus || 'Paid',
      status: 'Active',
      trainerId: newMemberData.trainerId || '',
      trainerName: newMemberData.trainerName || 'Unassigned',
      gender: newMemberData.gender || 'Other',
      age: parseInt(newMemberData.age) || 25,
      bloodGroup: newMemberData.bloodGroup || 'A+',
      emergencyContact: newMemberData.emergencyContact || ''
    };

    const updatedMembers = [newMember, ...members];
    await setItem(STORAGE_KEYS.MEMBERS, updatedMembers);
    return newMember;
  },

  async updateMember(id, updateData) {
    const members = await getItem(STORAGE_KEYS.MEMBERS);
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) throw new Error('Member not found');

    let updatedPlanName = members[index].planName;
    let updatedFee = members[index].monthlyFee;
    if (updateData.planId && updateData.planId !== members[index].planId) {
      const planObj = MEMBERSHIP_PLANS.find(p => p.id === updateData.planId);
      if (planObj) {
        updatedPlanName = planObj.name;
        updatedFee = planObj.price;
      }
    }

    const updatedDueDate = updateData.dueDate || members[index].dueDate;
    const updatedStatus = updateData.feeStatus || members[index].feeStatus;

    const updatedMember = {
      ...members[index],
      ...updateData,
      planName: updatedPlanName,
      monthlyFee: updatedFee,
      dueDate: updatedDueDate,
      feeStatus: calculateFeeStatus(updatedDueDate, updatedStatus)
    };

    members[index] = updatedMember;
    await setItem(STORAGE_KEYS.MEMBERS, members);
    return updatedMember;
  },

  // Direct manual mark overdue / change due date helper
  async setMemberDueDateAndStatus(id, newDueDate, newFeeStatus) {
    return await this.updateMember(id, {
      dueDate: newDueDate,
      feeStatus: newFeeStatus
    });
  },

  async deleteMember(id) {
    const members = await getItem(STORAGE_KEYS.MEMBERS);
    const filtered = members.filter((m) => m.id !== id);
    await setItem(STORAGE_KEYS.MEMBERS, filtered);
    return true;
  },

  async getPendingFeeMembers() {
    const members = await this.getMembers();
    return members.filter((m) => m.feeStatus === 'Overdue' || m.feeStatus === 'Pending');
  }
};
