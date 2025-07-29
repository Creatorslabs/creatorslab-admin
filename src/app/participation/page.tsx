"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import {
  Eye,
  Clock,
  CheckCircle,
  DollarSign,
  FileText,
  MoreHorizontal,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import { ParticipationViewModal } from "@/components/ParticipationViewModal";

interface IParticipation {
  _id: string;
  userId: {
    _id: string;
    username: string;
    image?: string;
  };
  taskId: {
    _id: string;
    title: string;
  };
  status: "pending" | "completed" | "claimed" | "rejected";
  proof?: string;
  createdAt?: string;
}

export default function ParticipationsPage() {
  const [participations, setParticipations] = useState<IParticipation[]>([]);
  const [stats, setStats] = useState({
    totalParticipations: 0,
    pending: 0,
    completed: 0,
    claimed: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });

  const [selectedParticipation, setSelectedParticipation] =
    useState<IParticipation | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const { showLoader, hideLoader, LoaderModal } = useLoader();

  const fetchParticipations = async (page = 1) => {
    showLoader({ message: "Loading participations..." });

    try {
      const res = await fetch(
        `/api/participations?page=${page}&limit=${pagination.limit}`
      );
      const json = await res.json();

      if (json.success) {
        setParticipations(json.data.participations);
        setStats(json.data.stats);
        setPagination(json.data.pagination);
      } else {
        toast({ title: "Error loading data", variant: "error" });
      }
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchParticipations(pagination.page);
  }, []);

  const handlePageChange = (newPage: number) => {
    fetchParticipations(newPage);
  };

  const handleView = (p: IParticipation) => {
    setSelectedParticipation(p);
    setIsViewModalOpen(true);
  };

  const columns = [
    {
      key: "taskId.title",
      header: "Task Title",
      render: (p: IParticipation) => p.taskId?.title || "-",
    },
    {
      key: "userId.username",
      header: "User",
      render: (p: IParticipation) => p.userId?.username || "-",
    },
    {
      key: "status",
      header: "Status",
      render: (p: IParticipation) => (
        <span
          className={`capitalize px-2 py-1 rounded-md text-sm ${
            p.status === "pending"
              ? "bg-yellow-100 text-yellow-800"
              : p.status === "completed"
              ? "bg-blue-100 text-blue-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {p.status}
        </span>
      ),
    },
    {
      key: "createdAt",
      header: "Date",
      render: (p: IParticipation) =>
        p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "-",
    },
    {
      key: "actions",
      header: "",
      render: (p: IParticipation) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1.5 rounded-md hover:bg-muted/80">
              <MoreHorizontal className="w-4 h-4 text-gray-400" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40 p-1">
            <DropdownMenuItem
              onClick={() => handleView(p)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white rounded-md"
            >
              <Eye className="h-4 w-4 text-purple-400" />
              View
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const statsData = [
    {
      title: "Total Participations",
      value: stats.totalParticipations.toLocaleString(),
      icon: FileText,
    },
    { title: "Pending", value: stats.pending.toLocaleString(), icon: Clock },
    {
      title: "Completed",
      value: stats.completed.toLocaleString(),
      icon: CheckCircle,
    },
    {
      title: "Claimed",
      value: stats.claimed.toLocaleString(),
      icon: DollarSign,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <DataTable
        title={`Participations (${stats.totalParticipations})`}
        columns={columns}
        data={participations}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
      />

      <ParticipationViewModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        participation={selectedParticipation}
      />

      <LoaderModal />
    </div>
  );
}
