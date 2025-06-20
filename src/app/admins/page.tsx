'use client';

import { useState } from 'react';
import { Shield, UserCheck, UserX, Users } from 'lucide-react';
import { AdminFormModal } from '@/components/admin/admin-form-modal';
import { AdminDataTable } from '@/components/admin/admin-data-table';
import { StatCard } from '@/components/stat-card';
import { DataTable } from '@/components/data-table';

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

const initialAdmins: Admin[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@creatorslab.com',
    role: 'Super Admin',
    permissions: ['User Management', 'Task Management', 'Engagement Management', 'Analytics View', 'System Settings', 'Admin Management'],
    status: 'Active',
    lastLogin: '2 hours ago',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.johnson@creatorslab.com',
    role: 'Admin',
    permissions: ['User Management', 'Task Management', 'Engagement Management', 'Analytics View'],
    status: 'Active',
    lastLogin: '1 day ago',
    createdAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Mike Wilson',
    email: 'mike.wilson@creatorslab.com',
    role: 'Moderator',
    permissions: ['User Management', 'Task Management'],
    status: 'Restricted',
    lastLogin: '3 days ago',
    createdAt: '2024-02-01',
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily.davis@creatorslab.com',
    role: 'Support',
    permissions: ['Analytics View'],
    status: 'Active',
    lastLogin: '5 hours ago',
    createdAt: '2024-02-10',
  },
  {
    id: '5',
    name: 'David Brown',
    email: 'david.brown@creatorslab.com',
    role: 'Admin',
    permissions: ['User Management', 'Engagement Management'],
    status: 'Banned',
    lastLogin: '1 week ago',
    createdAt: '2024-01-25',
  },
];

export default function AdminPage() {
  const [admins, setAdmins] = useState<Admin[]>(initialAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'restrict' | 'ban'>('add');

  // Calculate stats
  const totalAdmins = admins.length;
  const activeAdmins = admins.filter(admin => admin.status === 'Active').length;
  const restrictedAdmins = admins.filter(admin => admin.status === 'Restricted').length;
  const bannedAdmins = admins.filter(admin => admin.status === 'Banned').length;

  const statsData = [
    { title: 'Total Admins', value: totalAdmins.toString(), icon: Users },
    { title: 'Active Admins', value: activeAdmins.toString(), icon: UserCheck },
    { title: 'Restricted Admins', value: restrictedAdmins.toString(), icon: UserX },
    { title: 'Banned Admins', value: bannedAdmins.toString(), icon: Shield },
  ];

  const handleAddAdmin = () => {
    setSelectedAdmin(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleEditAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleRestrictAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('restrict');
    setIsModalOpen(true);
  };

  const handleBanAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('ban');
    setIsModalOpen(true);
  };

  const handleDeleteAdmin = (admin: Admin) => {
    if (window.confirm(`Are you sure you want to delete ${admin.name}? This action cannot be undone.`)) {
      setAdmins(prev => prev.filter(a => a.id !== admin.id));
    }
  };

  const handleSubmitAdmin = (adminData: Partial<Admin>) => {
    if (modalMode === 'add') {
      const newAdmin: Admin = {
        id: Date.now().toString(),
        name: adminData.name!,
        email: adminData.email!,
        role: adminData.role!,
        permissions: adminData.permissions!,
        status: 'Active',
        lastLogin: 'Never',
        createdAt: new Date().toISOString().split('T')[0],
      };
      setAdmins(prev => [...prev, newAdmin]);
    } else if (modalMode === 'edit') {
      setAdmins(prev => prev.map(admin => 
        admin.id === selectedAdmin?.id 
          ? { ...admin, ...adminData }
          : admin
      ));
    } else if (modalMode === 'restrict' || modalMode === 'ban') {
      setAdmins(prev => prev.map(admin => 
        admin.id === selectedAdmin?.id 
          ? { ...admin, status: adminData.status! }
          : admin
      ));
    }
  };

  return (
    <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Admin Table */}
        <AdminDataTable
          title={`Administrators (${totalAdmins})`}
          data={admins}
          onEdit={handleEditAdmin}
          onRestrict={handleRestrictAdmin}
          onBan={handleBanAdmin}
          onDelete={handleDeleteAdmin}
        />

        {/* Admin Form Modal */}
        <AdminFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmitAdmin}
          admin={selectedAdmin}
          mode={modalMode}
          />
      </div>
  );
}