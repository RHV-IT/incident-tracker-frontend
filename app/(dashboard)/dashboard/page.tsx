"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

// --- Type Definitions matching Go Backend ---
export type SeverityLevel = "near miss" | "minor" | "major" | "critical";

export interface IncidentReport {
  reporterName: string;
  department: string;
  position: string;
  contactInfo: string;
  dateOfIncident: string;
  timeOfIncident: string;
  locationOfIncident: string;
  typeOfIncident: string;
  peopleInvolved: string;
  descriptionOfIncident: string;
  immediateActionTaken: string;
  injuryOrDamage: string;
  severityLevel: SeverityLevel;
  supervisorNotified: string;
  recommendedPreventiveAction: string;
}

interface PaginationMeta {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

interface PaginatedIncidentResponse {
  data: IncidentReport[] | null;
  pagination: PaginationMeta;
}

export default function IncidentTracker() {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta>({
    current_page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Fetch Incidents from Backend
  const fetchIncidents = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_apiurl}/incidents?page=${page}&limit=${pagination.page_size}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      // Handle token expiration / unauthorized states
      if (res.status === 401) {
        toast.error("Session expired. Please log in again.");
        router.replace("/login");
        return;
      }

      if (!res.ok) throw new Error("Failed to fetch data");

      const result: PaginatedIncidentResponse = await res.json();
      setIncidents(result.data || []);
      setPagination(result.pagination);
    } catch (error) {
      toast.error("Could not load incidents from server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents(pagination.current_page);
  }, [pagination.current_page]);

  const getSeverityBadgeClass = (level: SeverityLevel) => {
    switch (level) {
      case "near miss":
        return "bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-400";
      case "minor":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "major":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400";
      case "critical":
        return "bg-destructive/10 text-destructive dark:bg-destructive/20";
      default:
        return "bg-secondary text-secondary-foreground";
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Incident Tracker
          </h1>
          <p className="text-muted-foreground">
            Manage, view, and report workplace safety and technical incidents.
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="p-4 sm:p-6">
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent className="p-0 sm:p-6 sm:pt-0">
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date / Time</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Reporter</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading
                        data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : incidents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="h-24 text-center text-muted-foreground"
                    >
                      No incidents found.
                    </TableCell>
                  </TableRow>
                ) : (
                  incidents.map((incident, idx) => (
                    <TableRow key={idx}>
                      <TableCell className="font-medium whitespace-nowrap">
                        {incident.dateOfIncident}{" "}
                        <span className="text-xs text-muted-foreground ml-1">
                          {incident.timeOfIncident}
                        </span>
                      </TableCell>
                      <TableCell>{incident.typeOfIncident}</TableCell>
                      <TableCell>{incident.department}</TableCell>
                      <TableCell>{incident.locationOfIncident}</TableCell>
                      <TableCell>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getSeverityBadgeClass(incident.severityLevel)}`}
                        >
                          {incident.severityLevel}
                        </span>
                      </TableCell>
                      <TableCell>{incident.reporterName}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between space-x-2 py-4 px-4 sm:px-0">
            <div className="text-sm text-muted-foreground">
              Total items:{" "}
              <span className="font-medium">{pagination.total_items}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Page {pagination.current_page} of {pagination.total_pages}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    current_page: prev.current_page - 1,
                  }))
                }
                disabled={pagination.current_page <= 1 || isLoading}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() =>
                  setPagination((prev) => ({
                    ...prev,
                    current_page: prev.current_page + 1,
                  }))
                }
                disabled={
                  pagination.current_page >= pagination.total_pages || isLoading
                }
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
