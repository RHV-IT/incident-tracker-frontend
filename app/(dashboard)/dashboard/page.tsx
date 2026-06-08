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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
  MoreHorizontal,
  Calendar,
  Clock,
  MapPin,
  User,
  Briefcase,
  Phone,
} from "lucide-react";
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
  const [selectedIncident, setSelectedIncident] =
    useState<IncidentReport | null>(null);
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
                  <TableHead className="w-[80px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      <div className="flex items-center justify-center gap-2 text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" /> Loading
                        data...
                      </div>
                    </TableCell>
                  </TableRow>
                ) : incidents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={7}
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
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedIncident(incident)}
                          title="View detailed report"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </TableCell>
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

      {/* --- Detailed Report Modal View --- */}
      <Dialog
        open={!!selectedIncident}
        onOpenChange={(open) => !open && setSelectedIncident(null)}
      >
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              Incident Detail Report
            </DialogTitle>
            <DialogDescription>
              Full system declaration records for incident identifier
              parameters.
            </DialogDescription>
          </DialogHeader>

          {selectedIncident && (
            <div className="space-y-6 pt-4">
              {/* Primary Summary Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-muted/40 p-3 rounded-lg border">
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Date
                  </span>
                  <span className="text-sm font-medium">
                    {selectedIncident.dateOfIncident}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Time
                  </span>
                  <span className="text-sm font-medium">
                    {selectedIncident.timeOfIncident}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> Location
                  </span>
                  <span className="text-sm font-medium capitalize">
                    {selectedIncident.locationOfIncident}
                  </span>
                </div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">
                    Severity Classification
                  </span>
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${getSeverityBadgeClass(selectedIncident.severityLevel)}`}
                    >
                      {selectedIncident.severityLevel}
                    </span>
                  </div>
                </div>
              </div>

              {/* Grid Block: Info Categories */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-3 border p-3 rounded-md bg-background">
                  <h3 className="text-sm font-semibold tracking-tight border-b pb-1 text-primary">
                    Reporter Details
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <User className="h-3.5 w-3.5" /> Full Name:
                      </span>{" "}
                      <span className="font-medium">
                        {selectedIncident.reporterName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Briefcase className="h-3.5 w-3.5" /> Department:
                      </span>{" "}
                      <span className="font-medium uppercase">
                        {selectedIncident.department}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground text-xs">
                        Job Position:
                      </span>{" "}
                      <span className="font-medium">
                        {selectedIncident.position}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3.5 w-3.5" /> Contact Info:
                      </span>{" "}
                      <span className="font-medium">
                        {selectedIncident.contactInfo}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 border p-3 rounded-md bg-background">
                  <h3 className="text-sm font-semibold tracking-tight border-b pb-1 text-primary">
                    Contextual Parameters
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-xs">
                        Incident Typology Classification:
                      </span>
                      <span className="font-medium bg-muted px-2 py-0.5 rounded text-xs w-fit">
                        {selectedIncident.typeOfIncident}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-xs">
                        Personnel/People Involved:
                      </span>
                      <span className="font-medium text-xs break-words">
                        {selectedIncident.peopleInvolved ||
                          "No third party individual listed"}
                      </span>
                    </div>
                    <div className="flex flex-col gap-0.5">
                      <span className="text-muted-foreground text-xs">
                        Supervisor Account Informed:
                      </span>
                      <span className="font-medium text-xs">
                        {selectedIncident.supervisorNotified || "None declared"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Full Width Paragraph Descriptors */}
              <div className="space-y-3 border p-4 rounded-md bg-background">
                <h3 className="text-sm font-semibold tracking-tight border-b pb-1 text-primary">
                  Incident Statements & Declarations
                </h3>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Detailed Log Description
                  </h4>
                  <p className="text-sm text-foreground bg-muted/30 p-2.5 rounded border border-dashed whitespace-pre-wrap leading-relaxed">
                    {selectedIncident.descriptionOfIncident}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Immediate Safety Action Executed
                  </h4>
                  <p className="text-sm text-foreground bg-muted/30 p-2.5 rounded border border-dashed whitespace-pre-wrap leading-relaxed">
                    {selectedIncident.immediateActionTaken}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Bodily Injury or Property Damage Assertions
                  </h4>
                  <p className="text-sm text-foreground bg-muted/30 p-2.5 rounded border border-dashed whitespace-pre-wrap leading-relaxed">
                    {selectedIncident.injuryOrDamage}
                  </p>
                </div>

                <div className="space-y-2 pt-1">
                  <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Recommended Continuous Preventive Actions
                  </h4>
                  <p className="text-sm text-card-foreground bg-primary/5 p-2.5 rounded border border-primary/20 whitespace-pre-wrap leading-relaxed">
                    {selectedIncident.recommendedPreventiveAction}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button
                  variant="outline"
                  onClick={() => setSelectedIncident(null)}
                >
                  Close File Record
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
