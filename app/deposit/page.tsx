'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Copy, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function DepositPage() {
  const [amount, setAmount] = useState('');
  const [txHash, setTxHash] = useState('');
  const [loading, setLoading] = useState(false);
  const [deposits, setDeposits] = useState<any[]>([]);

  const walletAddress = '0xD0F01a65C4dE886D333536241b2415a43289Bf7c';

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/deposits', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (error) {
      console.error('Failed to fetch deposits');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    if (depositAmount < 50) {
      toast.error('Minimum deposit is $50');
      return;
    }

    if (!txHash.trim()) {
      toast.error('Please enter transaction hash');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/user/deposit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: depositAmount, txHash }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success('Deposit submitted successfully! Awaiting approval.');
        setAmount('');
        setTxHash('');
        fetchDeposits();
      } else {
        toast.error(data.message || 'Failed to submit deposit');
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
          <h1 className="text-3xl font-bold text-white">Make Deposit</h1>
          <p className="text-gray-400">Deposit USDT to start earning daily ROI</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Deposit Form */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Deposit USDT</CardTitle>
              <CardDescription className="text-gray-400">
                Send USDT (BEP20) to the address below and submit your transaction hash
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Wallet Address */}
              <div className="space-y-2">
                <Label className="text-white">USDT (BEP20) Wallet Address</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    value={walletAddress}
                    readOnly
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(walletAddress)}
                    className="text-gray-300 border-gray-600 hover:bg-gray-700"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-400">
                  Only send USDT (BEP20) to this address. Other tokens will be lost.
                </p>
              </div>

              {/* Deposit Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-white">Amount (USD)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="50"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white"
                    placeholder="Minimum $50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="txHash" className="text-white">Transaction Hash</Label>
                  <Input
                    id="txHash"
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    required
                    className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
                    placeholder="0x..."
                  />
                  <p className="text-xs text-gray-400">
                    Enter the transaction hash from your wallet after sending USDT
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-yellow-500 hover:bg-yellow-600 text-black"
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit Deposit'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">How to Deposit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    1
                  </div>
                  <div>
                    <p className="text-white font-medium">Copy Wallet Address</p>
                    <p className="text-gray-400 text-sm">Copy our USDT (BEP20) wallet address above</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    2
                  </div>
                  <div>
                    <p className="text-white font-medium">Send USDT</p>
                    <p className="text-gray-400 text-sm">Send USDT (BEP20) from your wallet to our address</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    3
                  </div>
                  <div>
                    <p className="text-white font-medium">Submit Transaction</p>
                    <p className="text-gray-400 text-sm">Enter the amount and transaction hash in the form</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                    4
                  </div>
                  <div>
                    <p className="text-white font-medium">Wait for Approval</p>
                    <p className="text-gray-400 text-sm">We'll verify and approve your deposit within 24 hours</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-900 border border-yellow-600 rounded-lg">
                <div className="flex items-start space-x-2">
                  <AlertCircle className="w-5 h-5 text-yellow-400 mt-0.5" />
                  <div>
                    <p className="text-yellow-100 font-medium">Important Notes:</p>
                    <ul className="text-yellow-200 text-sm mt-1 space-y-1">
                      <li>• Minimum deposit: $50</li>
                      <li>• Only USDT (BEP20) accepted</li>
                      <li>• ROI starts after approval</li>
                      <li>• Daily ROI: 1.8%</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deposit History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Deposit History</CardTitle>
            <CardDescription className="text-gray-400">Your recent deposit transactions</CardDescription>
          </CardHeader>
          <CardContent>
            {deposits.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No deposits yet</p>
            ) : (
              <div className="space-y-4">
                {deposits.map((deposit) => (
                  <div key={deposit.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        deposit.status === 'approved' ? 'bg-green-900' : 
                        deposit.status === 'pending' ? 'bg-yellow-900' : 'bg-red-900'
                      }`}>
                        {deposit.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : deposit.status === 'pending' ? (
                          <Clock className="w-5 h-5 text-yellow-400" />
                        ) : (
                          <AlertCircle className="w-5 h-5 text-red-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">${deposit.amount.toFixed(2)}</p>
                        <p className="text-gray-400 text-sm">
                          {new Date(deposit.createdAt).toLocaleString()}
                        </p>
                        {deposit.txHash && (
                          <p className="text-gray-500 text-xs font-mono">
                            {deposit.txHash.substring(0, 10)}...{deposit.txHash.substring(deposit.txHash.length - 8)}
                          </p>
                        )}
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
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
      </div>
    </DashboardLayout>
  );
}