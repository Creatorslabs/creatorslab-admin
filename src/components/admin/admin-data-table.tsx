'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MoreHorizontal, Edit, Shield, Ban, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface AdminDataTableProps {
  title: string;
  data: Admin[];
  onEdit: (admin: Admin) => void;
  onRestrict: (admin: Admin) => void;
  onBan: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export function AdminDataTable({ title, data, onEdit, onRestrict, onBan, onDelete }: AdminDataTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      'Active': 'bg-green-600 hover:bg-green-700',
      'Restricted': 'bg-yellow-600 hover:bg-yellow-700',
      'Banned': 'bg-red-600 hover:bg-red-700',
    };
    
    return (
      <Badge className={`${variants[status as keyof typeof variants]} text-white`}>
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      'Super Admin': 'bg-purple-600 hover:bg-purple-700',
      'Admin': 'bg-blue-600 hover:bg-blue-700',
      'Moderator': 'bg-indigo-600 hover:bg-indigo-700',
      'Support': 'bg-border hover:bg-gray-700',
    };
    
    return (
      <Badge className={`${variants[role as keyof typeof variants]} text-white`}>
        {role}
      </Badge>
    );
  };

  return (
    <div className="bg-card-box rounded-lg border border-border">
      <div className="p-6 border-b border-border">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="text-left p-4 text-sm font-medium text-gray-300">Name</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Email</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Role</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Permissions</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Status</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Last Login</th>
              <th className="text-left p-4 text-sm font-medium text-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((admin, index) => (
              <tr key={admin.id} className="border-b border-border hover:bg-gray-750 transition-colors">
                <td className="p-4">
                  <div className="text-white font-medium">{admin.name}</div>
                </td>
                <td className="p-4">
                  <div className="text-gray-300">{admin.email}</div>
                </td>
                <td className="p-4">
                  {getRoleBadge(admin.role)}
                </td>
                <td className="p-4">
                  <div className="flex flex-wrap gap-1">
                    {admin.permissions.slice(0, 2).map((permission) => (
                      <Badge key={permission} variant="outline" className="text-xs border-border text-gray-300">
                        {permission}
                      </Badge>
                    ))}
                    {admin.permissions.length > 2 && (
                      <Badge variant="outline" className="text-xs border-border text-gray-300">
                        +{admin.permissions.length - 2} more
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  {getStatusBadge(admin.status)}
                </td>
                <td className="p-4">
                  <div className="text-gray-300 text-sm">{admin.lastLogin}</div>
                </td>
                <td className="p-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700">
                      <DropdownMenuItem 
                        onClick={() => onEdit(admin)}
                        className="text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {admin.status === 'Active' && (
                        <DropdownMenuItem 
                          onClick={() => onRestrict(admin)}
                          className="text-yellow-400 hover:text-yellow-300 hover:bg-gray-700 cursor-pointer"
                        >
                          <Shield className="mr-2 h-4 w-4" />
                          Restrict
                        </DropdownMenuItem>
                      )}
                      {admin.status !== 'Banned' && (
                        <DropdownMenuItem 
                          onClick={() => onBan(admin)}
                          className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                        >
                          <Ban className="mr-2 h-4 w-4" />
                          Ban
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => onDelete(admin)}
                        className="text-red-400 hover:text-red-300 hover:bg-gray-700 cursor-pointer"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}