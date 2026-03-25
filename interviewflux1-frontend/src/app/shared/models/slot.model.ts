export interface Slot {
  id: number;

  // used by admin dashboard
  interviewerId?: number;
  slotTime?: string;
  company?: string;
  role?:string;

  // used by user dashboard
  title?: string;
  description?: string;
  duration?: number;
  dateTime?: string;
  bookedBy?: any;

  status: 'AVAILABLE' | 'BOOKED';

  // user booking flag
  booked?: boolean;
  createdBy?: string;
}

export interface CreateSlotRequest {
  interviewerId: number;
  dateTime: string;
  company: string;
  role: string;
}

export interface Booking {
  id: number;
  interviewerId: number;
  slotTime: string;         // this is what backend actually sends
  company: string;
  role: string;
  status: string;
  bookedBy: any;
}
