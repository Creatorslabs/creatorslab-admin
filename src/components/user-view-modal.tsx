'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  Mail, 
  Wallet, 
  Calendar, 
  Clock, 
  Users,
  DollarSign,
  CheckCircle,
  XCircle,
  AlertCircle,
  Twitter,
  MessageSquare,
  Shield,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { IUser } from '@/lib/models/User';

interface UserViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser | null;
}

export function UserViewModal({ isOpen, onClose, user }: UserViewModalProps) {
  if (!user) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Deactivated':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Deactivated':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'creator':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      case 'user':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const getTimeAgo = (date: Date | null | undefined) => {
    if (!date) return 'Never';
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Less than an hour ago';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks} week${diffInWeeks > 1 ? 's' : ''} ago`;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const truncateWallet = (wallet: string) => {
    if (!wallet) return 'Not connected';
    return `${wallet.slice(0, 6)}...${wallet.slice(-4)}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-background border-border text-foreground max-w-full max-h-[100vh] md:max-w-4xl md:max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-6">
          <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-400" />
            </div>
            User Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Header */}
          <Card className="bg-card-box border-border p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              {/* Avatar Section */}
              <div className="relative">
                <Avatar className="w-20 h-20 border-4 border-purple-500/20">
                  <AvatarImage src={user.image} alt={user.username || 'User'} />
                  <AvatarFallback className="bg-primary text-foreground text-xl font-semibold">
                    {user.username ? user.username.charAt(0).toUpperCase() : 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-card-box rounded-full flex items-center justify-center border-2 border-border">
                  {getStatusIcon(user.status)}
                </div>
              </div>

              {/* Basic Info */}
              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-xl font-bold text-foreground mb-1">
                    {user.username || 'Anonymous User'}
                  </h2>
                  <p className="text-gray-400 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {user.email || 'No email provided'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <Badge className={`${getRoleColor(user.role)} border capitalize`}>
                    <Shield className="w-3 h-3 mr-1" />
                    {user.role}
                  </Badge>
                  <Badge className={`${getStatusColor(user.status)} border`}>
                    {getStatusIcon(user.status)}
                    <span className="ml-1">{user.status}</span>
                  </Badge>
                </div>
              </div>

              {/* Balance Display */}
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400 flex items-center gap-1">
                  <DollarSign className="w-5 h-5" />
                  {user.balance.toLocaleString()}
                </div>
                <p className="text-gray-400 text-sm">Balance</p>
              </div>
            </div>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Account Information */}
            <Card className="bg-card-box border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Account Information</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Username</span>
                  <span className="text-foreground font-medium">{user.username || 'Not set'}</span>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Email</span>
                  <span className="text-foreground font-medium">{user.email || 'Not provided'}</span>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Wallet Address</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm">{truncateWallet(user.wallet || '')}</span>
                    {user.wallet && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.wallet!)}
                        className="h-6 w-6 p-0 hover:bg-border"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Role</span>
                  <Badge className={`${getRoleColor(user.role)} border capitalize`}>
                    {user.role}
                  </Badge>
                </div>
              </div>
            </Card>

            {/* Activity & Stats */}
            <Card className="bg-card-box border-border p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-green-400" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Activity & Stats</h3>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-start py-2">
                  <span className="text-gray-400">Last Login</span>
                  <div className="text-right">
                    <div className="text-foreground font-medium">
                      {getTimeAgo(user.lastLoginDate)}
                    </div>
                    <div className="text-gray-500 text-sm">
                      {formatDate(user.lastLoginDate)}
                    </div>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Referral Count</span>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-400" />
                    <span className="text-foreground font-bold">{user.referralCount}</span>
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Referral Code</span>
                  <div className="flex items-center gap-2">
                    <span className="text-foreground font-mono text-sm">{user.referralCode || 'Not generated'}</span>
                    {user.referralCode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(user.referralCode!)}
                        className="h-6 w-6 p-0 hover:bg-border"
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Referred By</span>
                  <span className="text-foreground font-medium">{user.referredBy || 'Direct signup'}</span>
                </div>

                <Separator className="bg-border" />

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-400">Account Created</span>
                  <div className="text-right">
                    <div className="text-foreground font-medium">
                      {formatDate(user.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Verification Status */}
          <Card className="bg-card-box border-border p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">Verification Status</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-4 bg-border/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-3">
                  <Twitter className="w-5 h-5 text-blue-400" />
                  <span className="text-foreground font-medium">Twitter</span>
                </div>
                {user.verification.twitter ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-border/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 text-indigo-400" />
                  <span className="text-foreground font-medium">Discord</span>
                </div>
                {user.verification.discord ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>

              <div className="flex items-center justify-between p-4 bg-border/50 rounded-lg border border-gray-600/50">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-green-400" />
                  <span className="text-foreground font-medium">Email</span>
                </div>
                {user.verification.email ? (
                  <CheckCircle className="w-5 h-5 text-green-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
              </div>
            </div>
          </Card>

          {/* Deactivation Reason (if applicable) */}
          {user.status === 'Deactivated' && user.reason && (
            <Card className="bg-red-900/20 border-red-800/50 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-red-400">Deactivation Reason</h3>
              </div>
              <p className="text-red-300 bg-red-900/30 p-4 rounded-lg border border-red-800/30">
                {user.reason}
              </p>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}