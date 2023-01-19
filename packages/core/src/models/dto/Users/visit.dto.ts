export interface VisitDto {
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
