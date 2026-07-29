/**
 * WhatsApp Integration Service (whatsappService.js)
 * 
 * Formats customized WhatsApp fee reminder messages and handles direct 
 * wa.me redirection for mobile and web.
 */

export const whatsappService = {
  // Format phone number to international standard without spaces or hyphens
  formatPhoneNumber(phoneStr) {
    if (!phoneStr) return '';
    let cleaned = phoneStr.replace(/[^\d+]/g, '');
    
    // If Indian number starts without country code, add +91
    if (cleaned.length === 10) {
      cleaned = '91' + cleaned;
    } else if (cleaned.startsWith('+')) {
      cleaned = cleaned.substring(1);
    }
    return cleaned;
  },

  // Generate personalized fee reminder template
  generateReminderMessage(member, alert, gymInfo) {
    const gymName = gymInfo ? gymInfo.name : 'Fitness Lover Gym';
    const gymPhone = gymInfo ? gymInfo.phone : '+91 98765 43210';
    
    const daysOverdueText = alert.daysOverdue > 0 
      ? `(${alert.daysOverdue} days past due date)`
      : '';

    return `Hello *${member.name}*! 👋

This is a gentle fee reminder from *${gymName}*. 🏋️‍♂️

📌 *Membership Plan:* ${member.planName}
💰 *Monthly Fee:* Rs ${member.monthlyFee.toLocaleString('en-IN')}
📅 *Due Date:* ${member.dueDate} ${daysOverdueText}

Please make your fee payment at the gym front desk or via UPI to keep your membership active. 

If you have already paid, please ignore this message or reply with your receipt screenshot.

Thank you!
_*${gymName} Team*_
📞 Contact: ${gymPhone}`;
  },

  // Open WhatsApp chat in a new browser window/tab
  sendReminder(phone, messageText) {
    const formattedPhone = this.formatPhoneNumber(phone);
    if (!formattedPhone) {
      alert('Invalid phone number for WhatsApp.');
      return false;
    }

    const encodedText = encodeURIComponent(messageText);
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedText}`;
    window.open(whatsappUrl, '_blank');
    return true;
  }
};
