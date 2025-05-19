/* Appointment Types */

import axios from "axios";

export type WorkingHours = {
  startTime: string;
  endTime: string;
  isDefault?: boolean;
};

export type Service = {
  id: number;
  name: string;
};

export type ServicesResponse = ApiResponse<Service[]>;
export type SingleServiceResponse = ApiResponse<Service>;

export type BlockedSlot = {
  id: number;
  startTime: string;
  endTime: string;
};

export type Availability = {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots: BlockedSlot[];
};

export type Options = {
  blockedDates: Date[];
  allowAfterHours?: boolean;
  workingHours?: {
    startTime: string;
    endTime: string;
  };
};

export type Block = {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots: BlockedSlot[] | null;
};

export type AppointmentData = {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  message?: string;
};

/* Auth Types */

export type User = {
  name: string;
  email: string;
};

export type FormData = {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
};

export type AccountModalProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (newData: Partial<User>) => void;
};

export type AuthContextType = {
  user: User | null;
  login: (token: string, userData: User) => void;
  logout: () => void;
  updateUser: (newData: Partial<User>) => void;
  isLoading: boolean;
};

export type UseAuthOptions = {
  redirectToIfAuthenticated?: string;
  redirectToIfNotAuthenticated?: string;
};

/* AppSidebar Types */

export type AppSidebarProps = {
  onSelectItem?: (panelName: string) => void;
  user?: User | null;
  initialAccountOpen?: boolean;
  onAccountOpenChange?: (open: boolean) => void;
  onUserUpdate: (newData: Partial<User>) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export type NavUserProps = {
  user: User;
  initialAccountOpen?: boolean;
  onAccountOpenChange?: (open: boolean) => void;
  onUserUpdate: (newData: Partial<User>) => void;
};

/* Email Validation Types */

export type VerifyEmailResponse = {
  message: string;
  newEmail?: string;
};

/* Error Types */

export type ErrorResponse = {
  error?: string;
  message?: string;
};

export interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
  message?: string;
}

export interface UpdateResponse extends ApiResponse {
  requiresVerification?: boolean;
  email?: string;
}

export interface PasswordUpdateResponse extends ApiResponse {}

// Modificar as chamadas:
const response = await axios.patch<UpdateResponse>("/auth/update");

// No password:
await axios.patch<PasswordUpdateResponse>("/auth/update-password");
