'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const roles = ['Super Admin', 'Admin', 'Moderator', 'Support'];

const rolePermissionsMap: Record<string, string[]> = {
  'Super Admin': [
    'User Management',
    'Task Management',
    'Engagement Management',
    'Analytics View',
    'System Settings',
    'Admin Management',
  ],
  Admin: [
    'User Management',
    'Task Management',
    'Engagement Management',
    'Analytics View',
    'Admin Management',
  ],
  Moderator: ['Task Management', 'Engagement Management', 'Analytics View'],
  Support: ['User Management'],
};

export default function NewAdminPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Admin',
    permissions: rolePermissionsMap['Admin'],
    status: 'Active',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      permissions: rolePermissionsMap[prev.role],
    }));
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      permissions: rolePermissionsMap[value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.message || 'Failed to create admin');
      router.push('/admins');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <Card className="p-6 bg-card-box border-border">
        <h1 className="text-xl font-semibold text-foreground mb-4">Create New Admin</h1>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name</Label>
            <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <Label htmlFor="role">Role</Label>
            <Select value={formData.role} onValueChange={handleRoleChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role} value={role}>
                    {role}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Permissions</Label>
            <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
              {formData.permissions.map((perm) => (
                <li key={perm}>{perm}</li>
              ))}
            </ul>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating...' : 'Create Admin'}
          </Button>
        </form>
      </Card>
    </div>
  );
}
