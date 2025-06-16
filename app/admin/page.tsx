'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  DollarSign, 
  Download, 
  UserPlus, 
  CheckCircle, 
  XCircle,
  Clock,
  TrendingUp,
  Eye,
  EyeOff
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [adminData, setAdminData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (adminToken) {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchAdminData = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();
      if (data.success) {
        setAdminData(data);
      }
    } catch (error) {
      toast.error('Failed to fetch admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email !== 'admin@treasureclone.com' || password !== 'admin123') {
      toast.error('Invalid credentials');
      return;
    }

    localStorage.setItem('adminToken', 'admin-authenticated');
    setIsAuthenticated(true);
    fetchAdminData();
    toast.success('Welcome, Admin!');
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAuthenticated(false);
    router.push('/');
  };

  const handleDepositAction = async (depositId: string, action: 'approve' | 'reject') => {
    try {
      const response = await fetch('/api/admin/deposits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, action }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Deposit ${action}d successfully`);
        fetchAdminData();
      } else {
        toast.error(data.message || `Failed to ${action} deposit`);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  const handleWithdrawalAction = async (withdrawalId: string, action: 'complete' | 'reject') => {
    try {
      const response = await fetch('/api/admin/withdrawals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, action }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`Withdrawal ${action}d successfully`);
        fetchAdminData();
      } else {
        toast.error(data.message || `Failed to ${action} withdrawal`);
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-800 border-gray-700">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <TrendingUp className="h-8 w-8 text-yellow-400" />
              <span className="text-2xl font-bold text-white">Admin Panel</span>
            </div>
            <CardTitle className="text-2xl text-white">Admin Login</CardTitle>
            <CardDescription className="text-gray-300">
              Enter admin credentials to access the panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-700 border-gray-600 text-white"
                  placeholder="admin@treasureclone.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white pr-10"
                    placeholder="admin123"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                Login as Admin
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!adminData) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading admin data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-400">Manage users, deposits, and withdrawals</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="text-gray-300 border-gray-600">
            Logout
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Users</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{adminData.stats.totalUsers}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Deposits</CardTitle>
              <DollarSign className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${adminData.stats.totalDeposits.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Withdrawals</CardTitle>
              <Download className="h-4 w-4 text-red-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${adminData.stats.totalWithdrawals.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Pending Actions</CardTitle>
              <Clock className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {adminData.stats.pendingDeposits + adminData.stats.pendingWithdrawals}
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="deposits" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="deposits" className="text-white">Deposits</TabsTrigger>
            <TabsTrigger value="withdrawals" className="text-white">Withdrawals</TabsTrigger>
            <TabsTrigger value="users" className="text-white">Users</TabsTrigger>
            <TabsTrigger value="referrals" className="text-white">Referrals</TabsTrigger>
          </TabsList>

          <TabsContent value="deposits">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Deposit Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Review and approve deposit requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.deposits.map((deposit: any) => (
                    <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-white font-medium">${deposit.amount.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">{deposit.userEmail}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(deposit.createdAt).toLocaleString()}
                          </p>
                          {deposit.txHash && (
                            <p className="text-gray-500 text-xs font-mono">
                              {deposit.txHash.substring(0, 20)}...
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={deposit.status === 'pending' ? 'secondary' : deposit.status === 'approved' ? 'default' : 'destructive'}
                        >
                          {deposit.status}
                        </Badge>
                        {deposit.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleDepositAction(deposit.id, 'approve')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDepositAction(deposit.id, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Withdrawal Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Process withdrawal requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.withdrawals.map((withdrawal: any) => (
                    <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-white font-medium">${withdrawal.amount.toFixed(2)}</p>
                          <p className="text-gray-400 text-sm">{withdrawal.userEmail}</p>
                          <p className="text-gray-500 text-xs">
                            {new Date(withdrawal.createdAt).toLocaleString()}
                          </p>
                          <p className="text-gray-500 text-xs font-mono">
                            {withdrawal.walletAddress.substring(0, 20)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge 
                          variant={
                            withdrawal.status === 'pending' ? 'secondary' : 
                            withdrawal.status === 'completed' ? 'default' : 
                            withdrawal.status === 'processing' ? 'outline' : 'destructive'
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                        {withdrawal.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleWithdrawalAction(withdrawal.id, 'complete')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <CheckCircle className="w-4 h-4 mr-1" />
                              Complete
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleWithdrawalAction(withdrawal.id, 'reject')}
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">
                  View and manage all users
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">{user.email}</p>
                        <p className="text-gray-400 text-sm">Balance: ${user.balance.toFixed(2)}</p>
                        <p className="text-gray-500 text-xs">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-white">Ref: {user.referralCode}</p>
                        <p className="text-gray-400 text-sm">
                          Deposited: ${user.totalDeposited.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Withdrawn: ${user.totalWithdrawn.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="referrals">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Referral Activity</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor referral commissions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {adminData.referrals.map((referral: any) => (
                    <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-white font-medium">
                          Level {referral.level} Referral
                        </p>
                        <p className="text-gray-400 text-sm">
                          Referrer: {referral.referrerEmail}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Referred: {referral.referredEmail}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {new Date(referral.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-medium">
                          +${referral.commission.toFixed(2)}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {referral.level === 1 ? '12%' : '8%'} commission
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}