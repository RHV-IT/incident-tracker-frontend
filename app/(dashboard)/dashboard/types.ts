export type SeverityLevel = "near miss" | "minor" | "major" | "critical";
export type IncidentStatus = "unresolved" | "inprogress" | "resolved";

export const VALID_STATUSES: { value: IncidentStatus; label: string }[] = [
  { value: "unresolved", label: "Unresolved" },
  { value: "inprogress", label: "In Progress" },
  { value: "resolved", label: "Resolved" },
];

export interface IncidentReport {
  id: number;
  principalName: string;
  principalGender: string;
  principalDob: string;
  principalType: string;
  patientId?: string;
  patientWardDept?: string;
  staffJobTitle?: string;
  staffPhone?: string;
  staffPlaceOfWork?: string;
  staffSite?: string;
  peopleInvolved: string;
  dateOfIncident: string;
  timeOfIncident: string;
  locationOfIncident: string;
  incidentWardDept: string;
  witnesses?: string;
  witnessType?: string;
  witnessWardDept?: string;
  witnessJobTitle?: string;
  witnessPhone?: string;
  isNearMiss: boolean;
  causeGroup: string;
  causes: string;
  prescribingDoctor?: string;
  treatmentReceived: string;
  equipmentInvolved: string;
  equipmentModel?: string;
  equipmentSentForRepair: boolean;
  equipmentWithdrawn: boolean;
  equipmentRetained: boolean;
  equipmentNumber?: string;
  isMedicalDevice?: string;
  reporterName: string;
  reporterDesignation: string;
  signature: boolean;
  reporterInfo: string;
  date: string;
  severityLevel: SeverityLevel;
  incidentStatus: IncidentStatus;
}

export interface IncidentManagement {
  id?: number;
  incidentId: number;
  impactOnService: string;
  contributoryFactors: string;
  actionsTakenOutcomes: string;
  recommendations: string;
  lessonsLearned: string;
  informedPatient: boolean;
  informedRelative: boolean;
  informedSeniorManager: boolean;
  informedPharmacist: boolean;
  policeIncidentNumber?: string;
  informedOther?: string;
  riskSeverity: number;
  riskLikelihood: number;
  riskRating: number;
  ohsAbsenceOver3Days: boolean;
  ohsActOfViolenceOrDanger: boolean;
  ohsHospitalizationOver24Hours: boolean;
  ohsStaffName?: string;
  ohsStaffDob?: string;
  ohsStaffAddress?: string;
  managerName: string;
  managerSignature: boolean;
  managerDesignation: string;
  managerDate: string;
}

export interface PaginationMeta {
  current_page: number;
  page_size: number;
  total_items: number;
  total_pages: number;
}

export interface IncidentResponse {
  data: IncidentReport[];
  pagination: PaginationMeta;
}

// Shared badge helpers used across components
export const getSeverityBadgeClass = (severity: SeverityLevel): string => {
  switch (severity) {
    case "critical":
      return "bg-red-50 text-red-700 border border-red-200/60";
    case "major":
      return "bg-orange-50 text-orange-700 border border-orange-200/60";
    case "minor":
      return "bg-blue-50 text-blue-700 border border-blue-200/60";
    case "near miss":
      return "bg-zinc-50 text-zinc-600 border border-zinc-200/60";
    default:
      return "bg-zinc-50 text-zinc-600";
  }
};

export const getStatusBadgeClass = (status: IncidentStatus): string => {
  switch (status) {
    case "resolved":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200/60";
    case "inprogress":
      return "bg-amber-50 text-amber-700 border border-amber-200/60";
    default:
      return "bg-rose-50 text-rose-700 border border-rose-200/60";
  }
};

export const formatStatusText = (status: IncidentStatus): string => {
  if (status === "inprogress") return "In Progress";
  if (status === "resolved") return "Resolved";
  return "Unresolved";
};
