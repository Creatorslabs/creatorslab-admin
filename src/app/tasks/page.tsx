"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/components/data-table";
import { StatCard } from "@/components/stat-card";
import {
  FileText,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Pencil,
  Power,
} from "lucide-react";
import { MultiStepTaskModal } from "@/components/task-creation-modal";
import { ITask } from "@/lib/models/Task";
import { useConfirm } from "@/hooks/useConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import { TaskViewModal } from "@/components/task-view-modal";

export default function TasksPage() {
  const [tasksData, setTasksData] = useState<Partial<ITask>[]>([]);
  const [stats, setStats] = useState({
    totalTasks: 0,
    completedTasks: 0,
    pendingTasks: 0,
  });

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [socialPlatforms, setSocialPlatforms] = useState<
    { value: string; label: string }[]
  >([]);
  const [engagementOptions, setEngagementOptions] = useState<
    Record<string, string[]>
  >({});

  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const { confirm, ConfirmModal } = useConfirm();
  const { showLoader, hideLoader, LoaderModal } = useLoader();

  const tasksColumns = [
    { key: "title", header: "Title" },
    { key: "creator", header: "Creator" },
    { key: "target", header: "Target" },
    { key: "platform", header: "Social Platform" },
    { key: "type", header: "Engagement type" },
    { key: "status", header: "Status" },
    {
      key: "actions",
      header: "",
      render: (task: any) => (
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
              onClick={() => handleViewTask(task)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-foreground transition-colors cursor-pointer"
            >
              <Eye className="h-4 w-4 text-purple-400" />
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => handleEdit(task)}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300 rounded-md hover:bg-gray-700 hover:text-foreground transition-colors cursor-pointer"
            >
              <Pencil className="h-4 w-4 text-blue-400" />
              Edit
            </DropdownMenuItem>

            {task.status !== "completed" && (
              <DropdownMenuItem
                onClick={() => handleToggleStatus(task)}
                className={`flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors cursor-pointer
      ${
        task.status === "active"
          ? "text-yellow-400 hover:text-yellow-300 hover:bg-gray-700"
          : "text-green-400 hover:text-green-300 hover:bg-gray-700"
      }`}
              >
                <Power className="h-4 w-4" />
                {task.status === "active" ? "Deactivate" : "Activate"}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  const fetchTasks = async (page = 1) => {
    showLoader({ message: "Loading tasks..." });
    try {
      const res = await fetch(
        `/api/tasks?page=${page}&limit=${pagination.limit}`
      );
      const json = await res.json();
      if (json.success) {
        setTasksData(json.data);
        setStats(json.stats);
        setPagination(json.pagination);
        setSocialPlatforms(json.socialPlatforms || []);
        setEngagementOptions(json.engagementOptions || {});
      }
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    } finally {
      hideLoader();
    }
  };

  useEffect(() => {
    fetchTasks(pagination.page);
  }, []);

  const createTask = async (taskData: any) => {
    const payload = {
      title: taskData.title,
      type: taskData.type,
      platform: taskData.platform,
      image: taskData.image,
      description: taskData.description,
      target: taskData.target,
      rewardPoints: taskData.rewardPoints,
      maxParticipants: taskData.maxParticipants,
      expiration: taskData.expiration || null,
      status: "active",
    };

    showLoader({ message: "Creating task..." });

    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Create task failed:", error);
        return;
      }

      fetchTasks();
      toast({
        title: "Task Created successfully",
        variant: "success",
      });
    } catch (error) {
      console.error("Create task error:", error);
      toast({
        title: "Task creation failed",
        variant: "error",
      });
    } finally {
      hideLoader();
    }
  };

  const updateTask = async (id: string, data: any) => {
    showLoader({ message: "Updating task..." });
    try {
      const res = await fetch(`/api/task/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        fetchTasks();
        toast({
          title: "Update successfull",
          description: "Task updated successfully.",
          variant: "success",
        });
      }
    } catch (err) {
      console.error("Update failed", err);
      toast({
        title: "Update failed",
        description: "Failed to update task.",
        variant: "error",
      });
    } finally {
      hideLoader();
    }
  };

  const handleCreateTask = () => {
    setModalMode("create");
    setIsModalOpen(true);
  };

  const handlePageChange = (newPage: number) => {
    fetchTasks(newPage);
  };

  const handleViewTask = (task: any) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleEdit = (task: any) => {
    setModalMode("edit");
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const onClose = () => {
    setSelectedTask(null);
    setIsModalOpen(false);
  };

  const handleToggleStatus = async (engagement: any) => {
    if (engagement.status === "completed") return;

    const isActive = engagement.status === "active";

    const confirmed = await confirm({
      title: isActive ? "Deactivate Task?" : "Activate Task?",
      description: isActive
        ? "This task will be marked as inactive and users won't be able to perform it."
        : "This task will be reactivated and made available to users.",
      confirmText: isActive ? "Yes, Deactivate" : "Yes, Activate",
      cancelText: "Cancel",
      variant: isActive ? "danger" : "default",
    });

    if (!confirmed) return;

    showLoader({
      message: isActive ? "Deactivating Task..." : "Activating Task...",
    });

    try {
      const res = await fetch(`/api/tasks/${engagement._id}/active-inactive`, {
        method: "PATCH",
      });

      if (!res.ok) {
        const error = await res.json();
        console.error("Toggle failed:", error);
        return;
      }

      fetchTasks();
      toast({
        title: "Update successfull",
        description: "Task status has been updated successfully.",
        variant: "success",
      });
    } catch (err) {
      console.error("Error toggling status:", err);
      toast({
        title: "Update failed",
        description: "Failed to update task status.",
        variant: "error",
      });
    } finally {
      hideLoader();
    }
  };

  const statsData = [
    {
      title: "Total Tasks",
      value: stats.totalTasks.toLocaleString(),
      icon: FileText,
    },
    {
      title: "Completed Tasks",
      value: stats.completedTasks.toLocaleString(),
      icon: CheckCircle,
    },
    {
      title: "Pending Tasks",
      value: stats.pendingTasks.toLocaleString(),
      icon: Clock,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
      </div>

      <DataTable
        title={`Tasks (${stats.totalTasks.toLocaleString()})`}
        columns={tasksColumns}
        data={tasksData}
        actionText="Create Task"
        onAction={handleCreateTask}
        pagination={{
          ...pagination,
          onPageChange: handlePageChange,
        }}
      />

      <MultiStepTaskModal
        isOpen={isModalOpen}
        task={selectedTask}
        onClose={onClose}
        onSubmit={(data) => {
          if (modalMode === "create") {
            createTask(data);
          } else {
            updateTask(data._id!, data);
          }
        }}
        socialPlatforms={socialPlatforms}
        engagementOptions={engagementOptions}
      />
      <TaskViewModal
          isOpen={isViewModalOpen}
          onClose={() => setIsViewModalOpen(false)}
          task={selectedTask}
        />
      <ConfirmModal />
      <LoaderModal />
    </div>
  );
}
