"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useLoader } from "@/hooks/useLoader";
import { toast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface ILog {
  _id: string;
  level: "error" | "warn" | "info" | "log";
  message: string;
  meta?: any[];
  environment: string;
  isClient: boolean;
  createdAt: string;
}

interface IFilters {
  level?: string;
  env?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}

export default function LogsPage() {
  const [logs, setLogs] = useState<ILog[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    totalPages: 1,
    limit: 20,
  });

  const [expanded, setExpanded] = useState<string | null>(null);
  const [filters, setFilters] = useState<IFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const { LoaderModal, showLoader, hideLoader } = useLoader();

  const buildQueryString = (pageToFetch: number) => {
    const params = new URLSearchParams();
    params.set("page", pageToFetch.toString());
    params.set("limit", "20");
    params.set("sort", "-createdAt");

    if (filters.level) params.set("level", filters.level);
    if (filters.env) params.set("env", filters.env);
    if (filters.search) params.set("search", filters.search);
    if (filters.startDate) params.set("startDate", filters.startDate);
    if (filters.endDate) params.set("endDate", filters.endDate);

    return params.toString();
  };

  const fetchLogs = useCallback(
    async (pageToFetch = 1, reset = false) => {
      if (pageToFetch === 1) showLoader({ message: "Loading logs..." });

      try {
        const queryString = buildQueryString(pageToFetch);
        const res = await fetch(`/api/logs?${queryString}`);
        const json = await res.json();

        if (json.success) {
          if (reset || pageToFetch === 1) {
            setLogs(json.logs);
          } else {
            setLogs((prev) => [...prev, ...json.logs]);
          }
          setPagination(json.pagination);
        } else {
          toast({ title: "Error loading logs", variant: "destructive" });
        }
      } catch (err) {
        toast({
          title: "Fetch failed",
          description: (err as Error).message,
          variant: "destructive",
        });
      } finally {
        hideLoader();
      }
    },
    [showLoader, hideLoader]
  );

  useEffect(() => {
    fetchLogs(1, true);
  }, []);

  const toggleExpand = (id: string) => {
    setExpanded(expanded === id ? null : id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          Logs ({pagination.total})
        </h2>
        <Button
          onClick={() => setShowFilters(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </Button>
      </div>

      {/* Logs cards */}
      <div className="space-y-4 pb-4">
        {logs.length === 0 ? (
          <p className="text-center text-gray-400 py-8">No logs found</p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className="border border-card bg-[#1E1E1E] rounded-xl p-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-foreground">{log.message}</p>
                  <p className="text-sm text-gray-400">
                    {log.level.toUpperCase()} •{" "}
                    {new Date(log.createdAt).toLocaleString()} •{" "}
                    {log.environment} • {log.isClient ? "Client" : "Server"}
                  </p>
                </div>
                <button
                  onClick={() => toggleExpand(log._id)}
                  className="ml-4 p-1 rounded hover:bg-gray-700"
                >
                  {expanded === log._id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>
              </div>
              {expanded === log._id && (
                <div className="mt-3 p-3 bg-card-box rounded-lg text-sm text-gray-400 overflow-x-auto">
                  {log.meta ? (
                    <pre className="whitespace-pre-wrap">
                      {JSON.stringify(log.meta, null, 2)}
                    </pre>
                  ) : (
                    <p>No metadata</p>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {/* Load more */}
        {pagination.page < pagination.totalPages && (
          <div className="flex justify-center pt-4">
            <Button onClick={() => fetchLogs(pagination.page + 1)}>
              Load more
            </Button>
          </div>
        )}
      </div>

      <LoaderModal />

      {/* Filters modal */}
      <Dialog open={showFilters} onOpenChange={setShowFilters}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Filter Logs</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {/* Level */}
            <div>
              <Label>Level</Label>
              <Select
                value={filters.level || ""}
                onValueChange={(v) => setFilters((f) => ({ ...f, level: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warn">Warn</SelectItem>
                  <SelectItem value="info">Info</SelectItem>
                  <SelectItem value="log">Log</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Env */}
            <div>
              <Label>Environment</Label>
              <Select
                value={filters.env || ""}
                onValueChange={(v) => setFilters((f) => ({ ...f, env: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All environments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="development">Development</SelectItem>
                  <SelectItem value="production">Production</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div>
              <Label>Search Message</Label>
              <Input
                value={filters.search || ""}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, search: e.target.value }))
                }
                placeholder="Search in message"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={filters.startDate || ""}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, startDate: e.target.value }))
                  }
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={filters.endDate || ""}
                  onChange={(e) =>
                    setFilters((f) => ({ ...f, endDate: e.target.value }))
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({});
                setShowFilters(false);
                fetchLogs(1, true);
              }}
            >
              Reset
            </Button>
            <Button
              onClick={() => {
                fetchLogs(1, true);
                setShowFilters(false);
              }}
            >
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
