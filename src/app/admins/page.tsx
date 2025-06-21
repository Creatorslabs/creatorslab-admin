'use client';

import { useEffect, useState } from 'react';
import { Shield, UserCheck, UserX, Users } from 'lucide-react';
import { AdminFormModal } from '@/components/admin/admin-form-modal';
import { AdminDataTable } from '@/components/admin/admin-data-table';
import { StatCard } from '@/components/stat-card';
import { usePageLoader } from '@/hooks/usePageLoader';
import { capitalize } from '@/lib/helpers/capitalise';
import { ConfirmationModal } from '@/components/ConfirmationModal';
import { useConfirm } from '@/hooks/useConfirm';

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

export default function AdminPage() {
  const { confirm, ConfirmModal } = useConfirm();
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Admin | null>(null);
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'restrict' | 'ban' | "unrestrict" | "unban" | "delete">('add');
  const [confirmOpen, setConfirmOpen] = useState(false);
const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [totalAdmins, setTotalAdmins] = useState(0);
  const [activeAdmins, setActiveAdmins] = useState(0);
  const [restrictedAdmins, setRestrictedAdmins] = useState(0);
  const [bannedAdmins, setBannedAdmins] = useState(0);

  const { showLoading, hideLoading } = usePageLoader();

  const fetchAdmins = async (page = pagination.page, limit = 10) => {
    setError(null);
    try {
      const res = await fetch(`/api/admins?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (!res.ok) throw new Error(json.message || 'Failed to fetch admins');

      setAdmins(json.data.admins);
      setPagination(json.data.pagination);

      const metrics = json.data.metrics;
      setTotalAdmins(metrics.total);
      setActiveAdmins(metrics.active);
      setRestrictedAdmins(metrics.restricted);
      setBannedAdmins(metrics.banned);
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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

  const handleUnRestrictAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('unrestrict');
    setIsModalOpen(true);
  };

  const handleBanAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('ban');
    setIsModalOpen(true);
  };

  const handleUnbanAdmin = (admin: Admin) => {
    setSelectedAdmin(admin);
    setModalMode('unban');
    setIsModalOpen(true);
  };

  const handleDeleteAdmin = async (admin: Admin) => {
    const confirmed = await confirm({
      title: "Delete Admin",
      description: `Are you sure you want to delete ${admin.name}? This action cannot be undone.`,
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });
  
    if (!confirmed) return;
  
    try {
      const res = await fetch(`/api/admins/${admin.id}/delete`, {
        method: "DELETE",
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || "Failed to delete admin");
      }
  
      // Refresh admins
      fetchAdmins();
    } catch (error) {
      console.error("Delete error:", error);
      // Optionally show a toast/notification here
    }
  };

  const confirmDelete = async () => {
    if (!adminToDelete) return;
  
    try {
      const res = await fetch(`/api/admins/${adminToDelete.id}/delete`, {
        method: 'DELETE',
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        throw new Error(data.message || 'Failed to delete admin');
      }
  
      // Remove the admin from local state
      fetchAdmins()
    } catch (error) {
      console.error('Delete error:', error);
      // You could show a toast or notification here
    } finally {
      setAdminToDelete(null);
      setConfirmOpen(false);
    }
  }; 
  

  const handleSubmitAdmin = async (adminData: Partial<Admin>) => {
    if (!selectedAdmin && modalMode !== "add") return;
    showLoading(`${capitalize(modalMode)} admin...`);
  
    try {
      let response;
  
      if (modalMode === 'add') {
        response = await fetch('/api/admins', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminData),
        });
  
      } else if (modalMode === 'edit') {
        response = await fetch(`/api/admins/${selectedAdmin?.id}/edit`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(adminData),
        });
  
      } else if (modalMode === 'restrict' || modalMode === 'unrestrict') {
        response = await fetch(`/api/admins/${selectedAdmin?.id}/restrict-unrestrict`, {
          method: 'PATCH',
        });
  
      } else if (modalMode === 'ban' || modalMode === 'unban') {
        response = await fetch(`/api/admins/${selectedAdmin?.id}/ban-unban`, {
          method: 'PATCH',
        });
  
      } else if (modalMode === 'delete') {
        response = await fetch(`/api/admins/${selectedAdmin?.id}/delete`, {
          method: 'DELETE',
        });
      }
  
      const result = await response?.json();
  
      if (!response?.ok) {
        console.error("Failed:", result?.error || "Unknown error");
        return;
      }
  
      // Optionally refresh data after success
      fetchAdmins()
      console.log("Success:", result?.message || "Admin updated");
  
    } catch (error) {
      console.error("Error submitting admin action:", error);
    } finally {
      hideLoading()
    }
  };
  

  return (
    <div className="space-y-6">
      <div className="w-full flex justify-start sm:justify-end items-end mb-6">
  <button
    className="bg-primary hover:bg-secondary text-white font-medium px-4 py-2 rounded-md"
    onClick={handleAddAdmin}
  >
    Add Admin
  </button>
</div>



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
          pagination={pagination}
          onPageChange={(newPage) => fetchAdmins(newPage)}
          onEdit={handleEditAdmin}
        onRestrict={handleRestrictAdmin}
        onUnrestrict={handleUnRestrictAdmin}
        onBan={handleBanAdmin}
        onUnban={handleUnbanAdmin}
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
      <ConfirmModal />
    </div>
    
  );
}