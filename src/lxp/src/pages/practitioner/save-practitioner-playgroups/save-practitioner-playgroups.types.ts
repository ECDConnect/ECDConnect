export interface EditPlaygroupsRouteState {
  returnRoute?: string;
  redirectToClassesPage?: boolean;
  selectedClassroomGroupId?: string;
}

export enum EditPlaygroupsSteps {
  confirm = 1,
  edit = 2,
}
