import { DataTable } from '@/components/data-table';
import { StatCard } from '@/components/stat-card';
import { Users, UserCheck, UserX } from 'lucide-react';

const statsData = [
  { title: 'Total Users', value: '32,001', icon: Users },
  { title: 'Verified users', value: '12,001', icon: UserCheck },
  { title: 'Unverified users', value: '25,100', icon: UserX },
];

const usersColumns = [
  { key: 'username', header: 'Username' },
  { key: 'email', header: 'Email' },
  { key: 'walletAddress', header: 'Wallet address' },
  { key: 'accountType', header: 'Account type' },
  { key: 'status', header: 'Status' },
];

const usersData = [
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Unverified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Unverified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Unverified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Unverified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Verified' },
  { username: 'John-Dre', email: 'Jondre@email.com', walletAddress: 'Dx45ru...o987', accountType: 'Creator', status: 'Unverified' },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statsData.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Users Table */}
        <DataTable
          title="Users"
          columns={usersColumns}
          data={usersData.slice(0,10)}
        />
      </div>
  );
}