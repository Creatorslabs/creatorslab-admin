'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: 'Active' | 'Restricted' | 'Banned';
  lastLogin: string;
  createdAt: string;
}

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (admin: Partial<Admin>) => void;
  admin?: Admin | null;
  mode: 'add' | 'edit' | 'restrict' | 'ban' | 'unrestrict' | 'unban' | 'delete';
}

const roleOptions = [
  { value: 'Super Admin', label: 'Super Admin' },
  { value: 'Admin', label: 'Admin' },
  { value: 'Moderator', label: 'Moderator' },
  { value: 'Support', label: 'Support' },
];

const permissionOptions = [
  'User Management',
  'Task Management',
  'Engagement Management',
  'Analytics View',
  'System Settings',
  'Admin Management',
];

export function AdminFormModal({ isOpen, onClose, onSubmit, admin, mode }: AdminFormModalProps) {
  const [formData, setFormData] = useState<Partial<Admin>>({
    name: '',
    email: '',
    role: '',
    permissions: [],
    status: 'Active',
  });

  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions,
        status: admin.status,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: '',
        permissions: [],
        status: 'Active',
      });
    }
  }, [admin, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let submitData: Partial<Admin> = { ...formData };

    if (admin && ['restrict', 'unrestrict', 'ban', 'unban', 'delete'].includes(mode)) {
      submitData = {
        id: admin.id,
        status:
          mode === 'restrict'
            ? 'Restricted'
            : mode === 'unrestrict'
            ? 'Active'
            : mode === 'ban'
            ? 'Banned'
            : mode === 'unban'
            ? 'Active'
            : admin.status,
      };
    }

    onSubmit(submitData);
    onClose();
  };

  const handlePermissionToggle = (permission: string) => {
    setFormData((prev) => {
      const currentPermissions = prev.permissions ?? [];
      return {
        ...prev,
        permissions: currentPermissions.includes(permission)
          ? currentPermissions.filter((p) => p !== permission)
          : [...currentPermissions, permission],
      };
    });
  };

  const getModalTitle = () => {
    switch (mode) {
      case 'add':
        return 'Add New Admin';
      case 'edit':
        return 'Edit Admin';
      case 'restrict':
        return 'Restrict Admin Access';
      case 'unrestrict':
        return 'Unrestrict Admin Access';
      case 'ban':
        return 'Ban Admin';
      case 'unban':
        return 'Unban Admin';
      case 'delete':
        return 'Delete Admin';
      default:
        return 'Admin Management';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'add':
        return 'Add Admin';
      case 'edit':
        return 'Update Admin';
      case 'restrict':
        return 'Restrict';
      case 'unrestrict':
        return 'Unrestrict';
      case 'ban':
        return 'Ban';
      case 'unban':
        return 'Unban';
      case 'delete':
        return 'Delete';
      default:
        return 'Submit';
    }
  };

  const renderConfirmationCard = () => (
    <div className="space-y-4">
      <p className="text-gray-300">
        {mode === 'restrict' && `Restrict access for ${admin?.name}? They’ll have limited permissions.`}
        {mode === 'unrestrict' && `Unrestrict ${admin?.name}? They’ll regain full access.`}
        {mode === 'ban' && `Ban ${admin?.name}? They’ll lose all access.`}
        {mode === 'unban' && `Unban ${admin?.name}? They’ll regain access.`}
        {mode === 'delete' && `Are you sure you want to permanently delete ${admin?.name}? This action cannot be undone.`}
      </p>
      <div className="bg-card p-3 rounded-lg">
        <p className="text-sm text-gray-300">Admin: {admin?.name}</p>
        <p className="text-sm text-gray-300">Email: {admin?.email}</p>
        <p className="text-sm text-gray-300">Role: {admin?.role}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-box border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{getModalTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {['restrict', 'unrestrict', 'ban', 'unban', 'delete'].includes(mode) ? (
            renderConfirmationCard()
          ) : (
            <>
              <div>
                <Label htmlFor="name" className="text-gray-300">
                  Full Name
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-card border-border text-white"
                  placeholder="Enter full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                  className="mt-1 bg-card border-border text-white"
                  placeholder="Enter email address"
                  required
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-300">
                  Role
                </Label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, role: value }))}
                >
                  <SelectTrigger className="mt-1 bg-card border-border text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {roleOptions.map((role) => (
                      <SelectItem key={role.value} value={role.value} className="text-white hover:bg-border">
                        {role.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-gray-300">Permissions</Label>
                <div className="mt-2 flex flex-wrap gap-3 max-h-40 overflow-y-auto">
  {permissionOptions.map((permission) => (
    <label
      key={permission}
      className="flex items-center space-x-2 bg-card p-2 rounded-md"
    >
      <input
        type="checkbox"
        checked={formData.permissions?.includes(permission)}
        onChange={() => handlePermissionToggle(permission)}
        className="rounded border-border bg-gray-700 text-purple-600 focus:ring-purple-500"
      />
      <span className="text-sm text-gray-300">{permission}</span>
    </label>
  ))}
</div>

              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="border-border text-gray-300 hover:bg-gray-700">
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "text-white",
                mode === 'ban'
                  ? "bg-red-600 hover:bg-red-700"
                  : mode === 'restrict' || mode === 'unrestrict'
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : mode === 'unban'
                  ? "bg-green-600 hover:bg-green-700"
                  : mode === 'delete'
                  ? "bg-destructive hover:bg-destructive/80"
                  : "bg-purple-600 hover:bg-purple-700"
              )}
            >
              {getSubmitButtonText()}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
