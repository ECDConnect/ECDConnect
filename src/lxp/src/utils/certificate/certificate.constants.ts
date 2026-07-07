import { isSmartStartCourse } from './smartstart-templates';

export {
  getSmartStartCourseConfig,
  isSmartStartCourse,
  type SmartStartCourseConfig,
  type SmartStartFieldPositions,
} from './smartstart-templates';

export const ECD_CONNECT_COURSES = [
  'Course 08 | Caregiver And Community Engagement',
  'Course 9 | ECD Connect App Tutorial for Principals',
] as const;

export type EcdConnectCourseName = (typeof ECD_CONNECT_COURSES)[number];

export const TIMELINE_COURSE_COMPLETED_PREFIX = 'Course completed: ';

export const parseCourseNameFromTimelineItem = (timelineItemName?: string) =>
  timelineItemName?.replace(TIMELINE_COURSE_COMPLETED_PREFIX, '').trim() || '';

export const isEcdConnectCourse = (courseName: string): boolean =>
  ECD_CONNECT_COURSES.some(
    (name) => name.toLowerCase() === courseName.trim().toLowerCase()
  );

export const isSupportedCourseCertificate = (courseName: string): boolean =>
  isEcdConnectCourse(courseName) || isSmartStartCourse(courseName);
