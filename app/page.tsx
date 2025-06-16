'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, Shield, Users, DollarSign } from 'lucide-react';

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  if (isAuthenticated) {
    router.push('/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-8 w-8 text-yellow-400" />
            <span className="text-2xl font-bold text-white">Treasure Clone</span>
          </div>
          <div className="space-x-4">
            <Link href="/auth/login">
              <Button variant="outline" className="text-white border-gray-600 hover:bg-gray-800">
                Login
              </Button>
            </Link>
            <Link href="/auth/register">
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-black">
                Get Started
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Earn <span className="text-yellow-400">1.8%</span> Daily ROI
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of investors earning passive income through our advanced trading algorithms and cryptocurrency investments.
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black text-lg px-8 py-3">
              Start Earning Now
            </Button>
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <TrendingUp className="h-12 w-12 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Daily ROI</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Earn 1.8% daily returns on your investments with compound growth.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Users className="h-12 w-12 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Referral Program</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Earn 12% from direct referrals and 8% from indirect referrals.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <Shield className="h-12 w-12 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Secure Platform</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Your investments are protected with enterprise-grade security.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <DollarSign className="h-12 w-12 text-yellow-400 mb-2" />
              <CardTitle className="text-white">Low Minimum</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-gray-300">
                Start investing with just $50 minimum deposit requirement.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Stats */}
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">10,000+</div>
              <div className="text-gray-300">Active Investors</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">$5M+</div>
              <div className="text-gray-300">Total Invested</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">$2M+</div>
              <div className="text-gray-300">Paid Out</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}