import { getItem, setItem, STORAGE_KEYS } from './storageProvider';
import { membersService } from './membersService';
import { MEMBERSHIP_PLANS } from '../constants/plansData';

export const registrationService = {
  async getRegistrations() {
    return await getItem(STORAGE_KEYS.REGISTRATIONS);
  },

  async submitRegistration(formData) {
    const list = await getItem(STORAGE_KEYS.REGISTRATIONS);
    const plan = MEMBERSHIP_PLANS.find((p) => p.id === formData.preferredPlanId) || MEMBERSHIP_PLANS[0];
    const now = new Date();
    const dateStr = now.toISOString().replace('T', ' ').slice(0, 16);

    const newReg = {
      id: `REG-${Date.now().toString().slice(-4)}`,
      applicantName: formData.applicantName,
      phone: formData.phone,
      email: formData.email || '',
      address: formData.address || '',
      preferredPlanId: plan.id,
      preferredPlanName: plan.name,
      monthlyFee: plan.price,
      requestedStartDate: formData.requestedStartDate || new Date().toISOString().split('T')[0],
      submittedAt: dateStr,
      status: 'Pending',
      notes: formData.notes || 'Online submission from website'
    };

    const updated = [newReg, ...list];
    await setItem(STORAGE_KEYS.REGISTRATIONS, updated);
    return newReg;
  },

  async approveRegistration(registrationId) {
    const list = await getItem(STORAGE_KEYS.REGISTRATIONS);
    const index = list.findIndex((r) => r.id === registrationId);
    if (index === -1) throw new Error('Registration record not found');

    const reg = list[index];

    // Add to members roster automatically
    const member = await membersService.addMember({
      name: reg.applicantName,
      phone: reg.phone,
      email: reg.email,
      address: reg.address,
      planId: reg.preferredPlanId,
      joiningDate: reg.requestedStartDate,
      feeStatus: 'Paid'
    });

    list[index].status = 'Approved';
    await setItem(STORAGE_KEYS.REGISTRATIONS, list);

    return { registration: list[index], member };
  },

  async rejectRegistration(registrationId) {
    const list = await getItem(STORAGE_KEYS.REGISTRATIONS);
    const index = list.findIndex((r) => r.id === registrationId);
    if (index === -1) throw new Error('Registration record not found');

    list[index].status = 'Rejected';
    await setItem(STORAGE_KEYS.REGISTRATIONS, list);
    return list[index];
  }
};
