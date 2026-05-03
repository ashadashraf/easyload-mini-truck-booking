import { BookingStatus } from "./types";

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: "Pending",
  contacted: "Contacted",
  booked: "Booked",
  completed: "Completed",
  rejected: "Rejected"
};

const NEXT_STATUSES: Record<BookingStatus, BookingStatus[]> = {
  pending: ["contacted", "rejected"],
  contacted: ["booked", "pending", "rejected"],
  booked: ["completed", "contacted", "rejected"],
  completed: ["booked", "contacted"],
  rejected: ["pending", "contacted"]
};

export function getStatusOptions(currentStatus: BookingStatus) {
  return NEXT_STATUSES[currentStatus];
}

export function isConfirmedStatusCorrection(currentStatus: BookingStatus, nextStatus: BookingStatus) {
  return currentStatus === "completed" && nextStatus !== "completed";
}

const STATUS_PROGRESS: Record<BookingStatus, number> = {
  pending: 1,
  contacted: 2,
  booked: 3,
  completed: 4,
  rejected: 5
};

export function isBackwardStatusChange(currentStatus: BookingStatus, nextStatus: BookingStatus) {
  return STATUS_PROGRESS[nextStatus] < STATUS_PROGRESS[currentStatus];
}
