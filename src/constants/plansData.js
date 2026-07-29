export const MEMBERSHIP_PLANS = [
  {
    id: 'plan_weight',
    name: 'Weight Training',
    price: 1500,
    currency: 'Rs',
    billingCycle: 'Monthly',
    badge: 'Popular',
    features: [
      'Full Gym Floor Access',
      'Weight Training & Free Weights',
      'Locker Facility Access',
      'General Fitness Guidance'
    ],
    accentColor: '#3b82f6'
  },
  {
    id: 'plan_treadmill',
    name: 'Weight Training + Treadmill',
    price: 2500,
    currency: 'Rs',
    billingCycle: 'Monthly',
    badge: 'Best Value',
    features: [
      'Full Gym & Free Weights Access',
      'Unlimited Treadmill & Cardio Zone',
      'Locker & Shower Facility',
      'Monthly Fitness Assessment',
      'Steam Room Access'
    ],
    accentColor: '#f97316'
  },
  {
    id: 'plan_premium',
    name: 'Premium Trainer + Diet Plan',
    price: 5000,
    currency: 'Rs',
    billingCycle: 'Monthly',
    badge: 'VIP Elite',
    features: [
      'Dedicated 1-on-1 Personal Trainer',
      'Customized Nutrition & Diet Plan',
      'Unlimited Gym + Cardio + Steam',
      'Body Composition Tracking (InBody)',
      'Priority Locker & Free Protein Shakes'
    ],
    accentColor: '#10b981'
  }
];

export const GYM_INFO = {
  name: 'Fitness Lover Gym',
  tagline: 'Transform Your Body, Elevate Your Soul',
  address: 'Plot 45, Fitness Boulevard, MG Road Sector 14, Near City Mall',
  phone: '+91 98765 43210',
  email: 'contact@fitnesslovergym.com',
  gstin: '07AAACF1234H1Z5',
  currencySymbol: 'Rs'
};
