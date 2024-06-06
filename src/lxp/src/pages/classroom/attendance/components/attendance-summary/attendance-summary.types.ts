export interface AttendanceSummaryState {
  hidePopup?: boolean;
  openReports: () => void;
  openCompletedRegisters: () => void;
  currentUserId: string;
}
