import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

export interface User {
  id: string;
  email: string;
  password: string;
  referralCode: string;
  referredBy?: string;
  balance: number;
  totalDeposited: number;
  totalWithdrawn: number;
  lastROIUpdate: string;
  createdAt: string;
}

export interface Deposit {
  id: string;
  userId: string;
  amount: number;
  status: 'pending' | 'approved' | 'rejected';
  txHash?: string;
  createdAt: string;
  approvedAt?: string;
}

export interface Withdrawal {
  id: string;
  userId: string;
  amount: number;
  walletAddress: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  createdAt: string;
  processedAt?: string;
}

export interface Referral {
  id: string;
  referrerId: string;
  referredId: string;
  level: number; // 1 for direct, 2 for indirect
  commission: number;
  createdAt: string;
}

const getFilePath = (filename: string) => path.join(DATA_DIR, filename);

const readJSONFile = <T>(filename: string): T[] => {
  const filePath = getFilePath(filename);
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  const data = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(data);
};

const writeJSONFile = <T>(filename: string, data: T[]) => {
  const filePath = getFilePath(filename);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// User operations
export const getUsers = (): User[] => readJSONFile<User>('users.json');

export const getUserById = (id: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.id === id);
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};

export const getUserByReferralCode = (code: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.referralCode === code);
};

export const createUser = (user: Omit<User, 'id'>): User => {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: Date.now().toString(),
  };
  users.push(newUser);
  writeJSONFile('users.json', users);
  return newUser;
};

export const updateUser = (id: string, updates: Partial<User>): User | null => {
  const users = getUsers();
  const index = users.findIndex(user => user.id === id);
  if (index === -1) return null;
  
  users[index] = { ...users[index], ...updates };
  writeJSONFile('users.json', users);
  return users[index];
};

// Deposit operations
export const getDeposits = (): Deposit[] => readJSONFile<Deposit>('deposits.json');

export const getDepositsByUserId = (userId: string): Deposit[] => {
  const deposits = getDeposits();
  return deposits.filter(deposit => deposit.userId === userId);
};

export const createDeposit = (deposit: Omit<Deposit, 'id'>): Deposit => {
  const deposits = getDeposits();
  const newDeposit: Deposit = {
    ...deposit,
    id: Date.now().toString(),
  };
  deposits.push(newDeposit);
  writeJSONFile('deposits.json', deposits);
  return newDeposit;
};

export const updateDeposit = (id: string, updates: Partial<Deposit>): Deposit | null => {
  const deposits = getDeposits();
  const index = deposits.findIndex(deposit => deposit.id === id);
  if (index === -1) return null;
  
  deposits[index] = { ...deposits[index], ...updates };
  writeJSONFile('deposits.json', deposits);
  return deposits[index];
};

// Withdrawal operations
export const getWithdrawals = (): Withdrawal[] => readJSONFile<Withdrawal>('withdrawals.json');

export const getWithdrawalsByUserId = (userId: string): Withdrawal[] => {
  const withdrawals = getWithdrawals();
  return withdrawals.filter(withdrawal => withdrawal.userId === userId);
};

export const createWithdrawal = (withdrawal: Omit<Withdrawal, 'id'>): Withdrawal => {
  const withdrawals = getWithdrawals();
  const newWithdrawal: Withdrawal = {
    ...withdrawal,
    id: Date.now().toString(),
  };
  withdrawals.push(newWithdrawal);
  writeJSONFile('withdrawals.json', withdrawals);
  return newWithdrawal;
};

export const updateWithdrawal = (id: string, updates: Partial<Withdrawal>): Withdrawal | null => {
  const withdrawals = getWithdrawals();
  const index = withdrawals.findIndex(withdrawal => withdrawal.id === id);
  if (index === -1) return null;
  
  withdrawals[index] = { ...withdrawals[index], ...updates };
  writeJSONFile('withdrawals.json', withdrawals);
  return withdrawals[index];
};

// Referral operations
export const getReferrals = (): Referral[] => readJSONFile<Referral>('referrals.json');

export const getReferralsByUserId = (userId: string): Referral[] => {
  const referrals = getReferrals();
  return referrals.filter(referral => referral.referrerId === userId);
};

export const createReferral = (referral: Omit<Referral, 'id'>): Referral => {
  const referrals = getReferrals();
  const newReferral: Referral = {
    ...referral,
    id: Date.now().toString(),
  };
  referrals.push(newReferral);
  writeJSONFile('referrals.json', referrals);
  return newReferral;
};