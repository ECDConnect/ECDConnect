export type ClassDashboardRouteState = {
  activeTabIndex?: number;
  programmeStartDate?: Date | undefined;
  fromChildAttendanceReport?: boolean;
  classroomGroupIdFromClassTab?: string;
  messageReference?: string;
};

export const enum TabsItems {
  CLASSES = 0,
  ATTENDANCE = 1,
  PROGRESS = 2,
  ACTIVITES = 3,
  RESOURCES = 4,
}

export const enum TabsItemForPrincipal {
  CLASSES = 0,
  ATTENDANCE = 1,
  PROGRESS = 2,
  ACTIVITES = 3,
  RESOURCES = 4,
  //PRACTITIONERS = 5, this moved to business and staff
}
