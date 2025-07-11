import { BusinessTabItems } from '@/pages/business/business.types';
import { TabsItems } from '@/pages/classroom/class-dashboard/class-dashboard.types';
import ROUTES from '@/routes/routes';

export const pointsConstants = {
  practitionerMonthlyMax: 220,
  principalOrAdminMonthlyMax: 295,
  practitionerYearlyMax: 1200,
  principalOrAdminYearlyMax: 1200,
};

export const pointsActivitiesIds = {
  ChildRegistration: '13a6e446-d011-407a-aebb-2a398915d6ae',
  ChildRemoval: 'd38885e1-a822-4dd9-af3a-252681b27dbb',
  SubmitIncomeStatement: '8021a70d-3267-48aa-8acc-33a22736004d',
  SubmitIncomeStatementBonus: '4d49baed-8fff-49ad-883f-d60d62a58d16',
  SubmitAttendance: 'aad9c9aa-f76f-466b-bffe-fd9119efac31',
  MonthlyPreschoolFeesAdded: '1aea269b-db0b-4cc6-b052-c4eaa5d89b05',
  MonthlyPreschoolFeeUpdated: 'f7307227-2ff7-4b85-8851-27c2af79be28',
};

interface pointActivitiesDto {
  activity: string;
  missingActivityText: string;
  icon: string;
  href: string;
  tabIndex?: number;
}

export const principalActivitiesItems: pointActivitiesDto[] = [
  {
    activity: 'Attendance registers saved',
    missingActivityText: 'Save your attendance registers',
    icon: 'ClipboardListIcon',
    href: ROUTES.CLASSROOM.ROOT,
    tabIndex: TabsItems.ATTENDANCE,
  },
  {
    activity: 'Income/expenses added',
    missingActivityText: 'Add income & expenses',
    icon: 'CashIcon',
    href: ROUTES.BUSINESS,
    tabIndex: BusinessTabItems.MONEY,
  },
  {
    activity: 'Children’s progress observations complete',
    missingActivityText: 'Add child progress observations',
    icon: 'PresentationChartBarIcon',
    href: ROUTES.CLASSROOM.ROOT,
    tabIndex: TabsItems.PROGRESS,
  },
  {
    activity: 'New connections in community',
    missingActivityText: 'Connect with your community',
    icon: 'ShareIcon',
    href: ROUTES.COMMUNITY.WELCOME,
  },
  {
    activity: 'Training courses completed',
    missingActivityText: 'Complete an online training',
    icon: 'AcademicCapIcon',
    href: ROUTES.TRAINING,
  },
];

export const practitionerActivitiesItems: pointActivitiesDto[] = [
  {
    activity: 'Attendance registers saved',
    missingActivityText: 'Save your attendance registers',
    icon: 'ClipboardListIcon',
    href: ROUTES.CLASSROOM.ROOT,
    tabIndex: TabsItems.ATTENDANCE,
  },
  {
    activity: 'Children’s progress observations complete',
    missingActivityText: 'Add child progress observations',
    icon: 'PresentationChartBarIcon',
    href: ROUTES.CLASSROOM.ROOT,
    tabIndex: TabsItems.PROGRESS,
  },
  {
    activity: 'New connections in community',
    missingActivityText: 'Connect with your community',
    icon: 'ShareIcon',
    href: ROUTES.COMMUNITY.WELCOME,
  },
  {
    activity: 'Training courses completed',
    missingActivityText: 'Complete an online training',
    icon: 'AcademicCapIcon',
    href: ROUTES.TRAINING,
  },
];
