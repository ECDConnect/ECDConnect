export interface VisitDto {
  id: string;
  actualVisitDate: string;
  attended: boolean;
  plannedVisitDate: string;
  visitType?: {
    description?: string;
    id?: string;
    isActive: boolean;
    name?: string;
    normalizedName?: string;
    order: number;
    type?: string;
    updatedBy?: string;
  };
}

export interface VisitStatusDto {
  childDueVisits?: number;
  motherDueVisits?: number;
  motherOverDueVisits?: number;
}
