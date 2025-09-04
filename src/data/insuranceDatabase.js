// Mock database of existing insurance policies
export const EXISTING_POLICIES = [
  {
    plate: 'ABC 1234',
    policyNumber: 'POL-2024-001',
    ownerName: 'Ahmad Bin Ali',
    expiryDate: '2026-08-15',
    status: 'active',
    insuranceType: 'Comprehensive',
    vehicleModel: 'Perodua Myvi 2025'
  },
  {
    plate: 'PJH 9196',
    policyNumber: 'POL-2024-002',
    ownerName: 'Sarah Lee',
    expiryDate: '2025-09-18',
    status: 'expiring_soon',
    insuranceType: 'Third Party',
    vehicleModel: 'Toyota Vios 2020'
  },
  {
    plate: 'PKD 3581',
    policyNumber: 'POL-2024-003',
    ownerName: 'Muhammad Hassan',
    expiryDate: '2026-01-02',
    status: 'active',
    insuranceType: 'Comprehensive',
    vehicleModel: 'Honda City 2018'
  },
  {
    plate: 'WXY 5678',
    policyNumber: 'POL-2024-004',
    ownerName: 'Lim Wei Ming',
    expiryDate: '2025-12-31',
    status: 'active',
    insuranceType: 'Comprehensive',
    vehicleModel: 'Proton Saga 2023'
  },
  {
    plate: 'JKL 9999',
    policyNumber: 'POL-2024-005',
    ownerName: 'Fatimah Binti Omar',
    expiryDate: '2026-03-20',
    status: 'active',
    insuranceType: 'Third Party',
    vehicleModel: 'Perodua Axia 2024'
  }
];

// Function to check if a plate has an existing policy
export function checkExistingPolicy(plateNumber) {
  const normalizedPlate = plateNumber?.toUpperCase().replace(/\s/g, '');
  
  const existingPolicy = EXISTING_POLICIES.find(policy => {
    const normalizedExistingPlate = policy.plate.replace(/\s/g, '');
    return normalizedExistingPlate === normalizedPlate;
  });

  if (!existingPolicy) {
    return { exists: false };
  }

  // Check if policy is still active
  const today = new Date();
  const expiryDate = new Date(existingPolicy.expiryDate);
  const isExpired = expiryDate < today;
  const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

  return {
    exists: true,
    policy: existingPolicy,
    isExpired,
    daysUntilExpiry,
    status: isExpired ? 'expired' : daysUntilExpiry <= 30 ? 'expiring_soon' : 'active'
  };
}

// Function to get policy status message
export function getPolicyStatusMessage(checkResult) {
  if (!checkResult.exists) {
    return null;
  }

  const { policy, isExpired, daysUntilExpiry, status } = checkResult;
  
  if (isExpired) {
    return {
      type: 'expired',
      title: 'Policy Expired',
      message: `This vehicle's insurance expired on ${policy.expiryDate}. You can proceed with a new policy.`,
      canProceed: true
    };
  }

  if (status === 'expiring_soon') {
    return {
      type: 'expiring_soon',
      title: 'Policy Expiring Soon',
      message: `This vehicle has an active policy expiring in ${daysUntilExpiry} days (${policy.expiryDate}). Do you want to renew early or transfer ownership?`,
      canProceed: true,
      showOptions: true
    };
  }

  return {
    type: 'active',
    title: 'Active Policy Found',
    message: `This vehicle already has an active policy until ${policy.expiryDate}. Do you want to renew early or transfer ownership?`,
    canProceed: false,
    showOptions: true
  };
}
