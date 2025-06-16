export const calculateROI = (depositAmount: number, daysPassed: number): number => {
  const dailyRate = 0.018; // 1.8%
  return depositAmount * dailyRate * daysPassed;
};

export const getDaysPassed = (startDate: string): number => {
  const start = new Date(startDate);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - start.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const updateUserROI = (user: any, approvedDeposits: any[]): { balance: number; lastROIUpdate: string } => {
  const now = new Date().toISOString();
  const lastUpdate = new Date(user.lastROIUpdate || user.createdAt);
  const daysPassed = getDaysPassed(user.lastROIUpdate || user.createdAt);
  
  if (daysPassed === 0) {
    return { balance: user.balance, lastROIUpdate: user.lastROIUpdate };
  }
  
  let totalROI = 0;
  for (const deposit of approvedDeposits) {
    const depositDate = new Date(deposit.approvedAt || deposit.createdAt);
    if (depositDate <= lastUpdate) {
      // This deposit was already earning ROI
      totalROI += calculateROI(deposit.amount, daysPassed);
    } else {
      // This deposit started earning ROI after last update
      const depositDays = getDaysPassed(deposit.approvedAt || deposit.createdAt);
      totalROI += calculateROI(deposit.amount, depositDays);
    }
  }
  
  return {
    balance: user.balance + totalROI,
    lastROIUpdate: now
  };
};