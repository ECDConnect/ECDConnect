import template01 from '@/assets/certificates/smartstart/01_Introduction.png';
import template02 from '@/assets/certificates/smartstart/02_The_learning_child.png';
import template03 from '@/assets/certificates/smartstart/03_Developing_skills_for_life.png';
import template04 from '@/assets/certificates/smartstart/04_Safe_and_Stimulating_Spaces.png';
import template05 from '@/assets/certificates/smartstart/05_Protecting_and_Managing_Children.png';
import template06 from '@/assets/certificates/smartstart/06_Learning_at_Home.png';
import template07 from '@/assets/certificates/smartstart/07_Make_Your_Own_Play-kit.png';
import templateEarlyLearningProgramme from '@/assets/certificates/smartstart/Early Learning Programme.png';

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

export const SMART_START_COURSES: SmartStartCourseConfig[] = [
  {
    courseNames: ['Course 01 | Introduction'],
    templateImage: template01,
    color: '#cd393a',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
  {
    courseNames: ['Course 02 | The Learning Child'],
    templateImage: template02,
    color: '#00b1e4',
    fieldPositions: SMALL_TEMPLATE_FIELDS,
  },
  {
    courseNames: ['Course 03 | Developing Skills for Life'],
    templateImage: template03,
    color: '#cd393a',
    fieldPositions: SMALL_TEMPLATE_FIELDS,
  },
  {
    courseNames: [
      'Course 04 | Safe & Stimulating Spaces',
      'Course 04 | Safe and Stimulating Spaces',
    ],
    templateImage: template04,
    color: '#16b249',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
  {
    courseNames: [
      'Course 05 | Protecting & Managing Children',
      'Course 05 | Protecting and Managing Children',
    ],
    templateImage: template05,
    color: '#16b249',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
  {
    courseNames: ['Course 06 | Learning at Home'],
    templateImage: template06,
    color: '#16b249',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
  {
    courseNames: [
      'Course 07 | Make your own Play-Kit',
      'Course 07 | Make Your Own Play-Kit',
    ],
    templateImage: template07,
    color: '#ff7022',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
  {
    courseNames: [
      'Your Early Learning Programme (for Assistants)',
      'Early Learning Programme (for Assistants)',
    ],
    templateImage: templateEarlyLearningProgramme,
    color: '#16b249',
    fieldPositions: LARGE_TEMPLATE_FIELDS,
  },
];

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
  [
    'Course 08 | Caregiver And Community Engagement',
    'Course 9 | ECD Connect App Tutorial for Principals',
  ].some(
    (name) => normaliseCourseName(name) === normaliseCourseName(courseName)
  );
