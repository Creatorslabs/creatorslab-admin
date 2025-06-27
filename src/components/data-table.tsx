import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Column {
  key: string;
  header: string;
  width?: string;
  render?: (row: any) => React.ReactNode;
}

interface PaginationProps {
  page: number;
  pages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

interface DataTableProps {
  title: string;
  actionText?: string;
  onAction?: () => void;
  columns: Column[];
  data: any[];
  pagination?: PaginationProps;
}

export function DataTable({
  title,
  actionText,
  onAction,
  columns,
  data,
  pagination,
}: DataTableProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "verified":
      case "active":
        return "text-blue-500";
      case "unverified":
        return "text-red-500";
      case "inactive":
        return "text-yellow-500";
      case "completed":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  const renderCellValue = (value: any, key: string) => {
    if (key === "status") {
      return (
        <span className={`text-sm font-medium ${getStatusColor(value)}`}>
          {value}
        </span>
      );
    }

    if ((key === "type" || key === "engagementType") && Array.isArray(value)) {
      return value.map((type, index) => (
        <span key={index} className="text-sm font-medium text-blue-400 mr-1">
          {type}
        </span>
      ));
    }

    const validEngagementTypes = [
      "Join channel",
      "Follow",
      "Like",
      "Quote",
      "Retweet",
      "Comment",
      "Reply",
      "Post",
      "Tag",
      "React",
      "Invite",
    ];

    if (
      typeof value === "string" &&
      validEngagementTypes.some((type) => value.includes(type))
    ) {
      return <span className="text-blue-400">{value}</span>;
    }

    return value;
  };

  return (
    <Card className="bg-card-box border-border">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-foreground text-lg font-semibold">{title}</h3>
          {onAction && actionText && (
            <Button
              onClick={onAction}
              size="sm"
              className="text-foreground bg-primary hover:bg-secondary"
            >
              {actionText}
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-card">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider"
                  style={{ width: column.width }}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-6 text-center text-sm text-muted-foreground"
                >
                  No records found.
                </td>
              </tr>
            ) : (
              data.map((row, index) => (
                <tr
                  key={index}
                  className={cn("hover:bg-gray-750 transition-colors", {
                    "bg-card/40": !(index % 2),
                  })}
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                    >
                      {column.render
                        ? column.render(row)
                        : renderCellValue(row[column.key], column.key)}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && (
        <div className="flex items-center justify-end gap-2 p-4 border-t border-border">
          <Button
            size="sm"
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.page - 1)}
            disabled={!pagination.hasPrev}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => pagination.onPageChange(pagination.page + 1)}
            disabled={!pagination.hasNext}
          >
            Next
          </Button>
        </div>
      )}
    </Card>
  );
}
