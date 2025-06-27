"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions: string[];
  status: "Active" | "Restricted" | "Banned";
  lastLogin: string;
  createdAt: string;
}

interface AdminFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (admin: Partial<Admin>) => void;
  admin?: Admin | null;
  mode: "add" | "edit" | "restrict" | "ban" | "unrestrict" | "unban" | "delete";
}

const rolePermissionsMap: Record<string, string[]> = {
  "Super Admin": [
    "User Management",
    "Task Management",
    "Engagement Management",
    "Analytics View",
    "System Settings",
    "Admin Management",
  ],
  Admin: [
    "User Management",
    "Task Management",
    "Engagement Management",
    "Analytics View",
    "Admin Management",
  ],
  Moderator: ["Task Management", "Engagement Management", "Analytics View"],
  Support: ["User Management"],
};

const roles = ["Super Admin", "Admin", "Moderator", "Support"];

export function AdminFormModal({
  isOpen,
  onClose,
  onSubmit,
  admin,
  mode,
}: AdminFormModalProps) {
  const [formData, setFormData] = useState<Partial<Admin>>({
    name: "",
    email: "",
    role: "Admin",
    permissions: rolePermissionsMap["Admin"],
    status: "Active",
  });

  // Sync form with admin or reset
  useEffect(() => {
    if (admin) {
      setFormData({
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: rolePermissionsMap[admin.role],
        status: admin.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        role: "Admin",
        permissions: rolePermissionsMap["Admin"],
        status: "Active",
      });
    }
  }, [admin, isOpen]);

  // Update permissions when role changes
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      permissions: rolePermissionsMap[prev.role ?? "Admin"],
    }));
  }, [formData.role]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRoleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      role: value,
      permissions: rolePermissionsMap[value],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  useEffect(() => {
    setFormData({
      name: "",
      email: "",
      role: "Admin",
      permissions: rolePermissionsMap["Admin"],
      status: "Active",
    });
  }, [!isOpen]);

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Admin";
      case "edit":
        return "Edit Admin";
      case "restrict":
        return "Restrict Admin Access";
      case "unrestrict":
        return "Unrestrict Admin Access";
      case "ban":
        return "Ban Admin";
      case "unban":
        return "Unban Admin";
      case "delete":
        return "Delete Admin";
      default:
        return "Admin Management";
    }
  };

  const getSubmitButtonText = () => {
    switch (mode) {
      case "add":
        return "Add Admin";
      case "edit":
        return "Update Admin";
      case "restrict":
        return "Restrict";
      case "unrestrict":
        return "Unrestrict";
      case "ban":
        return "Ban";
      case "unban":
        return "Unban";
      case "delete":
        return "Delete";
      default:
        return "Submit";
    }
  };

  const renderConfirmationCard = () => (
    <div className="space-y-4">
      <p className="text-muted-foreground">
        {mode === "restrict" && `Restrict access for ${admin?.name}?`}
        {mode === "unrestrict" && `Unrestrict ${admin?.name}?`}
        {mode === "ban" && `Ban ${admin?.name}?`}
        {mode === "unban" && `Unban ${admin?.name}?`}
        {mode === "delete" &&
          `Are you sure you want to permanently delete ${admin?.name}? This action cannot be undone.`}
      </p>
      <div className="bg-card p-3 rounded-lg border border-border">
        <p className="text-sm text-foreground">Admin: {admin?.name}</p>
        <p className="text-sm text-foreground">Email: {admin?.email}</p>
        <p className="text-sm text-foreground">Role: {admin?.role}</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card-box border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {getModalTitle()}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {["restrict", "unrestrict", "ban", "unban", "delete"].includes(
            mode
          ) ? (
            renderConfirmationCard()
          ) : (
            <>
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-card-box border-border"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-card-box border-border"
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={formData.role} onValueChange={handleRoleChange}>
                  <SelectTrigger className="border-border">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {roles.map((role) => (
                      <SelectItem key={role} value={role}>
                        {role}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Permissions</Label>
                <ul className="list-disc list-inside text-sm text-muted-foreground mt-1">
                  {formData.permissions?.map((perm) => (
                    <li key={perm}>{perm}</li>
                  ))}
                </ul>
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
                "text-foreground",
                mode === "ban"
                  ? "bg-red-600 hover:bg-red-700"
                  : mode === "restrict" || mode === "unrestrict"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : mode === "unban"
                  ? "bg-green-600 hover:bg-green-700"
                  : mode === "delete"
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
