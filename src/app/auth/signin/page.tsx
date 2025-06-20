'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const res = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    setLoading(false);

    if (res?.ok) {
      router.push('/');
    } else {
      alert(res?.error || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    signIn('google');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center">
              <Image src="/images/logo.png" width={30} height={30} alt="CreatorsLab logo" />
            </div>
            <span className="text-foreground text-xl font-semibold">creatorslab</span>
          </div>
        </div>

        <Card className="bg-card-box border-border p-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold text-foreground mb-2">
              Welcome back, Admin 👋
            </h1>
            <p className="text-muted-foreground text-sm">
              Manage users, tasks, and platform engagement efficiently.
            </p>
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
                className="mt-2 bg-card-box border-gray-600 text-foreground placeholder-gray-400"
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
                className="mt-2 bg-card-box border-gray-600 text-foreground placeholder-gray-400"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-primary hover:bg-secondary text-foreground py-3 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Continue with email'}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <Button
              variant="outline"
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 text-sm"
            >
              <FcGoogle size={18} />
              Continue with Google
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
