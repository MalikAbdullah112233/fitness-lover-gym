export const initialTrainers = [
  {
    id: 'TRN-101',
    name: 'Vikram Sharma',
    phone: '+91 98111 22334',
    email: 'vikram.trains@fitnesslovergym.com',
    specialty: 'Bodybuilding & Heavy Weightlifting',
    experience: '6 Years',
    shift: 'Morning (6:00 AM - 12:00 PM)',
    status: 'Active',
    rating: 4.9,
    assignedClientsCount: 14,
    avatar: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TRN-102',
    name: 'Ananya Verma',
    phone: '+91 98222 33445',
    email: 'ananya.v@fitnesslovergym.com',
    specialty: 'Cardio, HIIT & Weight Loss Specialist',
    experience: '4 Years',
    shift: 'Evening (4:00 PM - 10:00 PM)',
    status: 'Active',
    rating: 4.8,
    assignedClientsCount: 18,
    avatar: 'https://images.unsplash.com/photo-1594381898411-846e7d193883?w=150&auto=format&fit=crop&q=80'
  },
  {
    id: 'TRN-103',
    name: 'Rohan Deshmukh',
    phone: '+91 98333 44556',
    email: 'rohan.d@fitnesslovergym.com',
    specialty: 'Certified Clinical Dietitian & Personal Trainer',
    experience: '8 Years',
    shift: 'Full Day (Flexi)',
    status: 'Active',
    rating: 5.0,
    assignedClientsCount: 12,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  }
];

export const initialMembers = [
  {
    id: 'FLG-1001',
    name: 'Rahul Kapoor',
    phone: '+91 98712 34567',
    email: 'rahul.k@gmail.com',
    address: 'Flat 402, Green Park Apartments, MG Road',
    joiningDate: '2026-01-10',
    planId: 'plan_premium',
    planName: 'Premium Trainer + Diet Plan',
    monthlyFee: 5000,
    dueDate: '2026-08-10',
    lastPaymentDate: '2026-07-10',
    feeStatus: 'Paid', // Paid | Overdue | Pending
    status: 'Active', // Active | Inactive | Expired
    trainerId: 'TRN-103',
    trainerName: 'Rohan Deshmukh',
    gender: 'Male',
    age: 28,
    bloodGroup: 'O+',
    emergencyContact: '+91 98712 99999'
  },
  {
    id: 'FLG-1002',
    name: 'Priya Singh',
    phone: '+91 98999 11223',
    email: 'priya.singh@yahoo.com',
    address: 'House 12B, Civil Lines, Near Metro Gate 2',
    joiningDate: '2026-02-15',
    planId: 'plan_treadmill',
    planName: 'Weight Training + Treadmill',
    monthlyFee: 2500,
    dueDate: '2026-07-15', // Passed due date -> Late Fee Alert!
    lastPaymentDate: '2026-06-15',
    feeStatus: 'Overdue',
    status: 'Active',
    trainerId: 'TRN-102',
    trainerName: 'Ananya Verma',
    gender: 'Female',
    age: 25,
    bloodGroup: 'B+',
    emergencyContact: '+91 98999 00000'
  },
  {
    id: 'FLG-1003',
    name: 'Amit Patel',
    phone: '+91 97111 88776',
    email: 'amit.patel@outlook.com',
    address: 'B-704, Royal Palms, Sector 21',
    joiningDate: '2026-03-01',
    planId: 'plan_weight',
    planName: 'Weight Training',
    monthlyFee: 1500,
    dueDate: '2026-07-20', // Overdue by a few days!
    lastPaymentDate: '2026-06-20',
    feeStatus: 'Overdue',
    status: 'Active',
    trainerId: 'TRN-101',
    trainerName: 'Vikram Sharma',
    gender: 'Male',
    age: 32,
    bloodGroup: 'A+',
    emergencyContact: '+91 97111 22222'
  },
  {
    id: 'FLG-1004',
    name: 'Neha Mehta',
    phone: '+91 99555 44332',
    email: 'neha.m@gmail.com',
    address: '54, Sunrise Enclave, Park Street',
    joiningDate: '2026-04-12',
    planId: 'plan_premium',
    planName: 'Premium Trainer + Diet Plan',
    monthlyFee: 5000,
    dueDate: '2026-08-12',
    lastPaymentDate: '2026-07-12',
    feeStatus: 'Paid',
    status: 'Active',
    trainerId: 'TRN-103',
    trainerName: 'Rohan Deshmukh',
    gender: 'Female',
    age: 29,
    bloodGroup: 'AB+',
    emergencyContact: '+91 99555 11111'
  },
  {
    id: 'FLG-1005',
    name: 'Karan Malhotra',
    phone: '+91 98444 33221',
    email: 'karan.m@gmail.com',
    address: 'C-12, Model Town, Phase 1',
    joiningDate: '2026-05-01',
    planId: 'plan_weight',
    planName: 'Weight Training',
    monthlyFee: 1500,
    dueDate: '2026-08-01',
    lastPaymentDate: '2026-07-01',
    feeStatus: 'Paid',
    status: 'Active',
    trainerId: 'TRN-101',
    trainerName: 'Vikram Sharma',
    gender: 'Male',
    age: 24,
    bloodGroup: 'O-',
    emergencyContact: '+91 98444 00000'
  },
  {
    id: 'FLG-1006',
    name: 'Sonia Joshi',
    phone: '+91 97888 66554',
    email: 'sonia.j@hotmail.com',
    address: '99, Lake View Villas, Outer Ring Road',
    joiningDate: '2026-06-18',
    planId: 'plan_treadmill',
    planName: 'Weight Training + Treadmill',
    monthlyFee: 2500,
    dueDate: '2026-07-18', // Overdue
    lastPaymentDate: '2026-06-18',
    feeStatus: 'Overdue',
    status: 'Active',
    trainerId: 'TRN-102',
    trainerName: 'Ananya Verma',
    gender: 'Female',
    age: 31,
    bloodGroup: 'B-',
    emergencyContact: '+91 97888 11111'
  }
];

export const initialFeeTransactions = [
  {
    id: 'REC-2026-001',
    memberId: 'FLG-1001',
    memberName: 'Rahul Kapoor',
    planName: 'Premium Trainer + Diet Plan',
    amount: 5000,
    paymentDate: '2026-07-10',
    dueDate: '2026-08-10',
    mode: 'UPI (GPay)',
    transactionRef: 'UPI/98761234/OKAXIS',
    status: 'Success',
    notes: 'Regular monthly renewal'
  },
  {
    id: 'REC-2026-002',
    memberId: 'FLG-1004',
    memberName: 'Neha Mehta',
    planName: 'Premium Trainer + Diet Plan',
    amount: 5000,
    paymentDate: '2026-07-12',
    dueDate: '2026-08-12',
    mode: 'Credit Card',
    transactionRef: 'CC/7891-XXXX-4321',
    status: 'Success',
    notes: 'Card payment processed at counter'
  },
  {
    id: 'REC-2026-003',
    memberId: 'FLG-1005',
    memberName: 'Karan Malhotra',
    planName: 'Weight Training',
    amount: 1500,
    paymentDate: '2026-07-01',
    dueDate: '2026-08-01',
    mode: 'Cash',
    transactionRef: 'CASH-REC-104',
    status: 'Success',
    notes: 'Cash received by admin'
  }
];

export const initialAttendanceLogs = [
  {
    id: 'ATT-901',
    memberId: 'FLG-1001',
    memberName: 'Rahul Kapoor',
    planName: 'Premium Trainer + Diet Plan',
    date: '2026-07-26',
    checkInTime: '07:15 AM',
    checkOutTime: '08:45 AM',
    status: 'Checked-Out'
  },
  {
    id: 'ATT-902',
    memberId: 'FLG-1004',
    memberName: 'Neha Mehta',
    planName: 'Premium Trainer + Diet Plan',
    date: '2026-07-26',
    checkInTime: '08:00 AM',
    checkOutTime: '--',
    status: 'Checked-In'
  },
  {
    id: 'ATT-903',
    memberId: 'FLG-1005',
    memberName: 'Karan Malhotra',
    planName: 'Weight Training',
    date: '2026-07-26',
    checkInTime: '06:30 AM',
    checkOutTime: '07:45 AM',
    status: 'Checked-Out'
  },
  {
    id: 'ATT-904',
    memberId: 'FLG-1002',
    memberName: 'Priya Singh',
    planName: 'Weight Training + Treadmill',
    date: '2026-07-25',
    checkInTime: '05:30 PM',
    checkOutTime: '07:00 PM',
    status: 'Checked-Out'
  }
];

export const initialOnlineRegistrations = [
  {
    id: 'REG-501',
    applicantName: 'Siddharth Rao',
    phone: '+91 98123 99887',
    email: 'siddharth.rao@gmail.com',
    address: '104, Green Avenue, Sector 15',
    preferredPlanId: 'plan_treadmill',
    preferredPlanName: 'Weight Training + Treadmill',
    monthlyFee: 2500,
    requestedStartDate: '2026-08-01',
    submittedAt: '2026-07-25 14:30',
    status: 'Pending', // Pending | Approved | Rejected
    notes: 'Wants morning slot 7am to 8am'
  },
  {
    id: 'REG-502',
    applicantName: 'Pooja Bhatt',
    phone: '+91 97777 55443',
    email: 'pooja.bhatt@outlook.com',
    address: 'Flat 302, Skyline Towers',
    preferredPlanId: 'plan_premium',
    preferredPlanName: 'Premium Trainer + Diet Plan',
    monthlyFee: 5000,
    requestedStartDate: '2026-08-05',
    submittedAt: '2026-07-26 09:15',
    status: 'Pending',
    notes: 'Interested in personal training with Rohan'
  }
];
