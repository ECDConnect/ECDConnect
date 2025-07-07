export interface SettingTypeDto {
  Children: Setting_ChildrenDto;
  Reporting: Setting_ReportDto;
  Google: Setting_GoogleDto;
}

export interface Setting_ReportDto {
  ChildProgressReportMonths: string;
}

export interface Setting_ChildrenDto {
  ChildExpiryTime: string;
  ChildInitialObservationPeriod: string;
}

export interface Setting_GoogleDto {}
