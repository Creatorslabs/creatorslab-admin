"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { EngagementFormModal } from "@/components/EngagementFormModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash } from "lucide-react";
import { useConfirm } from "@/hooks/useConfirm";

export default function EngagementPage() {
  const [engagements, setEngagements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [selectedEngagement, setSelectedEngagement] = useState<any | null>(
    null
  );
  const { confirm, ConfirmModal } = useConfirm();

  const fetchEngagements = async (page = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/engagements?page=${page}`);
      const json = await res.json();

      if (json.success) {
        setEngagements(json.data.engagements);
        setPagination(json.data.pagination);
      }
    } catch (err) {
      console.error("Failed to fetch engagements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEngagements();
  }, []);

  const engagementColumns = [
    { key: "name", header: "Name" },
    { key: "socialPlatform", header: "Social Platform" },
    { key: "engagementType", header: "Engagement type" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "",
      render: (engagement: any) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="p-1 hover:bg-muted rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-card border-border">
            <DropdownMenuItem
              className="hover:cursor-pointer text-gray-300 hover:text-white hover:bg-gray-700"
              onClick={() => handleEdit(engagement)}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700"
              onClick={() => handleDelete(engagement)}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const handlePageChange = (page: number) => {
    fetchEngagements(page);
  };

  const createEngagement = async (data: any) => {
    try {
      const res = await fetch("/api/engagements", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchEngagements();
      }
    } catch (err) {
      console.error("Create failed", err);
    }
  };

  const updateEngagement = async (id: string, data: any) => {
    try {
      const res = await fetch(`/api/engagements/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });
      if (res.ok) {
        fetchEngagements();
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleDelete = async (engagement: any) => {
    const confirmed = await confirm({
      title: "Delete Engagement?",
      description: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "danger",
    });

    if (!confirmed) return;

    try {
      await fetch(`/api/engagements/${engagement._id}`, { method: "DELETE" });
      fetchEngagements();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleCreate = () => {
    setModalMode("create");
    setSelectedEngagement(null);
    setIsModalOpen(true);
  };

  const handleEdit = (engagement: any) => {
    setModalMode("edit");
    setSelectedEngagement(engagement);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <DataTable
        title="Engagement"
        columns={engagementColumns}
        data={engagements}
        actionText="Create Engagement Type"
        onAction={handleCreate}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
      />

      <EngagementFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalMode}
        initialData={selectedEngagement}
        onSubmit={(data) => {
          if (modalMode === "create") {
            createEngagement(data);
          } else {
            updateEngagement(data._id!, data);
          }
        }}
        existingEngagements={engagements}
      />

      <ConfirmModal />
    </div>
  );
}
