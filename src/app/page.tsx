"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Users, TrendingUp, CheckSquare } from "lucide-react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";

type UserType = {
  _id: string;
  username?: string;
  email?: string;
  wallet?: string;
  role: "user" | "creator";
  verification?: {
    email: boolean;
    twitter: boolean;
    discord: boolean;
  };
};

type TaskType = {
  _id: string;
  title: string;
  platform: string;
  type: string[];
};

export default function DashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
    totalUsers: 0,
    verifiedUsers: 0,
    totalTasks: 0,
  });
  const [usersData, setUsersData] = useState<UserType[]>([]);
  const [tasksData, setTasksData] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, usersRes, tasksRes] = await Promise.all([
          fetch("/api/stats"),
          fetch("/api/users?page=1&limit=10"),
          fetch("/api/tasks?page=1&limit=10"),
        ]);

        const statsJson = await statsRes.json();
        const usersJson = await usersRes.json();
        const tasksJson = await tasksRes.json();

        setStats(
          statsJson.data || { totalUsers: 0, verifiedUsers: 0, totalTasks: 0 }
        );
        setUsersData(usersJson.data.users || []);
        setTasksData(tasksJson.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const usersColumns = [
    { key: "username", header: "Username" },
    {
      key: "email",
      header: "Email",
      render: (row: UserType) => {
        if (!row.email) return "-";
        const [prefix, domain] = row.email.split("@");
        return (
          <span className="text-sm font-medium">
            {prefix.slice(0, 3)}***@{domain}
          </span>
        );
      },
    },
    {
      key: "wallet",
      header: "Wallet Address",
      render: (row: UserType) =>
        row.wallet ? (
          <span className="text-sm font-medium">
            {row.wallet.slice(0, 4)}...{row.wallet.slice(-4)}
          </span>
        ) : (
          "-"
        ),
    },
    {
      key: "role",
      header: "Account Type",
      render: (row: UserType) => (
        <span className="text-sm font-medium capitalize">{row.role}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (row: UserType) => {
        const verified =
          row.verification?.email &&
          row.verification?.twitter &&
          row.verification?.discord;
        return (
          <span
            className={`text-sm font-medium ${
              verified ? "text-blue-400" : "text-orange-400"
            }`}
          >
            {verified ? "Verified" : "Unverified"}
          </span>
        );
      },
    },
  ];

  const statsData = [
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
    },
    {
      title: "Verified Users",
      value: stats.verifiedUsers.toLocaleString(),
      icon: TrendingUp,
    },
    {
      title: "Tasks Created",
      value: stats.totalTasks.toLocaleString(),
      icon: CheckSquare,
    },
  ];

  const tasksColumns = [
    { key: "title", header: "Title" },
    { key: "platform", header: "Platform" },
    {
      key: "type",
      header: "Engagement Type",
      render: (row: TaskType) => row.type?.join(", ") || "-",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        <div className="xl:col-span-3">
          <DataTable
            title="Users"
            columns={usersColumns}
            data={usersData}
            actionText="View All"
            onAction={() => router.push("/users")}
          />
        </div>

        <div className="xl:col-span-2">
          <DataTable
            title="Tasks"
            columns={tasksColumns}
            data={tasksData}
            actionText="View All"
            onAction={() => router.push("/tasks")}
          />
        </div>
      </div>
    </div>
  );
}
