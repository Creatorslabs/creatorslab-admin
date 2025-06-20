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
  mode: 'add' | 'edit' | 'restrict' | 'ban';
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

  type AdminStatus = 'Active' | 'Restricted' | 'Banned';

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  let submitData: Partial<Admin> = { ...formData };

  if (mode === 'restrict') {
    submitData = { ...admin, status: 'Restricted' as AdminStatus };
  } else if (mode === 'ban') {
    submitData = { ...admin, status: 'Banned' as AdminStatus };
  }

  onSubmit(submitData);
  onClose();
};

  

const handlePermissionToggle = (permission: string) => {
  setFormData(prev => {
    const currentPermissions = prev.permissions ?? [];

    return {
      ...prev,
      permissions: currentPermissions.includes(permission)
        ? currentPermissions.filter(p => p !== permission)
        : [...currentPermissions, permission],
    };
  });
};


  const getModalTitle = () => {
    switch (mode) {
      case 'add': return 'Add New Admin';
      case 'edit': return 'Edit Admin';
      case 'restrict': return 'Restrict Admin Access';
      case 'ban': return 'Ban Admin';
      default: return 'Admin Management';
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case 'add': return 'Add Admin';
      case 'edit': return 'Update Admin';
      case 'restrict': return 'Restrict Access';
      case 'ban': return 'Ban Admin';
      default: return 'Submit';
    }
  };

  const isFormDisabled = mode === 'restrict' || mode === 'ban';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 border-gray-700 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">{getModalTitle()}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(mode === 'restrict' || mode === 'ban') ? (
            <div className="space-y-4">
              <p className="text-gray-300">
                {mode === 'restrict' 
                  ? `Are you sure you want to restrict access for ${admin?.name}? They will have limited permissions.`
                  : `Are you sure you want to ban ${admin?.name}? They will lose all access to the system.`
                }
              </p>
              <div className="bg-gray-700 p-3 rounded-lg">
                <p className="text-sm text-gray-300">Admin: {admin?.name}</p>
                <p className="text-sm text-gray-300">Email: {admin?.email}</p>
                <p className="text-sm text-gray-300">Current Role: {admin?.role}</p>
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label htmlFor="name" className="text-gray-300">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1 bg-gray-700 border-border text-white"
                  placeholder="Enter full name"
                  required
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-gray-300">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1 bg-gray-700 border-border text-white"
                  placeholder="Enter email address"
                  required
                  disabled={isFormDisabled}
                />
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-300">Role</Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: string) => setFormData(prev => ({ ...prev, role: value }))}
                  disabled={isFormDisabled}
                >
                  <SelectTrigger className="mt-1 bg-gray-700 border-border text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-border">
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
                <div className="mt-2 space-y-2 max-h-32 overflow-y-auto">
                  {permissionOptions.map((permission) => (
                    <label key={permission} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.permissions?.includes(permission)}
                        onChange={() => handlePermissionToggle(permission)}
                        className="rounded border-border bg-gray-700 text-purple-600 focus:ring-purple-500"
                        disabled={isFormDisabled}
                      />
                      <span className="text-sm text-gray-300">{permission}</span>
                    </label>
                  ))}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-border text-gray-300 hover:bg-gray-700"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={cn(
                "text-white",
                mode === 'ban' 
                  ? "bg-red-600 hover:bg-red-700" 
                  : mode === 'restrict'
                  ? "bg-yellow-600 hover:bg-yellow-700"
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