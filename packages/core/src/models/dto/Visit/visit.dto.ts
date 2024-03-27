export interface VisitDto {
  id: string;
  dueDate: string;
  actualVisitDate: string;
  attended: boolean;
  visitInProgress: boolean;
  plannedVisitDate: string;
  insertedDate?: string;
  comment?: string;
  orderDate: string;
  visitType?: {
    description?: string;
    id?: string;
    isActive: boolean;
    name?: string;
    normalizedName?: string;
    order: number;
    type?: string;
    updatedBy?: string;
    insertedDate?: string;
    updatedDate?: string;
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
  backReferralCompleted?: boolean;
  referralDateCompleted?: string;
  backReferralDateCompleted?: string;
  visitData?: {
    id?: string;
    visitName?: string;
    visitSection?: string;
    question?: string;
    questionAnswer?: string;
  };
}
