'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Users, Copy, DollarSign, UserPlus, Share2 } from 'lucide-react';
import { toast } from 'sonner';

export default function ReferralsPage() {
  const [user, setUser] = useState<any>(null);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [referralStats, setReferralStats] = useState({
    directReferrals: 0,
    indirectReferrals: 0,
    totalCommissions: 0,
  });

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userData = localStorage.getItem('user');
      
      if (userData) {
        setUser(JSON.parse(userData));
      }

      const response = await fetch('/api/user/referrals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      const data = await response.json();
      if (data.success) {
        setReferrals(data.referrals);
        setReferralStats(data.stats);
      }
    } catch (error) {
      toast.error('Failed to fetch referral data');
    }
  };

  const getReferralLink = () => {
    if (!user) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/auth/register?ref=${user.referralCode}`;
  };

  const copyReferralLink = () => {
    const link = getReferralLink();
    navigator.clipboard.writeText(link);
    toast.success('Referral link copied to clipboard!');
  };

  const shareReferralLink = async () => {
    const link = getReferralLink();
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Treasure Clone - Earn 1.8% Daily ROI',
          text: 'Join me on Treasure Clone and start earning daily returns on your cryptocurrency investments!',
          url: link,
        });
      } catch (error) {
        copyReferralLink();
      }
    } else {
      copyReferralLink();
    }
  };

  if (!user) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading...</div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Referral Program</h1>
          <p className="text-gray-400">Earn commissions by referring new investors</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Direct Referrals</CardTitle>
              <UserPlus className="h-4 w-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{referralStats.directReferrals}</div>
              <p className="text-xs text-gray-400">25% commission each</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Indirect Referrals</CardTitle>
              <Users className="h-4 w-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{referralStats.indirectReferrals}</div>
              <p className="text-xs text-gray-400">10% commission each</p>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-300">Total Commissions</CardTitle>
              <DollarSign className="h-4 w-4 text-yellow-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">${referralStats.totalCommissions.toFixed(2)}</div>
              <p className="text-xs text-gray-400">Added to your balance</p>
            </CardContent>
          </Card>
        </div>

        {/* Referral Link */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Your Referral Link</CardTitle>
            <CardDescription className="text-gray-400">
              Share this link to earn commissions from new referrals
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-2">
              <Input
                value={getReferralLink()}
                readOnly
                className="bg-gray-700 border-gray-600 text-white font-mono text-sm"
              />
              <Button
                onClick={copyReferralLink}
                variant="outline"
                className="text-gray-300 border-gray-600 hover:bg-gray-700"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
              <Button
                onClick={shareReferralLink}
                className="bg-yellow-500 hover:bg-yellow-600 text-black"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-green-900 border border-green-600 rounded-lg">
                <h3 className="text-green-100 font-medium mb-2">Direct Referrals (Level 1)</h3>
                <p className="text-green-200 text-sm">
                  Earn <strong>25%</strong> commission from every deposit made by users who register using your link.
                </p>
              </div>
              <div className="p-4 bg-blue-900 border border-blue-600 rounded-lg">
                <h3 className="text-blue-100 font-medium mb-2">Indirect Referrals (Level 2)</h3>
                <p className="text-blue-200 text-sm">
                  Earn <strong>10%</strong> commission from deposits made by referrals of your direct referrals.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Referral History */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Referral History</CardTitle>
            <CardDescription className="text-gray-400">Your referral commissions and activity</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No referrals yet</p>
                <p className="text-gray-500 text-sm mt-2">
                  Share your referral link to start earning commissions
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {referrals.map((referral) => (
                  <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        referral.level === 1 ? 'bg-green-900' : 'bg-blue-900'
                      }`}>
                        {referral.level === 1 ? (
                          <UserPlus className="w-5 h-5 text-green-400" />
                        ) : (
                          <Users className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                      <div>
                        <p className="text-white font-medium">
                          Level {referral.level} Referral
                        </p>
                        <p className="text-gray-400 text-sm">
                          {new Date(referral.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-yellow-400 font-medium">
                        +${referral.commission.toFixed(2)}
                      </p>
                      <p className="text-gray-400 text-sm">
                        {referral.level === 1 ? '25%' : '10%'} commission
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How it Works */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">How Referrals Work</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  1
                </div>
                <div>
                  <p className="text-white font-medium">Share Your Link</p>
                  <p className="text-gray-400 text-sm">Copy and share your unique referral link with friends</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  2
                </div>
                <div>
                  <p className="text-white font-medium">They Register & Deposit</p>
                  <p className="text-gray-400 text-sm">New users sign up using your link and make their first deposit</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  3
                </div>
                <div>
                  <p className="text-white font-medium">Earn Commissions</p>
                  <p className="text-gray-400 text-sm">You earn 25% from direct referrals and 10% from their referrals</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-6 h-6 bg-yellow-500 text-black rounded-full flex items-center justify-center text-sm font-bold">
                  4
                </div>
                <div>
                  <p className="text-white font-medium">Instant Credit</p>
                  <p className="text-gray-400 text-sm">Commissions are automatically added to your balance</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}