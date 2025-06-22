"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import {
  Users,
  UserCheck,
  UserX,
  MoreHorizontal,
  Eye,
  Power,
} from "lucide-react";
import { useConfirm } from "@/hooks/useConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    unverifiedUsers: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { confirm, ConfirmModal } = useConfirm();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const usersColumns = [
    { key: "username", header: "Username" },
    {
      key: "email",
      header: "Email",
      render: (row: any) => {
        const email = row.email || "";
        const [name, domain] = email.split("@");
        const masked =
          name.length > 3
            ? `${name.slice(0, 3)}***@${domain}`
            : `***@${domain}`;
        return <span className="text-sm text-gray-300">{masked}</span>;
      },
    },
    {
      key: "wallet",
      header: "Wallet address",
      render: (row: any) => {
        const wallet = row.wallet || "";
        const masked =
          wallet.length > 8
            ? `${wallet.slice(0, 4)}...${wallet.slice(-4)}`
            : wallet;
        return <span className="text-sm text-gray-300">{masked}</span>;
      },
    },
    { key: "role", header: "Account type" },
    {
      key: "status",
      header: "Status",
      render: (row: any) => {
        const isVerified =
          row.verification?.email &&
          row.verification?.twitter &&
          row.verification?.discord;

        return (
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${
              isVerified ? "text-blue-400" : "text-orange-400"
            }`}
          >
            {isVerified ? "Verified" : "Unverified"}
          </span>
        );
      },
    },
    {
      key: "active",
      header: "Account Info",
      render: (row: any) => {
        const isVerified =
          row.verification?.email &&
          row.verification?.twitter &&
          row.verification?.discord;

        return (
          <span
            className={`text-sm font-medium px-2 py-1 rounded ${
              row.status === "Active" ? "text-blue-400" : "text-red-400"
            }`}
          >
            {row.status === "Active" ? "Active" : "Deactivated"}
          </span>
        );
      },
    },
    {
      key: "actions",
      header: "",
      render: (user: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="p-1.5 rounded-md hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-purple-500"
              aria-label="More options"
            >
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="bg-card-box border border-border rounded-md shadow-lg w-44 p-1"
          >
            <DropdownMenuItem
              onClick={() => handleEdit(user)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-purple-400" />
              View
            </DropdownMenuItem>

            {user.status !== "completed" && (
              <DropdownMenuItem
                onClick={() => handleToggleStatus(user)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer
                  ${
                    user.status === "Active"
                      ? "text-red-400 hover:bg-card"
                      : "text-green-400 hover:bg-card"
                  }`}
              >
                <Power className="h-4 w-4" />
                {user.status === "Active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchUsers = async (page = 1) => {
    const res = await fetch(`/api/users?page=${page}&limit=10`);
    const json = await res.json();
    if (json.success) {
      setUsers(json.data.users);
      setStats(json.data.stats);
      setPagination(json.data.pagination);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (task: any) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (user: any) => {
    const isActive = user.status === "Active";

    const confirmed = await confirm({
      title: isActive ? "Deactivate User?" : "Activate User?",
      description: isActive
        ? "This user will be marked as deactivated and won't have access."
        : "This user will be reactivated and restored access.",
      confirmText: isActive ? "Yes, Deactivate" : "Yes, Activate",
      cancelText: "Cancel",
      variant: isActive ? "danger" : "default",
    });

    if (!confirmed) return;

    try {
      const res = await fetch(`/api/users/${user._id}/toggle-status`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Failed to toggle user status:", error);
        return;
      }

      fetchUsers?.();
    } catch (err) {
      console.error("Error toggling user status:", err);
    }
  };

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Verified users",
      value: stats.verifiedUsers.toLocaleString(),
      icon: UserCheck,
    },
    {
      title: "Unverified users",
      value: stats.unverifiedUsers.toLocaleString(),
      icon: UserX,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <DataTable
        title="Users"
        columns={usersColumns}
        data={users}
        pagination={{ ...pagination, onPageChange: (page) => fetchUsers(page) }}
      />
      <ConfirmModal />
    </div>
  );
}
