import { DataTable } from '@/components/data-table';
import { StatCard } from '@/components/stat-card';
import { FileText, CheckCircle, Clock } from 'lucide-react';

const statsData = [
  { title: 'Total Task created', value: '20,000', icon: FileText },
  { title: 'Completed task', value: '12,001', icon: CheckCircle },
  { title: 'Pending task', value: '25,100', icon: Clock },
];

const tasksColumns = [
  { key: 'title', header: 'Title' },
  { key: 'creator', header: 'Creator' },
  { key: 'taskLink', header: 'Task Link' },
  { key: 'socialPlatform', header: 'Social Platform' },
  { key: 'engagementType', header: 'Engagement type' },
  { key: 'status', header: 'Status' },
];

const tasksData = [
  { 
    title: 'Follow Superteam and quote the page', 
    creator: 'Barbie-xy', 
    taskLink: 'Barbie-xy', 
    socialPlatform: 'Twitter', 
    engagementType: ['Page follow', 'Quote Page'], 
    status: 'Active' 
  },
  { 
    title: 'Follow Trykey page', 
    creator: 'ifex', 
    taskLink: 'ifex', 
    socialPlatform: 'Twitter', 
    engagementType: ['Page follow'], 
    status: 'Inactive' 
  },
  { 
    title: 'Join Superteam Discord', 
    creator: 'Domsbaba', 
    taskLink: 'Domsbaba', 
    socialPlatform: 'Discord', 
    engagementType: ['Join channel'], 
    status: 'Active' 
  },
];

export default function TasksPage() {
  return (
    <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Tasks Table */}
        <DataTable
          title="Tasks (120)"
          columns={tasksColumns}
              data={tasksData}
              actionText='Create Task'
        />
      </div>
  );
}