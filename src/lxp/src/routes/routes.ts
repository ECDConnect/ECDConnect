import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  PASSWORD_RESET: '/password-reset',
  NEW_PASSWORD: '/new-password',
  SIGN_UP: '/sign-up',
  VERIFY_PHONE: '/verify-phone',
  CHILD_REGISTRATION_LANDING: '/child-registration-landing',
  PROGRAMMES: addPrefix('/programmes', {
    THEME: '/theme',
    TIMING: '/timing',
    SUMMARY: '/summary',
    ROUTINE: '/routine',
    TUTORIAL: addPrefix('/tutorial', {
      GETTING_STARTED: '/getting-started',
      DAILY_ROUTINE: '/daily-routine',
      DEVELOPING_CHILDREN: '/developing-children',
    }),
  }),
  DASHBOARD: '/dashboard',
  CLASSROOM: '/classroom',
  TRAINING: '/training',
  CHILD: addPrefix('/child', {
    INFORMATION: addPrefix('/information', {
      EDIT: '/edit',
    }),
  }),
  CHILD_REGISTRATION: '/child-registration',
  CHILD_REGISTRATION_BIRTH_CERTIFICATE: '/child-registration-birth-certificate',
  PRINCIPAL: addPrefix('/principal', {
    SETUP_PROFILE: '/setup-profile',
    PRACTITIONER_PROFILE: '/practitioner-profile',
    PRACTITIONER_LIST: '/practitioner-list',
    PRACTITIONER_CHILD_LIST: '/practitioner-child-list',
    NOTES: '/notes',
  }),
  PRACTITIONER: addPrefix('/practitioner', {
    ABOUT: '/about',
    ACCOUNT: '/account',
    PROGRAMME_INFORMATION: '/programme-information',
    PROFILE: addPrefix('/profile', {
      PLAYGROUPS: '/playgroups',
      EDIT: '/edit',
    }),
  }),
  CHILD_NOTES: '/child-notes',
  CHILD_PROFILE: '/child-profile',
  CHILD_CAREGIVERS: '/child-caregivers',
  CHILD_ATTENDANCE_CAREGIVER: '/child-attendance-caregiver',
  CHILD_ATTENDANCE_REPORT: '/child-attendance-report',
  CHILD_PROGRESS_ASSESSMENT: '/child-progress-assessment',
  REMOVE_CHILD: '/remove-child',
  MESSAGES: '/messages',
  PROGRESS_TRACKING_CATEGORY: '/progress-tracking-category',
  CHILD_PROGRESS_OBSERVATION: '/child-progress-observation',
  CHILD_PROGRESS_OBSERVATION_NOTE: '/child-progress-observation-note',
  CHILD_PROGRESS_OBSERVATION_REPORT: '/child-progress-observation-report',
  COMPLETED_CHILD_PROGRESS_OBSERVATION_REPORTS:
    '/completed-child-progress-observation-reports',
  VIEW_CHILD_PROGRESS_OBSERVATION_REPORT:
    '/view-child-progress-observation-report',
  DOWNLOAD_CHILD_PROGRESS_OBSERVATION_REPORTS:
    '/download-child-progress-observation-reports',
  COACH_REGISTRATION: '/coach-registration',
  COACH: addPrefix('/coach', {
    ABOUT: addPrefix('/about', {
      SIGNATURE: '/signature',
      ADDRESS: '/address',
    }),
    PRACTITIONERS: '/practitioners',
    PRACTITIONER_PROFILE_INFO: '/practitioner-profile-info',
    PRACTITIONER_CLASSROOM: '/practitioner-classroom',
    PRACTITIONER_CHILD_LIST: '/practitioner-childlist',
    PROGRAMME_INFORMATION: '/programme-information',
    CLASSES_REASSIGNED: '/classes-reassigned',
    CHILD_PROFILE: '/child-profile',
    NOTES: '/notes',
    ACCOUNT: '/account',
    PROFILE: addPrefix('/profile', {
      EDIT: '/edit',
    }),
  }),
};

export default ROUTES;
