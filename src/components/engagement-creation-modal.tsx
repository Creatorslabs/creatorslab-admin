"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface EngagementCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (engagementData: any) => void;
}

const engagementOptions = [
  { id: "page-follow", label: "Page Follow", checked: true },
  { id: "tweet-like", label: "Tweet Like", checked: true },
  { id: "tweet-repost", label: "Tweet Repost", checked: false },
  { id: "comment", label: "Comment", checked: false },
  { id: "quote", label: "Quote", checked: false },
];

export function EngagementCreationModal({
  isOpen,
  onClose,
  onSubmit,
}: EngagementCreationModalProps) {
  const [formData, setFormData] = useState({
    engagementName: "",
    engagementType: "",
    selectedEngagements: ["page-follow", "tweet-like"] as string[],
  });

  const [engagementList, setEngagementList] = useState(engagementOptions);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEngagementToggle = (engagementId: string, checked: boolean) => {
    setEngagementList((prev) =>
      prev.map((item) =>
        item.id === engagementId ? { ...item, checked } : item
      )
    );

    setFormData((prev) => ({
      ...prev,
      selectedEngagements: checked
        ? [...prev.selectedEngagements, engagementId]
        : prev.selectedEngagements.filter((id) => id !== engagementId),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedEngagementLabels = engagementList
      .filter((item) => formData.selectedEngagements.includes(item.id))
      .map((item) => item.label);

    const engagementData = {
      ...formData,
      selectedEngagementLabels,
    };

    onSubmit(engagementData);

    // Reset form
    setFormData({
      engagementName: "",
      engagementType: "",
      selectedEngagements: ["page-follow", "tweet-like"],
    });
    setEngagementList(engagementOptions);
    onClose();
  };

  const getEngagementLabel = (id: string) => {
    return engagementList.find((item) => item.id === id)?.label || id;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">
            Create engagement type
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Engagement Name */}
          <div>
            <Label
              htmlFor="engagementName"
              className="text-white text-sm font-medium"
            >
              Engagement Name
            </Label>
            <Input
              id="engagementName"
              placeholder="Enter the title of your engagement"
              value={formData.engagementName}
              onChange={(e) =>
                handleInputChange("engagementName", e.target.value)
              }
              className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          {/* Engagement Type */}
          <div>
            <Label
              htmlFor="engagementType"
              className="text-white text-sm font-medium"
            >
              Engagement Type
            </Label>
            <Input
              id="engagementType"
              placeholder="Enter the title of your engagement"
              value={formData.engagementType}
              onChange={(e) =>
                handleInputChange("engagementType", e.target.value)
              }
              className="mt-2 bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              required
            />
          </div>

          {/* Engagement Options */}
          <div>
            <Label className="text-white text-sm font-medium mb-3 block">
              Select Engagement Type
            </Label>

            <div className="space-y-3">
              {engagementList.map((engagement) => (
                <div
                  key={engagement.id}
                  className="flex items-center space-x-3"
                >
                  <Checkbox
                    id={engagement.id}
                    checked={engagement.checked}
                    onCheckedChange={(checked) =>
                      handleEngagementToggle(engagement.id, checked as boolean)
                    }
                    className="border-gray-600 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                  />
                  <Label
                    htmlFor={engagement.id}
                    className="text-white text-sm cursor-pointer flex-1"
                  >
                    {engagement.label}
                  </Label>
                </div>
              ))}
            </div>

            {/* Selected Engagements Display */}
            {formData.selectedEngagements.length > 0 && (
              <div className="mt-4">
                <p className="text-gray-400 text-xs mb-2">
                  Selected engagements:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.selectedEngagements.map((engagementId) => (
                    <Badge
                      key={engagementId}
                      variant="secondary"
                      className="bg-purple-600 text-white"
                    >
                      {getEngagementLabel(engagementId)}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleEngagementToggle(engagementId, false)
                        }
                        className="ml-1 h-4 w-4 p-0 text-white hover:text-gray-300"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white"
            >
              Post Task
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
