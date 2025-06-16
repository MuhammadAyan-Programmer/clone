'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle, Clock, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function WithdrawPage() {
  const [amount, setAmount] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [withdrawals, setWithdrawals] = useState<any[]>([]);
  const [userBalance, setUserBalance] = useState(0);

  useEffect(() => {
    fetchWithdrawals();
    fetchUserBalance();
  }, []);

  const fetchWithdrawals = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/withdrawals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.withdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals');
    }
  };

  const fetchUserBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/balance', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setUserBalance(data.balance);
      }
    } catch (error) {
      console.error('Failed to fetch balance');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const withdrawAmount = parseFloat(amount);
    if (withdrawAmount < 25) {
      toast.error('Minimum withdrawal is $25');
      return;
    }

    if (withdrawAmount > userBalance) {
      toast.error('insufficient balance');
      return;
    }

    if (!walletAddress.trim()) {
      toast.error('Please enter your wallet address');
      return;
    }

    if (!password.trim()) {
      toast.error('Please enter your password');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: withdrawAmount, walletAddress, password }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Withdrawal request submitted successfully!');
        setAmount('');
        setWalletAddress('');
        setPassword('');
        fetchWithdrawals();
        fetchUserBalance();
      } else {
        toast.error(data.message || 'Failed to submit withdrawal');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Withdraw Funds</h1>
          <p className="text-gray-400">Request withdrawal to your USDT wallet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Withdrawal Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Withdrawal Request</CardTitle>
              <CardDescription className="text-gray-400">
                Available Balance: <span className="text-yellow-400 font-bold">${userBalance.toFixed(2)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="25"
                    max={userBalance}
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Minimum $25"
                  />
                  <p className="text-xs text-gray-400">
                    Minimum: $25 | Maximum: ${userBalance.toFixed(2)}
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="walletAddress" className="text-white">Your USDT (BEP20) Wallet Address</Label>
                  <Input
                    id="walletAddress"
                    type="text"
                    value={walletAddress}
                    onChange={(e) => setWalletAddress(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-gray-400">
                    Enter your BEP20 wallet address where you want to receive USDT
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-white">Account Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="bg-gray-700 border-gray-600 text-white pr-10"
                      placeholder="Enter your account password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">
                    Confirm your identity with your account password
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={loading || userBalance < 25}
                >
                  {loading ? 'Submitting...' : 'Submit Withdrawal Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdrawal Info */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Withdrawal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Minimum Withdrawal:</span>
                  <span className="text-white">$25.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Processing Time:</span>
                  <span className="text-white">24-48 hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-white">BEP20 (BSC)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Transaction Fee:</span>
                  <span className="text-white">$0.00</span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-100 font-medium">Important Notes:</p>
                    <ul className="text-yellow-200 text-sm mt-1 space-y-1">
                      <li>• Double-check your wallet address</li>
                      <li>• Only BEP20 network supported</li>
                      <li>• Requests are processed manually</li>
                      <li>• No fees for withdrawals</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-blue-900 border border-blue-600 rounded-lg">
                <p className="text-blue-100 text-sm">
                  <strong>Processing:</strong> All withdrawal requests are reviewed and processed within 24-48 hours. 
                  You'll receive your USDT directly to your specified wallet address.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Withdrawal History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Withdrawal History</CardTitle>
            <CardDescription className="text-gray-400">Your recent withdrawal requests</CardDescription>
          </CardHeader>
          <CardContent>
            {withdrawals.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No withdrawals yet</p>
            ) : (
              <div className="space-y-4">
                {withdrawals.map((withdrawal) => (
                  <div key={withdrawal.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        withdrawal.status === 'completed' ? 'bg-green-900' : 
                        withdrawal.status === 'processing' ? 'bg-blue-900' :
                        withdrawal.status === 'pending' ? 'bg-yellow-900' : 'bg-red-900'
                      }`}>
                        {withdrawal.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : withdrawal.status === 'processing' ? (
                          <Clock className="w-5 h-5 text-blue-400" />
                        ) : withdrawal.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">${withdrawal.amount.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(withdrawal.createdAt).toLocaleString()}
                        </p>
                        <p className="text-gray-500 text-xs font-mono">
                          {withdrawal.walletAddress.substring(0, 10)}...{withdrawal.walletAddress.substring(withdrawal.walletAddress.length - 8)}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
    </DashboardLayout>
  );
}