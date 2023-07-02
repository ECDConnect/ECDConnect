export interface CalendarSearchParticipantProps {
  currentParticipantUserIds: string[];
  onBack: () => void;
  onDone: (participantUserIds: string[]) => void;
}
