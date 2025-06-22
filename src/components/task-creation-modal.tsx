"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  X,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
  Check,
  CheckCircle,
} from "lucide-react";
import Image from "next/image";

export type TaskData = {
  _id?: string;
  title: string;
  type: string[];
  platform: string;
  image?: File;
  description: string;
  target: string;
  rewardPoints: number;
  maxParticipants: number;
  expiration?: string;
};

interface MultiStepTaskModalProps {
  task?: TaskData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: TaskData) => void;
  socialPlatforms: { value: string; label: string }[];
  engagementOptions: Record<string, string[]>;
}

const socialPlatforms = [
  { value: "twitter", label: "Twitter" },
  { value: "telegram", label: "Telegram" },
  { value: "discord", label: "Discord" },
  { value: "instagram", label: "Instagram" },
  { value: "youtube", label: "YouTube" },
];

const engagementOptions = {
  twitter: [
    "Page Follow",
    "Tweet Like",
    "Tweet Repost",
    "Quote Tweet",
    "Comment",
  ],
  telegram: ["Join Channel", "Share Post", "React to Message"],
  discord: ["Join Server", "React to Message", "Send Message"],
  instagram: ["Follow Account", "Like Post", "Comment", "Share Story"],
  youtube: ["Subscribe", "Like Video", "Comment", "Share Video"],
};

export function MultiStepTaskModal({
  task,
  isOpen,
  onClose,
  onSubmit,
  socialPlatforms,
  engagementOptions,
}: MultiStepTaskModalProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<TaskData>({
    title: "",
    type: [],
    platform: "",
    description: "",
    target: "",
    rewardPoints: 0,
    maxParticipants: 0,
    expiration: "",
  });

  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        type: task.type,
        platform: task.platform,
        description: task.description,
        target: task.target,
        rewardPoints: task.rewardPoints,
        maxParticipants: task.maxParticipants,
        expiration: task.expiration,
        image: task.image,
      });
    } else {
      setFormData({
        title: "",
        type: [],
        platform: "",
        description: "",
        target: "",
        rewardPoints: 0,
        maxParticipants: 0,
        expiration: "",
      });
    }
  }, [task, isOpen]);

  const totalSteps = 5;
  const progress = (currentStep / totalSteps) * 100;

  const stepTitles = [
    "Basic Information",
    "Platform & Engagement",
    "Rewards & Target",
    "Details & Content",
    "Review & Confirm",
  ];

  const handleInputChange = (field: keyof TaskData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEngagementToggle = (engagement: string) => {
    setFormData((prev) => ({
      ...prev,
      type: prev.type.includes(engagement)
        ? prev.type.filter((e) => e !== engagement)
        : [...prev.type, engagement],
    }));
  };

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: undefined }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.title.trim() !== "";
      case 2:
        return formData.platform !== "" && formData.type.length > 0;
      case 3:
        return (
          formData.target.trim() !== "" &&
          formData.rewardPoints > 0 &&
          formData.maxParticipants > 0
        );
      case 4:
        return formData.description.trim() !== "";
      case 5:
        return formData.expiration
          ? !isNaN(Date.parse(formData.expiration))
          : true;

      default:
        return true;
    }
  };

  const nextStep = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
    handleClose();
  };

  const handleClose = () => {
    setCurrentStep(1);
    setFormData({
      title: "",
      type: [],
      platform: "",
      description: "",
      target: "",
      rewardPoints: 0,
      maxParticipants: 0,
      expiration: "",
    });
    setImagePreview(null);
    onClose();
  };

  const RenderReview = ({
    label,
    value,
    multiline = false,
  }: {
    label: string;
    value?: string;
    multiline?: boolean;
  }) => (
    <div className="flex items-start space-x-3">
      <span className="text-gray-400 text-sm w-24">{label}:</span>
      <span className={`text-white text-sm ${multiline ? "max-w-md" : ""}`}>
        {value}
      </span>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Let&apos;s create your task
              </h3>
              <p className="text-gray-400 text-sm">
                Enter the basic information about your task
              </p>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Upload Image</Label>
              <p className="text-gray-500 text-xs">
                This will be a thumbnail for your task
              </p>

              {imagePreview ? (
                <div className="relative">
                  <Image
                    width={25}
                    height={25}
                    src={imagePreview}
                    quality={75}
                    alt="Image preview"
                    loader={({ src, width, quality }) =>
                      `${src}?w=${width}&q=${quality || 75}`
                    }
                  />
                  <button
                    onClick={removeImage}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${
                    dragActive
                      ? "border-purple-500 bg-purple-500/10"
                      : "border-border hover:border-gray-500"
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-400 text-sm">
                    Drag and drop an image here, or click to browse
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleImageUpload(e.target.files[0])
                    }
                    className="hidden"
                  />
                </div>
              )}
            </div>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-gray-300 text-sm">
                Title
              </Label>
              <Input
                id="title"
                placeholder="Enter the title of your task"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="bg-card-box border-border text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Platform & Engagement
              </h3>
              <p className="text-gray-400 text-sm">
                Choose the social platform and engagement types
              </p>
            </div>

            {/* Social Platform */}
            <div className="space-y-2">
              <Label className="text-gray-300 text-sm">Social Platform</Label>
              <Select
                value={formData.platform}
                onValueChange={(value) => handleInputChange("platform", value)}
              >
                <SelectTrigger className="bg-card-box border-border text-white focus:border-purple-500 focus:ring-purple-500">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-card-box border-border">
                  {socialPlatforms.map((platform) => (
                    <SelectItem
                      key={platform.value}
                      value={platform.value}
                      className="text-white hover:bg-border"
                    >
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {formData.platform && (
                <Badge variant="secondary" className="bg-purple-600 text-white">
                  {
                    socialPlatforms.find((p) => p.value === formData.platform)
                      ?.label
                  }
                  <button
                    onClick={() => handleInputChange("platform", "")}
                    className="ml-2 hover:bg-purple-700 rounded-full p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
            </div>

            {/* Engagement Types */}
            {formData.platform && (
              <div className="space-y-2">
                <Label className="text-gray-300 text-sm">Engagement Type</Label>
                <div className="space-y-3">
                  {engagementOptions[
                    formData.platform as keyof typeof engagementOptions
                  ]?.map((engagement) => (
                    <div
                      key={engagement}
                      className="flex items-center space-x-3"
                    >
                      <Checkbox
                        id={engagement}
                        checked={formData.type.includes(engagement)}
                        onCheckedChange={() =>
                          handleEngagementToggle(engagement)
                        }
                        className="border-border data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                      />
                      <Label
                        htmlFor={engagement}
                        className="text-gray-300 text-sm cursor-pointer"
                      >
                        {engagement}
                      </Label>
                    </div>
                  ))}
                </div>

                {formData.type.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {formData.type.map((engagement) => (
                      <Badge
                        key={engagement}
                        variant="secondary"
                        className="bg-purple-600 text-white"
                      >
                        {engagement}
                        <button
                          onClick={() => handleEngagementToggle(engagement)}
                          className="ml-2 hover:bg-purple-700 rounded-full p-0.5"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Rewards & Target
              </h3>
              <p className="text-gray-400 text-sm">
                Enter your reward and target information
              </p>
            </div>

            {/* Target */}
            <div className="space-y-2">
              <Label htmlFor="target" className="text-gray-300 text-sm">
                Target
              </Label>
              <Input
                id="target"
                placeholder="e.g. twitter.com/yourprofile"
                value={formData.target}
                onChange={(e) => handleInputChange("target", e.target.value)}
                className="bg-card-box border-border text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Reward Points */}
            <div className="space-y-2">
              <Label htmlFor="rewardPoints" className="text-gray-300 text-sm">
                Reward Points
              </Label>
              <Input
                id="rewardPoints"
                type="number"
                placeholder="e.g. 10"
                value={formData.rewardPoints}
                onChange={(e) =>
                  handleInputChange(
                    "rewardPoints",
                    parseInt(e.target.value || "0")
                  )
                }
                className="bg-card-box border-border text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Max Participants */}
            <div className="space-y-2">
              <Label
                htmlFor="maxParticipants"
                className="text-gray-300 text-sm"
              >
                Max Participants
              </Label>
              <Input
                id="maxParticipants"
                type="number"
                placeholder="e.g. 500"
                value={formData.maxParticipants}
                onChange={(e) =>
                  handleInputChange(
                    "maxParticipants",
                    parseInt(e.target.value || "0")
                  )
                }
                className="bg-card-box border-border text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-white mb-2">
                Details & Requirements
              </h3>
              <p className="text-gray-400 text-sm">
                Add the final details for your task
              </p>
            </div>
            {/* Expiration (optional) */}
            <div className="space-y-2">
              <Label htmlFor="expiration" className="text-gray-300 text-sm">
                Expiration Date
              </Label>
              <Input
                id="expiration"
                type="date"
                value={formData.expiration || ""}
                onChange={(e) =>
                  handleInputChange("expiration", e.target.value)
                }
                className="bg-card-box border-border text-white focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300 text-sm">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter task description"
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                className="bg-card-box border-border text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 min-h-[100px]"
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">
                Review & Confirm
              </h3>
              <p className="text-gray-400 text-sm">
                Please review your task details before submitting
              </p>
            </div>

            <div className="bg-card-box rounded-lg p-6 space-y-4">
              {imagePreview && (
                <div className="flex items-center space-x-3">
                  <span className="text-gray-400 text-sm w-24">Image:</span>
                  <img
                    src={imagePreview}
                    alt="Task thumbnail"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>
              )}

              <RenderReview label="Title" value={formData.title} />
              <RenderReview
                label="Platform"
                value={
                  socialPlatforms.find((p) => p.value === formData.platform)
                    ?.label
                }
              />
              <RenderReview label="Target" value={formData.target} />
              <RenderReview
                label="Reward Points"
                value={formData.rewardPoints.toString()}
              />
              <RenderReview
                label="Max Participants"
                value={formData.maxParticipants.toString()}
              />
              <RenderReview
                label="Expiration"
                value={formData.expiration || "Not set"}
              />
              <RenderReview
                label="Description"
                value={formData.description}
                multiline
              />

              <div className="flex items-start space-x-3">
                <span className="text-gray-400 text-sm w-24">Engagement:</span>
                <div className="flex flex-wrap gap-2">
                  {formData.type.map((engagement) => (
                    <Badge
                      key={engagement}
                      variant="outline"
                      className="border-border text-gray-300"
                    >
                      {engagement}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-card-box border-border text-white max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">
            {stepTitles[currentStep - 1]}
          </DialogTitle>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-400">
            <span>
              Step {currentStep} of {totalSteps}
            </span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <div className="py-4">{renderStep()}</div>

        {/* Navigation Buttons */}
        <div className="flex justify-between pt-4 border-t border-border">
          <Button
            variant="outline"
            onClick={currentStep === 1 ? handleClose : prevStep}
            className="border-border text-gray-300 hover:bg-card-box"
          >
            {currentStep === 1 ? (
              "Cancel"
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </>
            )}
          </Button>

          <Button
            onClick={currentStep === totalSteps ? handleSubmit : nextStep}
            disabled={!validateStep(currentStep)}
            className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {currentStep === totalSteps ? (
              <>
                <Check className="h-4 w-4 mr-1" />
                Create Task
              </>
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
