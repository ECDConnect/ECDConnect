export type ClassDashboardRouteState = {
  activeTabIndex?: number;
  programmeStartDate?: Date | undefined;
};

export const enum TabsItemsWithAttendance {
  ATTENDANCE = 0,
  CHILDREN = 1,
  PROGRAMME = 2,
  RESOURCES = 3,
}

export const enum TabsItems {
  CHILDREN = 0,
  PROGRAMME = 1,
  RESOURCES = 2,
}

export const enum TabsItemForPrincipal {
  ATTENDANCE = 0,
  PRACTITIONERS = 1,
  CHILDREN = 2,
  PROGRAMME = 3,
  RESOURCES = 4,
}
