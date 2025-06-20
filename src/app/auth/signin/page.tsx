'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Image from "next/image"

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login - redirect to dashboard
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image
                          src="/images/logo.png"
                          width={30}
                          height={30}
                          alt="CreatorsLab logo"
                        />
            </div>
            <span className="text-foreground text-xl font-semibold">creatorslab</span>
          </div>
        </div>

        <Card className="bg-card-box border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">Welcome to CreatorsLab</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300 text-sm">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="enter email"
                className="mt-2 bg-card-box border-gray-600 text-foreground placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300 text-sm">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="enter password"
                className="mt-2 bg-card-box border-gray-600 text-foreground placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-secondary text-foreground py-3 rounded-lg font-medium transition-colors"
            >
              Continue with email
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}