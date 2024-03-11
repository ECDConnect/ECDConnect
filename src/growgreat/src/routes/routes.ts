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
  TRAINING: '/training',
  CALENDAR: '/calendar',
  COMMUNITY: addPrefix('/community', {
    WELCOME: '/welcome',
    TEAM: addPrefix('/team', {
      INFO_PAGE: '/info-page',
      POINTS: addPrefix('/points', {
        ACTIVITY_DETAILS: '/activity-details/:activitySlug',
      }),
      MEMBERS: addPrefix('/members', {
        LEADER_PROFILE: '/leader/:leaderId',
        MEMBER_PROFILE: '/member/:memberHealthCareWorkerId',
      }),
    }),
    BREASTFEEDING_CLUBS: addPrefix('/breastfeeding-clubs', {
      ADD: '/add',
    }),
  }),
  DASHBOARD: '/dashboard',
  CLIENTS: addPrefix('/clients', {
    ROOT: '/',
    MOM_PROFILE: addPrefix('/mom-profile', {
      ROOT: '/',
      VISITS: {
        RECORD_EVENT: '/:id/record-event',
        START_VISIT: '/:id/start-visit',
        BOOK_VISIT: '/:id/book-visit',
        PAST_VISITS: '/:id/past-visits',
        ANTENATAL_VISIT: '/:id/antenatal-visit',
      },
      CONTACT_TAB: {
        UPDATE_NUMBERS: '/:id/edit-numbers',
        UPDATE_ADDRESS: '/:id/edit-address',
      },
      REFERRAL_TAB: {
        UPDATE_BACK_REFERRAL: '/:id/update-back-referral/:visitBackReferralId',
      },
      PROGRESS: {
        ACTIVITIES_FORM: '/:id/activities-form/:visitId',
      },
    }),
    INFANT_PROFILE: addPrefix('/infant-profile', {
      ROOT: '/',
      MULTIPLE_CHILDREN: '/multiple-children/:infantId',
      PROGRESS: {
        ACTIVITIES_FORM: '/:id/activities-form/:visitId',
      },
      VISITS: {
        RECORD_EVENT: '/:id/record-event',
        BOOK_VISIT: '/:id/book-visit',
        PAST_VISITS: '/:id/past-visits',
        ANTENATAL_VISIT: '/:id/antenatal-visit',
      },
      CONTACT_TAB: {
        UPDATE_NUMBERS: '/:id/edit-numbers',
        UPDATE_ADDRESS: '/:id/edit-address',
      },
      REFERRAL_TAB: {
        UPDATE_BACK_REFERRAL: '/:id/update-back-referral/:visitBackReferralId',
      },
    }),
    VISIT_TAB: {
      START_VISIT: '/start-visit',
      BOOK_VISIT: '/book-visit',
      PREGNANCY_VISITS: '/pregnancy-visits',
      CHILD_VISITS: '/child-visits',
    },
    HIGHLIGHTS_TAB: {
      UPCOMING_VISIT: '/upcoming-visit',
      POINTS_SUMMARY: '/points-summary,',
    },
  }),
  CHILD: addPrefix('/child', {
    INFORMATION: addPrefix('/information', {
      EDIT: '/edit',
    }),
  }),
  CHILD_REGISTRATION: '/child-registration',
  CHILD_REGISTRATION_BIRTH_CERTIFICATE: '/child-registration-birth-certificate',
  PRACTITIONER: addPrefix('/practitioner', {
    ABOUT: '/about',
    ACCOUNT: '/account',
    PROGRAMME_INFORMATION: '/programme-information',
    PROFILE: addPrefix('/profile', {
      PLAYGROUPS: '/playgroups',
      EDIT: '/edit',
    }),
  }),
  HEALTH_CAREWORKER_PROFILE_SETUP: '/healthcare-worker-profile-setup',
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
  MOM_REGISTER: '/mom-register',
  MOM_REGISTER_FORM: '/mom-register-form',
  INFANT_REGISTER: '/infant-register',
  INFANT_REGISTER_FORM: '/infant-register-form',
};

export default ROUTES;
