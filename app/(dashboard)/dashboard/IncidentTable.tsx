"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import {
  IncidentReport,
  PaginationMeta,
  getSeverityBadgeClass,
  getStatusBadgeClass,
  formatStatusText,
} from "./types";

interface IncidentTableProps {
  incidents: IncidentReport[];
  loading: boolean;
  pagination: PaginationMeta | null;
  currentPage: number;
  onPageChange: (page: number) => void;
  onViewIncident: (incident: IncidentReport) => void;
}

export function IncidentTable({
  incidents,
  loading,
  pagination,
  currentPage,
  onPageChange,
  onViewIncident,
}: IncidentTableProps) {
  return (
    <div className="space-y-4">
      <div className="overflow-x-auto border rounded-lg">
        <Table>
          <TableHeader className="bg-muted/40">
            <TableRow>
              <TableHead className="font-semibold text-sm text-foreground py-3 pl-4">
                Date
              </TableHead>
              <TableHead className="font-semibold text-sm text-foreground py-3">
                Reporter
              </TableHead>
              <TableHead className="font-semibold text-sm text-foreground py-3">
                Incident Ward / Dept
              </TableHead>
              <TableHead className="font-semibold text-sm text-foreground py-3">
                Cause Group
              </TableHead>
              <TableHead className="font-semibold text-sm text-foreground py-3">
                Severity Matrix
              </TableHead>
              <TableHead className="font-semibold text-sm text-foreground py-3">
                Status
              </TableHead>
              <TableHead className="text-right font-semibold text-sm text-foreground py-3 pr-4">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, idx) => (
                <TableRow key={idx} className="animate-pulse">
                  <TableCell className="py-4 pl-4">
                    <div className="h-4 bg-muted rounded w-20" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-muted rounded w-28" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-muted rounded w-24" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-4 bg-muted rounded w-36" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 bg-muted rounded w-16" />
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="h-5 bg-muted rounded w-20" />
                  </TableCell>
                  <TableCell className="py-4 pr-4 text-right">
                    <div className="h-7 bg-muted rounded w-16 ml-auto" />
                  </TableCell>
                </TableRow>
              ))
            ) : incidents.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-16 text-sm text-muted-foreground"
                >
                  No reported incident files found matching your profile.
                </TableCell>
              </TableRow>
            ) : (
              incidents.map((incident) => (
                <TableRow
                  key={incident.id}
                  className="hover:bg-muted/20 transition-colors"
                >
                  <TableCell className="text-sm whitespace-nowrap py-3 pl-4 text-muted-foreground">
                    {incident.dateOfIncident}
                  </TableCell>
                  <TableCell className="text-sm font-medium whitespace-nowrap py-3">
                    {incident.reporterName}
                  </TableCell>
                  <TableCell className="text-sm py-3 text-muted-foreground">
                    {incident.incidentWardDept}
                  </TableCell>
                  <TableCell className="max-w-[200px] text-sm truncate py-3 font-medium">
                    {incident.causeGroup}
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityBadgeClass(incident.severityLevel)}`}
                    >
                      {incident.severityLevel}
                    </span>
                  </TableCell>
                  <TableCell className="py-3">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusBadgeClass(incident.incidentStatus)}`}
                    >
                      {formatStatusText(incident.incidentStatus)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-3 pr-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onViewIncident(incident)}
                      className="text-xs h-8 px-3 flex items-center gap-1.5 ml-auto"
                    >
                      <Eye className="h-3.5 w-3.5" /> View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && pagination && pagination.total_pages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 px-1">
          <div className="text-sm text-muted-foreground">
            Total: {pagination.total_items} institutional safety records
            compiled
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === pagination.total_pages}
              className="h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
