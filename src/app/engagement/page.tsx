"use client";

import { DataTable } from '@/components/data-table';
import { useRouter } from 'next/navigation';

const engagementColumns = [
  { key: 'name', header: 'Name' },
  { key: 'socialPlatform', header: 'Social Platform' },
  { key: 'engagementType', header: 'Engagement type' },
  { key: 'status', header: 'Status' },
];

const engagementData = [
  { 
    name: 'Telegram', 
    socialPlatform: 'Telegram', 
    engagementType: ['Page follow', 'Quote Page'], 
    status: 'Active' 
  },
  { 
    name: 'Twitter', 
    socialPlatform: 'Twitter', 
    engagementType: ['Page follow', 'Quote', 'Retweet', 'Like'], 
    status: 'Inactive' 
  },
  { 
    name: 'Discord', 
    socialPlatform: 'Discord', 
    engagementType: ['Join channel'], 
    status: 'Active' 
  },
];

export default function EngagementPage() {
    const router = useRouter();
  return (
    <div className="space-y-6">
        {/* Engagement Table */}
        <DataTable
          title="Engagement"
          columns={engagementColumns}
              data={engagementData}
              actionText="Create Engagement Type"
  onAction={() => router.push("/tasks")}
        />
      </div>  );
}