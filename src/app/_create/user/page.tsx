"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export default function CreateUserPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "user",
    wallet: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.username || !formData.email) {
      toast.error("Username and Email are required");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Failed to create user");
      }

      toast.success("User created successfully!");
      router.push("/users");
      // setFormData({
      //   username: '',
      //   email: '',
      //   role: 'user',
      //   wallet: '',
      // })
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-xl font-semibold text-foreground">Create New User</h1>

      <div className="space-y-4">
        <div>
          <Label className="text-gray-300">Username</Label>
          <Input
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => handleChange("username", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-gray-300">Email</Label>
          <Input
            placeholder="Enter email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-gray-300">Role</Label>
          <select
            value={formData.role}
            onChange={(e) => handleChange("role", e.target.value)}
            className="w-full bg-card-box border border-border rounded p-2 text-foreground"
          >
            <option value="user">User</option>
            <option value="creator">Creator</option>
          </select>
        </div>

        <div>
          <Label className="text-gray-300">Wallet Address (optional)</Label>
          <Input
            placeholder="0x..."
            value={formData.wallet}
            onChange={(e) => handleChange("wallet", e.target.value)}
          />
        </div>

        <Button onClick={handleSubmit} disabled={loading}>
          {loading ? "Creating..." : "Create User"}
        </Button>
      </div>
    </div>
  );
}
