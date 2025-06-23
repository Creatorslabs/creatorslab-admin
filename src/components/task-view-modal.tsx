'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  User, 
  Calendar, 
  Clock, 
  Users,
  Target,
  Award,
  CheckCircle,
  XCircle,
  AlertCircle,
  Twitter,
  MessageSquare,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
  Copy,
  Image as ImageIcon
} from 'lucide-react';
import Image from 'next/image';
import { ITask } from '@/lib/models/Task';

interface ITaskM extends ITask {
    participants: String[];
}

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: ITaskM | null;
}

export function TaskViewModal({ isOpen, onClose, task }: TaskViewModalProps) {
  if (!task) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'inactive':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'completed':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'inactive':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getPlatformIcon = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'twitter':
      case 'x':
        return <Twitter className="w-4 h-4 text-blue-400" />;
      case 'discord':
        return <MessageSquare className="w-4 h-4 text-indigo-400" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <Facebook className="w-4 h-4 text-blue-600" />;
      case 'youtube':
        return <Youtube className="w-4 h-4 text-red-500" />;
      default:
        return <ExternalLink className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const platformLower = platform.toLowerCase();
    switch (platformLower) {
      case 'twitter':
      case 'x':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'discord':
        return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'instagram':
        return 'bg-pink-500/10 text-pink-400 border-pink-500/20';
      case 'facebook':
        return 'bg-blue-600/10 text-blue-400 border-blue-600/20';
      case 'youtube':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return 'Not set';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getTimeRemaining = (expiration: Date | undefined) => {
    if (!expiration) return 'No expiration';
    const now = new Date();
    const expirationDate = new Date(expiration);
    const diffInHours = Math.floor((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 0) return 'Expired';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} remaining`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} remaining`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getParticipationPercentage = () => {
    if (task.maxParticipants === 0) return 0;
    return Math.round((task.participants.length / task.maxParticipants) * 100);
  };

  const isExpired = task.expiration && new Date(task.expiration) < new Date();
  const isNearExpiry = task.expiration && new Date(task.expiration).getTime() - new Date().getTime() < 24 * 60 * 60 * 1000;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border text-foreground max-w-full max-h-[100vh] md:max-w-4xl md:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-400" />
            </div>
            Task Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Header */}
          <Card className="bg-card-box border p-6">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Task Image */}
              <div className="flex-shrink-0">
                <div className="w-32 h-32 bg-card rounded-lg overflow-hidden border-2 border-gray-600">
                  {task.image ? (
                    <Image
                      src={task.image}
                      alt={task.title}
                      width={128}
                      height={128}
                                          className="w-full h-full object-cover"
                                          loader={({ src, width, quality }) =>
                                            `${src}?w=${width}&q=${quality || 75}`
                                          }
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-8 h-8 text-gray-500" />
                    </div>
                  )}
                </div>
              </div>

              {/* Task Info */}
              <div className="flex-1 space-y-4">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-2">{task.title}</h2>
                  <p className="text-gray-400 flex items-center gap-2 mb-3">
                    <User className="w-4 h-4" />
                    Created by: {task.creator}
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <Badge className={`${getStatusColor(task.status)} border capitalize`}>
                      {getStatusIcon(task.status)}
                      <span className="ml-1">{task.status}</span>
                    </Badge>
                    <Badge className={`${getPlatformColor(task.platform)} border`}>
                      {getPlatformIcon(task.platform)}
                      <span className="ml-1">{task.platform}</span>
                    </Badge>
                    {isExpired && (
                      <Badge className="bg-red-500/10 text-red-400 border-red-500/20 border">
                        <Clock className="w-3 h-3 mr-1" />
                        Expired
                      </Badge>
                    )}
                    {isNearExpiry && !isExpired && (
                      <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 border">
                        <Clock className="w-3 h-3 mr-1" />
                        Expiring Soon
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="text-lg font-bold text-purple-400">{task.rewardPoints}</div>
                    <div className="text-xs text-gray-400">Reward Points</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="text-lg font-bold text-blue-400">{task.participants.length}</div>
                    <div className="text-xs text-gray-400">Participants</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="text-lg font-bold text-green-400">{task.maxParticipants}</div>
                    <div className="text-xs text-gray-400">Max Participants</div>
                  </div>
                  <div className="text-center p-3 bg-card/50 rounded-lg">
                    <div className="text-lg font-bold text-orange-400">{getParticipationPercentage()}%</div>
                    <div className="text-xs text-gray-400">Filled</div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Task Information */}
            <Card className="bg-card-box border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Task Information</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-400">Title</span>
                  <span className="text-foreground font-medium text-right max-w-xs">{task.title}</span>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Creator</span>
                  <span className="text-foreground font-medium">{task.creator}</span>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Platform</span>
                  <Badge className={`${getPlatformColor(task.platform)} border`}>
                    {getPlatformIcon(task.platform)}
                    <span className="ml-1">{task.platform}</span>
                  </Badge>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Status</span>
                  <Badge className={`${getStatusColor(task.status)} border capitalize`}>
                    {getStatusIcon(task.status)}
                    <span className="ml-1">{task.status}</span>
                  </Badge>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Target Link</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm max-w-xs truncate">{task.target}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(task.target)}
                      className="h-6 w-6 p-0 hover:bg-card"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => window.open(task.target, '_blank')}
                      className="h-6 w-6 p-0 hover:bg-card"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timing & Participation */}
            <Card className="bg-card-box border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Timing & Participation</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-400">Created</span>
                  <div className="text-right">
                    <div className="text-foreground font-medium">
                      {formatDate(task.createdAt)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-400">Last Updated</span>
                  <div className="text-right">
                    <div className="text-foreground font-medium">
                      {formatDate(task.updatedAt)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-400">Expiration</span>
                  <div className="text-right">
                    <div className={`font-medium ${isExpired ? 'text-red-400' : isNearExpiry ? 'text-yellow-400' : 'text-foreground'}`}>
                      {formatDate(task.expiration)}
                    </div>
                    <div className={`text-sm ${isExpired ? 'text-red-400' : isNearExpiry ? 'text-yellow-400' : 'text-gray-500'}`}>
                      {getTimeRemaining(task.expiration)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Participants</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-400" />
                    <span className="text-foreground font-bold">
                      {task.participants.length} / {task.maxParticipants}
                    </span>
                  </div>
                </div>

                <Separator className="bg-card" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Reward Points</span>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-purple-400" />
                    <span className="text-foreground font-bold">{task.rewardPoints}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Engagement Types */}
          <Card className="bg-card-box border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Target className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Engagement Types</h3>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {task.type.map((engagementType: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 p-3 bg-card/50 rounded-lg border border-gray-600/50"
                >
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-foreground text-sm font-medium">{engagementType}</span>
                </div>
              ))}
            </div>

            {task.type.length === 0 && (
              <div className="text-center py-8">
                <XCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-gray-400">No engagement types specified</p>
              </div>
            )}
          </Card>

          {/* Description */}
          <Card className="bg-card-box border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-orange-500/10 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 text-orange-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Description</h3>
            </div>

            <div className="bg-card/30 p-4 rounded-lg border border-gray-600/30">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided for this task.'}
              </p>
            </div>
          </Card>

          {/* Participation Progress */}
          <Card className="bg-card-box border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Users className="w-4 h-4 text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Participation Progress</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Progress</span>
                <span className="text-foreground font-bold">{getParticipationPercentage()}%</span>
              </div>
              
              <div className="w-full bg-card rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${getParticipationPercentage()}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">{task.participants.length} participants</span>
                <span className="text-gray-400">{task.maxParticipants} max</span>
              </div>
            </div>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}