import { CourierStats } from "@/components/stats/OutcomeStats";

export const mockCourierStats: CourierStats[] = [
  {
    courier: "DHL",
    approvalRate: 89.2,
    medianDecisionDays: 12,
    averageRefund: 127.50,
    totalClaims: 156,
    approvedClaims: 139,
    rejectedClaims: 12,
    pendingClaims: 5
  },
  {
    courier: "FedEx",
    approvalRate: 85.7,
    medianDecisionDays: 14,
    averageRefund: 142.30,
    totalClaims: 134,
    approvedClaims: 115,
    rejectedClaims: 15,
    pendingClaims: 4
  },
  {
    courier: "UPS",
    approvalRate: 91.4,
    medianDecisionDays: 10,
    averageRefund: 118.75,
    totalClaims: 98,
    approvedClaims: 89,
    rejectedClaims: 6,
    pendingClaims: 3
  },
  {
    courier: "Royal Mail",
    approvalRate: 82.1,
    medianDecisionDays: 18,
    averageRefund: 95.20,
    totalClaims: 87,
    approvedClaims: 71,
    rejectedClaims: 13,
    pendingClaims: 3
  },
  {
    courier: "DPD",
    approvalRate: 87.5,
    medianDecisionDays: 15,
    averageRefund: 134.80,
    totalClaims: 64,
    approvedClaims: 56,
    rejectedClaims: 7,
    pendingClaims: 1
  },
  {
    courier: "Hermes",
    approvalRate: 79.3,
    medianDecisionDays: 20,
    averageRefund: 89.40,
    totalClaims: 58,
    approvedClaims: 46,
    rejectedClaims: 10,
    pendingClaims: 2
  }
];

export const getOverallStats = (courierStats: CourierStats[]) => {
  const totalClaims = courierStats.reduce((acc, courier) => acc + courier.totalClaims, 0);
  const totalApproved = courierStats.reduce((acc, courier) => acc + courier.approvedClaims, 0);
  const totalRejected = courierStats.reduce((acc, courier) => acc + courier.rejectedClaims, 0);
  const totalPending = courierStats.reduce((acc, courier) => acc + courier.pendingClaims, 0);
  
  return {
    totalClaims,
    totalApproved,
    totalRejected,
    totalPending,
    overallApprovalRate: (totalApproved / totalClaims) * 100,
    averageDecisionDays: courierStats.reduce((acc, courier) => acc + courier.medianDecisionDays, 0) / courierStats.length,
    averageRefundAmount: courierStats.reduce((acc, courier) => acc + courier.averageRefund, 0) / courierStats.length
  };
};
