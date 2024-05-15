export type ClassDashboardRouteState = {
  activeTabIndex?: number;
  programmeStartDate?: Date | undefined;
};

export const enum TabsItems {
  ATTENDANCE = 0,
  CLASSES = 1,
  PROGRAMME = 2,
  RESOURCES = 3,
}

export const enum TabsItemForPrincipal {
  ATTENDANCE = 0,
  PRACTITIONERS = 1,
  CLASSES = 2,
  PROGRAMME = 3,
  RESOURCES = 4,
}
