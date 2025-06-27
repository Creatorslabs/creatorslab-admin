"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PasswordChangeModal } from "@/components/password-change-modal";
import {
  User,
  Mail,
  Shield,
  Calendar,
  Clock,
  Key,
  CheckCircle,
  XCircle,
  AlertCircle,
  Settings,
} from "lucide-react";
import { AdminPermission, AdminRole, AdminStatus } from "@/lib/models/Admin";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";

interface IAdmin {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  image?: string;
  password: string;
  permissions: AdminPermission[];
  status: AdminStatus;
  lastLogin: string;
  createdAt: string;
  updatedAt: string;
}

export default function ProfilePage() {
  const [admin, setAdmin] = useState<IAdmin | null>();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { LoaderModal, showLoader, hideLoader } = useLoader();

  useEffect(() => {
    const fetchAdmin = async () => {
      showLoader({ message: "Loading admin data..." });

      try {
        const res = await fetch("api/profile");

        if (!res.ok) {
          throw new Error("Failed to fetch admin data");
        }

        const data = await res.json();
        console.log(data)

        setAdmin(data.data);
      } catch (error) {
        console.error("Failed to fetch details:", error);
        toast({ title: "Error fetching data.", variant: "destructive" });
      } finally {
        hideLoader();
      }
    };

    fetchAdmin();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Restricted":
        return <AlertCircle className="w-4 h-4 text-yellow-500" />;
      case "Banned":
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "Restricted":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
      case "Banned":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Super Admin":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Admin":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Moderator":
        return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      case "Support":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const handlePasswordChange = async (passwordData: {
    currentPassword: string;
    newPassword: string;
  }) => {
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(passwordData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error("Failed to update password")
    }
    toast({
      title: result.message,
      variant: "success"
    })
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      toast({ title: "Password update failed", variant: "destructive", description: "Failed to update password, please try again" })
    }
  };
  

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {/* Profile Header Card */}
      <Card className="bg-card-box border-border p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          {/* Avatar Section */}
          <div className="relative">
            <Avatar className="w-24 h-24 border-4 border-primary/20">
              <AvatarImage src={admin.image} alt={admin.name} />
              <AvatarFallback className="bg-card text-foreground text-2xl font-semibold">
                {admin.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-card-box rounded-full flex items-center justify-center border-2 border-border">
              {getStatusIcon(admin.status)}
            </div>
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-3">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">
                {admin.name}
              </h1>
              <p className="text-gray-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                {admin.email}
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Badge className={`${getRoleColor(admin.role)} border`}>
                <Shield className="w-3 h-3 mr-1" />
                {admin.role}
              </Badge>
              <Badge className={`${getStatusColor(admin.status)} border`}>
                {getStatusIcon(admin.status)}
                <span className="ml-1">{admin.status}</span>
              </Badge>
            </div>
          </div>

          {/* Action Button */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => setIsPasswordModalOpen(true)}
              className="bg-purple-600 hover:bg-purple-700 text-foreground flex items-center gap-2"
            >
              <Key className="w-4 h-4" />
              Change Password
            </Button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Information */}
        <Card className="bg-card-box border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Account Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-gray-400">Full Name</span>
              <span className="text-foreground font-medium">{admin.name}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-gray-400">Email Address</span>
              <span className="text-foreground font-medium">{admin.email}</span>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-gray-400">Role</span>
              <Badge className={`${getRoleColor(admin.role)} border`}>
                {admin.role}
              </Badge>
            </div>

            <div className="flex justify-between items-center py-3 border-b border-border">
              <span className="text-gray-400">Account Status</span>
              <Badge className={`${getStatusColor(admin.status)} border`}>
                {getStatusIcon(admin.status)}
                <span className="ml-1">{admin.status}</span>
              </Badge>
            </div>
          </div>
        </Card>

        {/* Activity Information */}
        <Card className="bg-card-box border-border p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-400" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">
              Activity Information
            </h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-start py-3 border-b border-border">
              <span className="text-gray-400">Last Login</span>
              <div className="text-right">
                <div className="text-foreground font-medium">
                  {admin.lastLogin}
                </div>
                {admin.lastLogin && (
                  <div className="text-gray-500 text-sm">
                    {admin.lastLogin}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-between items-start py-3 border-b border-border">
              <span className="text-gray-400">Account Created</span>
              <div className="text-right">
                <div className="text-foreground font-medium">
                  {admin.createdAt}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start py-3">
              <span className="text-gray-400">Last Updated</span>
              <div className="text-right">
                <div className="text-foreground font-medium">
                  {admin.updatedAt}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Permissions Card */}
      <Card className="bg-card-box border-border p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">
            Permissions & Access
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {admin.permissions.map((permission, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-border/50 rounded-lg border border-gray-600/50"
            >
              <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
              <span className="text-foreground text-sm font-medium">
                {permission}
              </span>
            </div>
          ))}
        </div>

        {admin.permissions.length === 0 && (
          <div className="text-center py-8">
            <XCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No permissions assigned</p>
          </div>
        )}
      </Card>

      {/* Password Change Modal */}
      <PasswordChangeModal
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSubmit={handlePasswordChange}
      />
      <LoaderModal />
    </div>
  );
}
