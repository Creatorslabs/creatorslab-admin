"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

export interface IParticipation {
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

interface ParticipationViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  participation: IParticipation | null;
}

const isImageLink = (url: string): boolean => {
  return /\.(jpeg|jpg|gif|png|webp|svg)$/i.test(url);
};

export function ParticipationViewModal({
  isOpen,
  onClose,
  participation,
}: ParticipationViewModalProps) {
  const [loading, setLoading] = useState(false);

  if (!participation) return null;

  const { _id, userId, taskId, status, proof, createdAt } = participation;

  const handleStatusUpdate = async (newStatus: "completed" | "rejected") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/participations/${_id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Request failed");

      toast({
        title: `Task ${
          newStatus === "completed" ? "approved" : "rejected"
        } successfully`,
        variant: "success",
      });
      onClose();
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update participation status.",
        variant: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Participation Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 text-sm">
          <div>
            <span className="text-muted-foreground">User:</span>{" "}
            <span className="font-medium">{userId?.username}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Task:</span>{" "}
            <span className="font-medium">{taskId?.title}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Status:</span>{" "}
            <span className="capitalize font-medium">{status}</span>
          </div>

          <div>
            <span className="text-muted-foreground">Submitted:</span>{" "}
            <span className="font-medium">
              {createdAt ? new Date(createdAt).toLocaleString() : "-"}
            </span>
          </div>

          {proof && (
            <div>
              <p className="text-muted-foreground mb-1">Proof:</p>
              {isImageLink(proof) ? (
                <div className="relative w-full h-56 rounded-md overflow-hidden border">
                  <Image
                    src={proof}
                    alt="Proof image"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <Link
                  href={proof}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 mt-1 text-sm text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition"
                >
                  View External Link
                  <ExternalLink className="w-4 h-4" />
                </Link>
              )}
            </div>
          )}

          {status === "pending" && (
            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="destructive"
                disabled={loading}
                onClick={() => handleStatusUpdate("rejected")}
                className="text-white"
              >
                Reject
              </Button>
              <Button
                disabled={loading}
                onClick={() => handleStatusUpdate("completed")}
                className="text-white"
              >
                Approve
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
