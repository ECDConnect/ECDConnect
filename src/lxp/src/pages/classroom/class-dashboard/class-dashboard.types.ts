export type ClassDashboardRouteState = {
  activeTabIndex?: number;
  programmeStartDate?: Date | undefined;
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
  PRACTITIONERS = 5,
}
