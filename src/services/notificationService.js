import { membersService } from './membersService';
import { feesService } from './feesService';
import { attendanceService } from './attendanceService';
import { registrationService } from './registrationService';

const READ_KEY = 'flg_notifications_read_v1';
const CLEARED_KEY = 'flg_notifications_cleared_v1';

export const notificationService = {
  getReadIds() {
    try {
      const data = localStorage.getItem(READ_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveReadIds(ids) {
    try {
      localStorage.setItem(READ_KEY, JSON.stringify(ids));
    } catch (e) {}
  },

  getClearedIds() {
    try {
      const data = localStorage.getItem(CLEARED_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  },

  saveClearedIds(ids) {
    try {
      localStorage.setItem(CLEARED_KEY, JSON.stringify(ids));
    } catch (e) {}
  },

  async getNotifications() {
    const readIds = new Set(this.getReadIds());
    const clearedIds = new Set(this.getClearedIds());
    const notifications = [];

    const todayStr = new Date().toISOString().split('T')[0];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      // 1. Fee Overdue & Summary Alerts
      const lateAlerts = await feesService.getLateFeeAlerts();
      if (lateAlerts.length > 0) {
        // General summary card
        const summaryId = `fee-summary-overdue-${todayStr}`;
        if (!clearedIds.has(summaryId)) {
          notifications.push({
            id: summaryId,
            type: 'fee_overdue',
            title: 'Action Required: Pending Payments',
            message: `${lateAlerts.length} gym members have payments past their due date.`,
            date: 'Urgent',
            targetTab: 'fees',
            level: 'danger',
            isRead: readIds.has(summaryId)
          });
        }

        // Individual member overdue cards
        lateAlerts.forEach((alert) => {
          const alertId = `fee-overdue-${alert.memberId}`;
          if (!clearedIds.has(alertId)) {
            notifications.push({
              id: alertId,
              type: 'fee_overdue',
              title: `${alert.memberName} - Fee Overdue`,
              message: `Monthly fee of Rs ${alert.monthlyFee} is ${alert.daysOverdue} days overdue.`,
              date: `Due: ${alert.dueDate}`,
              targetTab: 'fees',
              level: 'danger',
              isRead: readIds.has(alertId)
            });
          }
        });
      }

      // 2. Upcoming Fee Renewal Reminders (Due within 3 days)
      const members = await membersService.getMembers();
      members.forEach((m) => {
        if (m.dueDate && m.feeStatus !== 'Overdue') {
          const due = new Date(m.dueDate);
          due.setHours(0, 0, 0, 0);
          const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
          
          if (diffDays >= 0 && diffDays <= 3) {
            const upcomingId = `fee-upcoming-${m.id}-${m.dueDate}`;
            if (!clearedIds.has(upcomingId)) {
              notifications.push({
                id: upcomingId,
                type: 'fee_upcoming',
                title: 'Membership Expiring Soon',
                message: `${m.name}'s ${m.planName} plan (Rs ${m.monthlyFee}) is due in ${diffDays === 0 ? 'today' : diffDays + ' day(s)'}.`,
                date: `Due: ${m.dueDate}`,
                targetTab: 'fees',
                level: 'warning',
                isRead: readIds.has(upcomingId)
              });
            }
          }
        }
      });

      // 3. New Member Registrations
      const sortedMembers = [...members].sort((a, b) => new Date(b.joiningDate) - new Date(a.joiningDate));
      sortedMembers.slice(0, 3).forEach((m) => {
        const memberId = `member-new-${m.id}`;
        if (!clearedIds.has(memberId)) {
          notifications.push({
            id: memberId,
            type: 'member_new',
            title: 'New Member Registered',
            message: `${m.name} joined as a new member (${m.planName}).`,
            date: `Joined: ${m.joiningDate}`,
            targetTab: 'members',
            level: 'info',
            isRead: readIds.has(memberId)
          });
        }
      });

      // 4. Online Registration Applications
      const registrations = await registrationService.getRegistrations();
      const pendingRegs = registrations.filter((r) => r.status === 'Pending');
      pendingRegs.forEach((reg) => {
        const regId = `online-reg-${reg.id}`;
        if (!clearedIds.has(regId)) {
          notifications.push({
            id: regId,
            type: 'online_reg',
            title: 'New Online Membership Request',
            message: `${reg.applicantName} requested online registration for ${reg.preferredPlanName}.`,
            date: `Submitted: ${reg.submittedAt}`,
            targetTab: 'registrations',
            level: 'success',
            isRead: readIds.has(regId)
          });
        }
      });

      // 5. Daily Attendance Summary
      const todayLogs = await attendanceService.getTodayAttendance();
      if (todayLogs.length > 0) {
        const attId = `attendance-summary-${todayStr}`;
        if (!clearedIds.has(attId)) {
          notifications.push({
            id: attId,
            type: 'attendance_summary',
            title: 'Daily Attendance Report',
            message: `Today's attendance: ${todayLogs.length} members checked in to the gym.`,
            date: 'Today',
            targetTab: 'attendance',
            level: 'info',
            isRead: readIds.has(attId)
          });
        }
      }

    } catch (err) {
      console.error('Error generating notifications:', err);
    }

    return notifications;
  },

  async markAsRead(id) {
    const readIds = new Set(this.getReadIds());
    readIds.add(id);
    this.saveReadIds(Array.from(readIds));
  },

  async markAllAsRead(notifications) {
    const readIds = new Set(this.getReadIds());
    notifications.forEach((n) => readIds.add(n.id));
    this.saveReadIds(Array.from(readIds));
  },

  async clearAll(notifications) {
    const clearedIds = new Set(this.getClearedIds());
    notifications.forEach((n) => clearedIds.add(n.id));
    this.saveClearedIds(Array.from(clearedIds));
  }
};
