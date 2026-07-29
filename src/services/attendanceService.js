import { getItem, setItem, STORAGE_KEYS } from './storageProvider';
import { membersService } from './membersService';

export const attendanceService = {
  async getAttendanceLogs() {
    return await getItem(STORAGE_KEYS.ATTENDANCE);
  },

  async getTodayAttendance() {
    const logs = await this.getAttendanceLogs();
    const todayStr = new Date().toISOString().split('T')[0];
    return logs.filter((log) => log.date === todayStr);
  },

  async checkInMember(memberIdOrPhone) {
    const members = await membersService.getMembers();
    const query = memberIdOrPhone.trim().toLowerCase();
    
    const member = members.find(
      (m) => m.id.toLowerCase() === query || m.phone.includes(query) || m.name.toLowerCase().includes(query)
    );

    if (!member) {
      throw new Error(`No member found matching "${memberIdOrPhone}"`);
    }

    const logs = await this.getAttendanceLogs();
    const todayStr = new Date().toISOString().split('T')[0];

    // Check if already checked in today
    const existingLog = logs.find((l) => l.memberId === member.id && l.date === todayStr);

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    if (existingLog) {
      if (existingLog.status === 'Checked-In') {
        // Mark Check-Out
        existingLog.checkOutTime = timeStr;
        existingLog.status = 'Checked-Out';
        await setItem(STORAGE_KEYS.ATTENDANCE, logs);
        return { action: 'checkout', log: existingLog, member };
      } else {
        throw new Error(`${member.name} has already checked out for today.`);
      }
    }

    // New Check-in
    const newLog = {
      id: `ATT-${Date.now().toString().slice(-4)}`,
      memberId: member.id,
      memberName: member.name,
      planName: member.planName,
      date: todayStr,
      checkInTime: timeStr,
      checkOutTime: '--',
      status: 'Checked-In'
    };

    const updatedLogs = [newLog, ...logs];
    await setItem(STORAGE_KEYS.ATTENDANCE, updatedLogs);
    return { action: 'checkin', log: newLog, member };
  },

  async getAttendanceStats() {
    const todayLogs = await this.getTodayAttendance();
    const totalMembers = (await membersService.getMembers()).length;
    const checkedInCount = todayLogs.filter(l => l.status === 'Checked-In').length;
    const totalTodayCount = todayLogs.length;

    return {
      totalTodayCount,
      checkedInCount,
      totalMembers,
      turnoutPercentage: totalMembers > 0 ? Math.round((totalTodayCount / totalMembers) * 100) : 0
    };
  }
};
