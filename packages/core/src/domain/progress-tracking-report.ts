import { ChildProgressObservationStatus } from '../enums/child-progress-observation-status';

export interface ChildProgressObservationReport {
  id: string;
  dateCompleted?: string;
  dateCreated: string;
  reportingDate: string;
  reportingPeriod: string;
  observationNote?: string;
  childEnjoys?: string;
  childProgressedWith?: string;
  howCanCaregiverHelpChild?: string;
  achievedLevelId?: number;
  categories: ChildProgressObservationCategory[];
  childId: string;
  childFirstname: string;
  childSurname: string;
  practitionerFirstname: string;
  practitionerSurname: string;
  practitionerPhotoUrl?: string;
  classroomName: string;
}

export interface ProgressObservationCategorySupportingTask {
  taskId: number;
  todoText: string;
  taskDescription: string;
}

export interface ChildProgressObservationCategory {
  categoryId: number;
  achievedLevelId: number;
  status: ChildProgressObservationStatus;
  supportingTask?: ProgressObservationCategorySupportingTask;
  tasks: CategoryTask[];
  missingTasks: CategoryTask[];
}

export interface CategoryTask {
  levelId: number;
  skillId: number;
  description: string;
  value: string;
}

export interface ObservationCategoryTaskSummary {
  levelId: number;
  skillId: number;
  value: string;
}

export interface ObservationCategorySummary {
  achievedLevelId: number;
  categoryId: number;
  tasks: ObservationCategoryTaskSummary[];
}

export interface ChildProgressReportSummaryModel {
  reportId: string;
  categories: ObservationCategorySummary[];
  childFirstName: string;
  childId: string;
  childSurname: string;
  classroomName: string;
  reportDate: string;
  reportPeriod: string;
  reportDateCreated: string;
  reportDateCompleted: string;
}
