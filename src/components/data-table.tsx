"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectViewport } from "@/components/ui/select";

export type DataTableColumn<T> = {
  key: keyof T | string;
  header: string;
  cell?: (item: T) => React.ReactNode;
  className?: string;
};

export type FilterOption = {
  key: string;
  label: string;
  options: string[];
};

export function DataTable<T extends { id: string }>(
  {
    data,
    columns,
    filters,
    searchPlaceholder,
    defaultPageSize = 8
  }: {
    data: T[];
    columns: DataTableColumn<T>[];
    filters?: FilterOption[];
    searchPlaceholder?: string;
    defaultPageSize?: number;
  }
) {
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(defaultPageSize);
  const [activeFilters, setActiveFilters] = React.useState<Record<string, string>>({});
  const [sortKey, setSortKey] = React.useState<string | null>(null);
  const [sortDirection, setSortDirection] = React.useState<"asc" | "desc">("asc");

  const filtered = React.useMemo(() => {
    const filteredRows = data.filter((item) => {
      const matchesSearch = search
        ? Object.values(item).some((value) =>
            String(value).toLowerCase().includes(search.toLowerCase())
          )
        : true;
      const matchesFilters = filters
        ? filters.every((filter) => {
            const value = activeFilters[filter.key];
            if (!value || value === "All") return true;
            return String((item as Record<string, string>)[filter.key]) === value;
          })
        : true;
      return matchesSearch && matchesFilters;
    });

    if (!sortKey) return filteredRows;

    return [...filteredRows].sort((a, b) => {
      const aValue = String((a as Record<string, string>)[sortKey] ?? "");
      const bValue = String((b as Record<string, string>)[sortKey] ?? "");
      const comparison = aValue.localeCompare(bValue, undefined, { numeric: true });
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, search, activeFilters, filters, sortKey, sortDirection]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  React.useEffect(() => {
    setPage(1);
  }, [search, activeFilters, pageSize, sortKey, sortDirection]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDirection("asc");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Input
          placeholder={searchPlaceholder ?? "Search"}
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="max-w-xs"
        />
        {filters?.map((filter) => (
          <Select
            key={filter.key}
            value={activeFilters[filter.key] ?? "All"}
            onValueChange={(value) =>
              setActiveFilters((prev) => ({
                ...prev,
                [filter.key]: value
              }))
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder={filter.label} />
            </SelectTrigger>
            <SelectContent>
              <SelectViewport>
                {["All", ...filter.options].map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectViewport>
            </SelectContent>
          </Select>
        ))}
        <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectViewport>
              {[6, 8, 10, 12].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectViewport>
          </SelectContent>
        </Select>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={String(column.key)} className={column.className}>
                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-left"
                  onClick={() => typeof column.key === "string" && handleSort(column.key)}
                >
                  {column.header}
                  {sortKey === column.key ? (sortDirection === "asc" ? "↑" : "↓") : null}
                </button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginated.map((row) => (
            <TableRow key={row.id}>
              {columns.map((column) => (
                <TableCell key={String(column.key)} className={column.className}>
                  {column.cell ? column.cell(row) : String((row as Record<string, string>)[column.key])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {paginated.length} of {filtered.length} records
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <span className="text-sm">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={page === totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
