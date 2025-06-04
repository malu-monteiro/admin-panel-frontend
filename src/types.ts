/* ---------- Appointment Types ---------- */

export type WorkingHours = {
  startTime: string;
  endTime: string;
  isDefault?: boolean;
};

export type Service = {
  id: number;
  name: string;
};

export type BlockedSlot = {
  id: number;
  startTime: string;
  endTime: string;
};

export interface Block {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots?: BlockedSlot[];
}

export type Availability = {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots: BlockedSlot[];
};

export type AppointmentData = {
  service: string;
  date: string;
  time: string;
  name: string;
  email: string;
  message?: string;
};

export type Options = {
  blockedDates: Date[];
  allowAfterHours?: boolean;
  workingHours?: Pick<WorkingHours, "startTime" | "endTime">;
};

/* ---------- Dashboard ---------- */

export interface ServiceData {
  name: string;
  value: number;
}

export interface TimeData {
  time: string;
  appointments: number;
}

export interface DashboardData {
  servicesData: ServiceData[];
  timesData: TimeData[];
  loading: boolean;
  error: string | null;
}

/* ---------- ManageDates ---------- */

export interface ManageDatesState {
  isSubmitting: boolean;
  workingHours: WorkingHours | null;
  blocks: Block[];
}

/* ---------- ActiveBlocks ---------- */

export type UnblockType = "day" | "slot";
export type BlockStatus = "All Day" | "Time Slot";

export interface BlockRowProps {
  block: Block;
  onUnblock: (type: UnblockType, id: number) => void;
  formatTimeSlot: (date: string | Date, start?: string, end?: string) => string;
}

export interface TimeSlotParams {
  date: string | Date;
  start?: string;
  end?: string;
}

/* ---------- Auth & User Types ---------- */

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

/* ---------- Email Validation Types ---------- */

export interface VerifyEmailResponse {
  message: string;
  newEmail?: string;
}

/* ---------------- Forms ---------------- */

export interface ForgotPasswordFormProps {
  onBack: () => void;
  onSubmit: (email: string) => void;
  error?: string;
  isLoading: boolean;
  isSuccess: boolean;
}

export interface LoginFormProps {
  onForgotPassword: () => void;
  onSubmit: (credentials: { email: string; password: string }) => void;
  error?: string;
  isLoading: boolean;
}

/* ---------- UI Types ---------- */

export interface NavItem {
  title: string;
  url: string;
  isActive?: boolean;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export interface NavData {
  navMain: NavGroup[];
}

export interface AppSidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  onSelectItem?: (panelName: string) => void;
  user?: User | null;
  initialAccountOpen?: boolean;
  onAccountOpenChange?: (open: boolean) => void;
  onUserUpdate: (newData: Partial<User>) => void;
}

export type AccountModalProps = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (newData: Partial<User>) => void;
};

export type NavUserProps = {
  user: User;
  onUserUpdate: (newData: Partial<User>) => void;
  initialAccountOpen?: boolean;
  onAccountOpenChange?: (open: boolean) => void;
};

/* ---------- API & Response Types ---------- */

export interface ApiResponse<T = unknown> {
  data: T;
  error?: string;
  message?: string;
}

export interface UpdateResponse extends ApiResponse {
  requiresVerification?: boolean;
  email?: string;
}

export type LoginSuccessData = {
  token: string;
  name?: string;
  email: string;
};

export type ErrorResponse = {
  error?: string;
  message?: string;
};

export type ServicesResponse = ApiResponse<Service[]>;
export type SingleServiceResponse = ApiResponse<Service>;
