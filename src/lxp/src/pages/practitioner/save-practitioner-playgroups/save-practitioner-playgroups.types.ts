export interface EditPlaygroupsRouteState {
  returnRoute?: string;
  redirectToClassesPage?: boolean;
  selectedClassroomGroupId?: string;
  redirectToAddNewClassPage?: boolean;
}

export enum EditPlaygroupsSteps {
  confirm = 1,
  edit = 2,
}
