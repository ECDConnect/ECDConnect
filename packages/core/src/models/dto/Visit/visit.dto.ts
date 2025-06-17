export interface VisitDto {
  id: string;
  dueDate: string;
  actualVisitDate: string;
  attended: boolean;
  isCancelled: boolean;
  startedDate: string;
  plannedVisitDate: string;
  comment?: string;
  orderDate: string;
  visitType?: {
    description?: string;
    id?: string;
    name?: string;
    normalizedName?: string;
    order: number;
  };
  eventId?: string;
}

export interface VisitStatusDto {
  motherVisitsCompletedThisMonth: number;
  childVisitsCompletedThisMonth: number;
  motherVisitsCompletedThisYear: number;
  childVisitsCompletedThisYear: number;
  childDueVisits: number;
  motherDueVisits: number;
  motherOverDueVisits: number;
  lastCompletedVisit?: string;
}

export interface VisitDataStatusDto {
  id: string;
  comment: string;
  color: string;
  type: string;
  section: string;
  isCompleted?: boolean;
  visitData?: {
    id?: string;
    visitName?: string;
    visitSection?: string;
    question?: string;
    questionAnswer?: string;
  };
}
