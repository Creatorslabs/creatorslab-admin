"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Engagement {
  _id?: string;
  name: string;
  socialPlatform: string;
  engagementType: string[];
  status: "Active" | "Inactive";
}

interface EngagementFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Engagement) => void;
  mode: "create" | "edit";
  initialData?: Engagement | null;
  existingEngagements: Engagement[];
}

export function EngagementFormModal({
  isOpen,
  onClose,
  onSubmit,
  mode,
  initialData,
  existingEngagements,
}: EngagementFormModalProps) {
  const [form, setForm] = useState({
    name: "",
    socialPlatform: "",
    engagementTypeInput: "",
    status: "Active" as "Active" | "Inactive",
  });

  const [errors, setErrors] = useState({
    name: "",
    socialPlatform: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name || "",
        socialPlatform: initialData.socialPlatform || "",
        engagementTypeInput: initialData.engagementType?.join(", ") || "",
        status: initialData.status || "Active",
      });
    } else {
      setForm({
        name: "",
        socialPlatform: "",
        engagementTypeInput: "",
        status: "Active",
      });
    }
    setErrors({ name: "", socialPlatform: "" });
  }, [initialData]);

  const checkDuplicate = () => {
    const lowerName = form.name.trim().toLowerCase();
    const lowerPlatform = form.socialPlatform.trim().toLowerCase();

    const isDuplicateName = existingEngagements.some(
      (e) =>
        e.name.trim().toLowerCase() === lowerName && e._id !== initialData?._id
    );

    const isDuplicatePlatform = existingEngagements.some(
      (e) =>
        e.socialPlatform.trim().toLowerCase() === lowerPlatform &&
        e._id !== initialData?._id
    );

    const newErrors = {
      name: isDuplicateName ? "Name already in use" : "",
      socialPlatform: isDuplicatePlatform ? "Platform already in use" : "",
    };

    setErrors(newErrors);
    return !(newErrors.name || newErrors.socialPlatform);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkDuplicate()) return;

    const engagementType = form.engagementTypeInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload: Engagement = {
      _id: initialData?._id,
      name: form.name.trim(),
      socialPlatform: form.socialPlatform.trim(),
      engagementType,
      status: form.status,
    };

    onSubmit(payload);
    setForm({
      name: "",
      socialPlatform: "",
      engagementTypeInput: "",
      status: "Active",
    });
    setErrors({ name: "", socialPlatform: "" });
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      setForm({
        name: "",
        socialPlatform: "",
        engagementTypeInput: "",
        status: "Active",
      });
      setErrors({ name: "", socialPlatform: "" });
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {mode === "edit" ? "Edit Engagement" : "Create Engagement"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name Input */}
          <div>
            <Label>Name</Label>
            <Input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              className={errors.name ? "border-red-500" : "border-border"}
              required
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
          </div>

          {/* Platform Input */}
          <div>
            <Label>Social Platform</Label>
            <Input
              value={form.socialPlatform}
              onChange={(e) =>
                setForm((p) => ({ ...p, socialPlatform: e.target.value }))
              }
              className={
                errors.socialPlatform ? "border-red-500" : "border-border"
              }
              required
            />
            {errors.socialPlatform && (
              <p className="text-sm text-red-500 mt-1">
                {errors.socialPlatform}
              </p>
            )}
          </div>

          {/* Engagement Type */}
          <div>
            <Label>Engagement Types (comma-separated)</Label>
            <Input
              placeholder="e.g. Page follow, Quote Page"
              value={form.engagementTypeInput}
              onChange={(e) =>
                setForm((p) => ({ ...p, engagementTypeInput: e.target.value }))
              }
              className="border-border"
            />
          </div>

          {/* Status */}
          <div>
            <Label>Status</Label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((p) => ({
                  ...p,
                  status: e.target.value as "Active" | "Inactive",
                }))
              }
              className="bg-card border-border text-white p-2 rounded-md w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              type="button"
              onClick={onClose}
              className="border-border"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-white hover:bg-secondary"
            >
              {mode === "edit" ? "Update Engagement" : "Create Engagement"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
