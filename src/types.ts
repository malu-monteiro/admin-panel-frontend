// src/types.ts
export interface BlockedSlot {
  id: number;
  startTime: string;
  endTime: string;
}
export interface Block {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots: BlockedSlot[] | null;
}

export interface Availability {
  id: number;
  date: string;
  isBlocked: boolean;
  blockedSlots: BlockedSlot[] | null;
}

export interface AppointmentData {
  service: string;
  date: string;
  time: string;
  name: string;
  phone: string;
  message?: string;
}
