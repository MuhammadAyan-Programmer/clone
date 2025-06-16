'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, Users, Download, Wallet, Clock } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

export default function DashboardPage() {
  const [userData, setUserData] = useState<any>(null);
  const [deposits, setDeposits] = useState<any[]>([]);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setUserData(data.user);
        setDeposits(data.deposits);
        setWithdrawals(data.withdrawals);
        setReferrals(data.referrals);
        
        // Update user in localStorage with latest data
        localStorage.setItem('user', JSON.stringify(data.user));
      }
    } catch (error) {
      toast.error('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  const totalDeposited = deposits
    .filter(d => d.status === 'approved')
    .reduce((sum, d) => sum + d.amount, 0);

  const totalWithdrawn = withdrawals
    .filter(w => w.status === 'completed')
    .reduce((sum, w) => sum + w.amount, 0);

  const pendingDeposits = deposits.filter(d => d.status === 'pending');
  const pendingWithdrawals = withdrawals.filter(w => w.status === 'pending');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Welcome back, {userData?.email}</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Current Balance</CardTitle>
              <Wallet className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${userData?.balance?.toFixed(2) || '0.00'}</div>
              <p className="text-xs text-gray-400">Available for withdrawal</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Deposited</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalDeposited.toFixed(2)}</div>
              <p className="text-xs text-gray-400">Lifetime deposits</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Withdrawn</CardTitle>
              <Download className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${totalWithdrawn.toFixed(2)}</div>
              <p className="text-xs text-gray-400">Lifetime withdrawals</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Referrals</CardTitle>
              <Users className="h-4 w-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{referrals.length}</div>
              <p className="text-xs text-gray-400">Total referrals</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/deposit">
            <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black">
              <DollarSign className="w-4 h-4 mr-2" />
              Make Deposit
            </Button>
          </Link>
          <Link href="/withdraw">
            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
              <Download className="w-4 h-4 mr-2" />
              Withdraw Funds
            </Button>
          </Link>
          <Link href="/referrals">
            <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white">
              <Users className="w-4 h-4 mr-2" />
              Referrals
            </Button>
          </Link>
          <Button 
            onClick={fetchUserData}
            variant="outline"
            className="w-full border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Deposits */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Deposits</CardTitle>
              <CardDescription className="text-gray-400">Your latest deposit transactions</CardDescription>
            </CardHeader>
            <CardContent>
              {deposits.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No deposits yet</p>
              ) : (
                <div className="space-y-4">
                  {deposits.slice(0, 5).map((deposit) => (
                    <div key={deposit.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          deposit.status === 'approved' ? 'bg-green-400' : 
                          deposit.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">${deposit.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        deposit.status === 'approved' ? 'bg-green-900 text-green-300' : 
                        deposit.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {deposit.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Withdrawals */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Withdrawals</CardTitle>
              <CardDescription className="text-gray-400">Your latest withdrawal requests</CardDescription>
            </CardHeader>
            <CardContent>
              {withdrawals.length === 0 ? (
                <p className="text-gray-400 text-center py-4">No withdrawals yet</p>
              ) : (
                <div className="space-y-4">
                  {withdrawals.slice(0, 5).map((withdrawal) => (
                    <div key={withdrawal.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          withdrawal.status === 'completed' ? 'bg-green-400' : 
                          withdrawal.status === 'processing' ? 'bg-blue-400' :
                          withdrawal.status === 'pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`} />
                        <div>
                          <p className="text-white font-medium">${withdrawal.amount.toFixed(2)}</p>
                          <p className="text-xs text-gray-400">
                            {new Date(withdrawal.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        withdrawal.status === 'completed' ? 'bg-green-900 text-green-300' : 
                        withdrawal.status === 'processing' ? 'bg-blue-900 text-blue-300' :
                        withdrawal.status === 'pending' ? 'bg-yellow-900 text-yellow-300' : 'bg-red-900 text-red-300'
                      }`}>
                        {withdrawal.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Pending Items Alert */}
        {(pendingDeposits.length > 0 || pendingWithdrawals.length > 0) && (
          <Card className="bg-yellow-900 border-yellow-600">
            <CardHeader>
              <CardTitle className="text-yellow-100 flex items-center">
                <Clock className="w-5 h-5 mr-2" />
                Pending Transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="text-yellow-200">
              {pendingDeposits.length > 0 && (
                <p>You have {pendingDeposits.length} pending deposit(s) awaiting approval.</p>
              )}
              {pendingWithdrawals.length > 0 && (
                <p>You have {pendingWithdrawals.length} pending withdrawal(s) being processed.</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}