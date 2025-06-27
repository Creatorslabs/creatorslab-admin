import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <Card className="bg-card-box border-border p-6">
      <div className="flex md:flex-row-reverse flex-row items-center justify-between gap-4 md:gap-0">
        <div className="flex flex-col gap-2 items-start md:items-end">
          <p className="text-gray-400 text-sm">{title}</p>
          <p className="text-foreground text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="bg-white/5 p-3 rounded-lg">
          <Icon className="h-6 w-6 text-card-icon" />
        </div>
      </div>
    </Card>
  );
}
