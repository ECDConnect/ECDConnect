export type SmartStartFieldPositions = {
  nameYRatio: number;
  idYRatio: number;
  dateYRatio: number;
  nameYOffsetMm?: number;
  idYOffsetMm?: number;
  dateYOffsetMm?: number;
};

export type SmartStartCourseConfig = {
  courseNames: string[];
  templateImage: string;
  color: string;
  fieldPositions: SmartStartFieldPositions;
};

// Calibrated from template PNG dotted-line pixel positions.
const LARGE_TEMPLATE_FIELDS: SmartStartFieldPositions = {
  nameYRatio: 0.3745,
  idYRatio: 0.4405,
  dateYRatio: 0.84,
  nameYOffsetMm: -6,
  idYOffsetMm: -3,
  dateYOffsetMm: -5,
};

const SMALL_TEMPLATE_FIELDS: SmartStartFieldPositions = {
  nameYRatio: 0.3737,
  idYRatio: 0.4407,
  dateYRatio: 0.8425,
  nameYOffsetMm: -6,
  idYOffsetMm: -3,
  dateYOffsetMm: -5,
};

export const SMART_START_COURSES: SmartStartCourseConfig[] = [];

const normaliseCourseName = (courseName: string) =>
  courseName.trim().toLowerCase();

export const getSmartStartCourseConfig = (
  courseName: string
): SmartStartCourseConfig | undefined =>
  SMART_START_COURSES.find((course) =>
    course.courseNames.some(
      (name) => normaliseCourseName(name) === normaliseCourseName(courseName)
    )
  );

export const isSmartStartCourse = (courseName: string): boolean =>
  Boolean(getSmartStartCourseConfig(courseName));

export const isSupportedCourseCertificate = (courseName: string): boolean =>
  isSmartStartCourse(courseName) ||
  ['Course name 1 Placeholder', 'Course name 2 Placeholder'].some(
    (name) => normaliseCourseName(name) === normaliseCourseName(courseName)
  );
