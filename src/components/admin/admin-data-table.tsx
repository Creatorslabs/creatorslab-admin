"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Edit,
  Shield,
  Ban,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Unlock,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface AdminDataTableProps {
  title: string;
  data: Admin[];
  pagination: PaginationInfo;
  onPageChange: (newPage: number) => void;
  onEdit: (admin: Admin) => void;
  onRestrict: (admin: Admin) => void;
  onUnrestrict: (admin: Admin) => void;
  onBan: (admin: Admin) => void;
  onUnban: (admin: Admin) => void;
  onDelete: (admin: Admin) => void;
}

export function AdminDataTable({
  title,
  data,
  pagination,
  onPageChange,
  onEdit,
  onRestrict,
  onUnrestrict,
  onBan,
  onUnban,
  onDelete,
}: AdminDataTableProps) {
  const getStatusBadge = (status: string) => {
    const variants = {
      Active: "bg-green-600 hover:bg-green-700",
      Restricted: "bg-yellow-600 hover:bg-yellow-700",
      Banned: "bg-red-600 hover:bg-red-700",
    };

    return (
      <Badge
        className={`${variants[status as keyof typeof variants]} text-foreground`}
      >
        {status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      "Super Admin": "bg-purple-600 hover:bg-purple-700",
      Admin: "bg-blue-600 hover:bg-blue-700",
      Moderator: "bg-indigo-600 hover:bg-indigo-700",
      Support: "bg-border hover:bg-gray-700",
    };

    return (
      <Badge
        className={`${variants[role as keyof typeof variants]} text-foreground`}
      >
        {role}
      </Badge>
    );
  };

  return (
    <div className="bg-card-box rounded-lg border border-border">
      <div className="p-6 border-b border-border flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasPrev}
            onClick={() => onPageChange(pagination.page - 1)}
            className="p-2"
          >
            {/* Mobile icon */}
            <ChevronLeft className="h-4 w-4 sm:hidden" />
            {/* Desktop text */}
            <span className="hidden sm:inline">Previous</span>
          </Button>

          {/* Page info */}
          <span className="text-sm text-muted-foreground">
            {/* Mobile version */}
            <span className="inline sm:hidden">
              {pagination.page} of {pagination.pages}
            </span>
            {/* Desktop version */}
            <span className="hidden sm:inline">
              Page {pagination.page} of {pagination.pages}
            </span>
          </span>

          {/* Next Button */}
          <Button
            variant="outline"
            size="sm"
            disabled={!pagination.hasNext}
            onClick={() => onPageChange(pagination.page + 1)}
            className="p-2"
          >
            {/* Mobile icon */}
            <ChevronRight className="h-4 w-4 sm:hidden" />
            {/* Desktop text */}
            <span className="hidden sm:inline">Next</span>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card">
            <tr className="border-b border-border">
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Name
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Email
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Role
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Permissions
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Status
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Last Login
              </th>
              <th className="p-4 text-sm text-left font-medium text-gray-300">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={data.length}
                  className="px-6 py-6 text-center text-sm text-muted-foreground"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((admin, index) => (
                <tr
                  key={admin.id}
                  className={cn(
                    "border-b border-border hover:bg-gray-750 transition-colors",
                    { "bg-card/40": !(index % 2) }
                  )}
                >
                  <td className="p-4 font-medium text-foreground">{admin.name}</td>
                  <td className="p-4 text-gray-300">{admin.email}</td>
                  <td className="p-4">{getRoleBadge(admin.role)}</td>
                  <td className="p-4">
                    <div className="flex flex-wrap gap-1">
                      {admin.permissions.slice(0, 2).map((permission) => (
                        <Badge
                          key={permission}
                          variant="outline"
                          className="text-xs border-border text-gray-300"
                        >
                          {permission}
                        </Badge>
                      ))}
                      {admin.permissions.length > 2 && (
                        <Badge
                          variant="outline"
                          className="text-xs border-border text-gray-300"
                        >
                          +{admin.permissions.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </td>
                  <td className="p-4">{getStatusBadge(admin.status)}</td>
                  <td className="p-4 text-sm text-gray-300">
                    {admin.lastLogin}
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 text-gray-400 hover:text-foreground hover:bg-card"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        align="end"
                        className="bg-card border-border"
                      >
                        <DropdownMenuItem
                          onClick={() => onEdit(admin)}
                          className="cursor-pointer text-gray-300 hover:text-foreground hover:bg-gray-700"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        {admin.status === "Active" && (
                          <DropdownMenuItem
                            onClick={() => onRestrict(admin)}
                            className="cursor-pointer text-yellow-400 hover:text-yellow-300 hover:bg-gray-700"
                          >
                            <Shield className="mr-2 h-4 w-4" />
                            Restrict
                          </DropdownMenuItem>
                        )}
                        {admin.status === "Restricted" && (
                          <DropdownMenuItem
                            onClick={() => onUnrestrict(admin)}
                            className="cursor-pointer text-green-400 hover:text-green-300 hover:bg-gray-700"
                          >
                            <ShieldCheck className="mr-2 h-4 w-4" />
                            Unrestrict
                          </DropdownMenuItem>
                        )}
                        {admin.status !== "Banned" && (
                          <DropdownMenuItem
                            onClick={() => onBan(admin)}
                            className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700"
                          >
                            <Ban className="mr-2 h-4 w-4" />
                            Ban
                          </DropdownMenuItem>
                        )}
                        {admin.status === "Banned" && (
                          <DropdownMenuItem
                            onClick={() => onUnban(admin)}
                            className="cursor-pointer text-green-400 hover:text-green-300 hover:bg-gray-700"
                          >
                            <Unlock className="mr-2 h-4 w-4" />
                            Unban
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem
                          onClick={() => onDelete(admin)}
                          className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-gray-700"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
