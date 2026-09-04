export type UserRole = 'HEALTH_WORKER' | 'SPECIALIST' | 'ADMIN';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  centreName: string;
  district: string;
  phone: string;
}

export type DiabetesStatus = 'KNOWN_DIABETES' | 'RECENTLY_DIAGNOSED' | 'SUSPECTED' | 'NO_DIABETES';

export interface PatientRecord {
  id: string; // e.g. DR-2026-01842
  name: string;
  age: number;
  dob?: string;
  sex: 'Female' | 'Male' | 'Other';
  village: string;
  phone?: string;
  diabetesStatus: DiabetesStatus;
  createdAt: string;
  lastScreeningDate?: string;
  lastResult?: ScreeningResultCategory;
}

export type ScreeningWorkflowState =
  | 'DRAFT'
  | 'CAPTURED'
  | 'QUALITY_CHECK'
  | 'RETAKE_REQUIRED'
  | 'QUALITY_PASSED'
  | 'IMAGE_OPTIMIZED'
  | 'PENDING_UPLOAD'
  | 'SAVED_LOCALLY'
  | 'WAITING_FOR_SYNC'
  | 'SYNCING'
  | 'UPLOADING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'REFERRED'
  | 'SPECIALIST_REVIEWED';

export type ScreeningResultCategory = 'ROUTINE' | 'REVIEW' | 'PRIORITY' | 'RETAKE';

export type QualityStatus = 'PASS' | 'FAIL';

export interface ScreeningRecord {
  id: string; // e.g. SCR-2026-04921
  patientId: string;
  eye: 'RIGHT' | 'LEFT';
  imageUri: string; // Blob URL or path to demo fundus asset
  imageKey?: string; // identifier for demo fundus asset or upload
  qualityStatus: QualityStatus;
  qualityReason?: string;
  qualityTip?: string;
  workflowState: ScreeningWorkflowState;
  resultCategory: ScreeningResultCategory;
  resultRecommendation: string;
  createdAt: string;
  synced: boolean;
  centreName: string;
  healthWorkerName: string;
  isDemoSample?: boolean;
  // AI decision support details (visible to specialist only)
  aiDetails?: {
    modelVersion: string;
    decisionSupportText: string;
    confidenceIndicator: 'High' | 'Moderate' | 'Borderline';
    findings: string[];
    explainabilityBox?: { x: number; y: number; width: number; height: number };
    timestamp: string;
  };
}

export type SyncStatus = 'LOCAL_ONLY' | 'QUEUED' | 'UPLOADING' | 'PROCESSING' | 'SYNCED' | 'FAILED';

export interface PendingUploadRecord {
  id: string; // Queue item id
  screeningId: string;
  patientId: string;
  patientName: string;
  eye: 'RIGHT' | 'LEFT';
  imageUri: string;
  capturedAt: string;
  syncStatus: SyncStatus;
  retryCount: number;
  lastAttemptAt?: string;
  lastError?: string;
}

export interface ReferralRecord {
  id: string; // REF-2026-00142
  screeningId: string;
  patientId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  village: string;
  priority: 'ROUTINE' | 'REVIEW' | 'PRIORITY';
  eye: 'RIGHT' | 'LEFT';
  imageUri: string;
  specialistCentre: string;
  referralReason: string;
  healthWorkerNotes?: string;
  status: 'WAITING_FOR_SPECIALIST' | 'UNDER_REVIEW' | 'REVIEW_COMPLETED';
  createdAt: string;
  specialistNotes?: string;
  specialistDecision?: 'CONFIRMED' | 'RETAKE_REQUESTED' | 'FOLLOWUP_PRESCRIBED';
  reviewedAt?: string;
  reviewedBy?: string;
}

export type ConnectivityOverride = 'AUTO' | 'FORCE_ONLINE' | 'FORCE_OFFLINE' | 'FORCE_SYNCING';
