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
  ATTENDANCE_TUTORIAL_WALKTHROUGH: '/attendance-tutorial-walkthrough',
  DASHBOARD: '/dashboard',
  BUSINESS: '/business',
  BUSINESS_ADD_AMOUNT: '/business-add-amount',
  BUSINESS_ADD_INCOME: '/business-add-income',
  BUSINESS_ADD_EXPENSE: '/business-add-expense',
  BUSINESS_SUBMIT_INCOME_STATEMENTS_LIST:
    '/business-submit-income-statements-list',
  BUSINESS_PREVIOUS_STATEMENTS_LIST: '/business-previous-statements-list',
  BUSINESS_MONTH_STATEMENTS_DETAILS: '/month-statements-details',
  BUSINESS_CURRENT_MONTH_STATEMENTS_DETAILS: '/current-month-statement-details',
  CALENDAR: '/calendar',
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
  TRAINING: '/training',
  COMMUNITY: addPrefix('/community', {
    WELCOME: '/welcome',
    CLUB: addPrefix('/club/:clubId', {
      ADD: '/add',
      EDIT: '/edit',
      MEMBER: addPrefix('/member/:practitionerId', {
        ADD: '/add',
      }),
      MEMBERS: addPrefix('/members', {
        ADD: '/add',
        EDIT: '/edit',
      }),
      LEADER: addPrefix('/leader', {
        ADD: '/add',
        EDIT: '/edit',
      }),
      USER_PROFILE: addPrefix('/user-profile', {
        COACH: '/coach/:coachId',
        LEADER: '/leader/:leaderId',
        MEMBER: '/member/:practitionerId',
      }),
      POINTS: addPrefix('/points', {
        MEET_REGULARLY: addPrefix('/meet-regularly', {
          MEETING_DETAILS: '/:meetingId/meeting-details',
        }),
        BE_CREATIVE: '/be-creative',
        HOST_FAMILY_EVENT: '/host-family-event',
        LEAVE_NO_ONE_BEHIND: '/leave-no-one-behind',
        CAPTURE_CHILD_ATTENDANCE: '/capture-child-attendance',
        COMPLETE_CHILD_PROGRESS_REPORTS: '/complete-child-progress-reports',
        HELP: '/help/:activityId',
      }),
    }),
    LEAGUE: addPrefix('/league/:leagueId', {
      HELP: '/help/:activityId',
    }),
  }),
  CHILD: addPrefix('/child', {
    INFORMATION: addPrefix('/information', {
      EDIT: '/edit',
    }),
  }),
  CHILD_REGISTRATION: '/child-registration',
  CHILD_REGISTRATION_BIRTH_CERTIFICATE: '/child-registration-birth-certificate',
  PRINCIPAL: addPrefix('/principal', {
    ADD_PRACTITIONER: '/add-practitioner',
    CONFIRM_PRACTITIONER: 'confirm-practitioner',
    SETUP_PROFILE: '/setup-profile',
    PRACTITIONER_PROFILE: '/practitioner-profile',
    PRACTITIONER_LIST: '/practitioner-list',
    PRACTITIONER_CHILD_LIST: '/practitioner-child-list',
    PRACTITIONER_REASSIGN_CLASS: '/practitioner-reassign-class',
    PRACTITIONER_REMOVE_FROM_PROGRAMME: '/remove-practitioner-from-programme',
    SWAP_PRINCIPAL: '/swap-principal',
    NOTES: '/notes',
  }),
  PRACTITIONER: addPrefix('/practitioner', {
    ABOUT: addPrefix('/about', {
      SIGNATURE: '/signature',
    }),
    ACCOUNT: '/account',
    PROGRAMME_INFORMATION: '/programme-information',
    PROFILE: addPrefix('/profile', {
      PLAYGROUPS: '/playgroups',
      EDIT: '/edit',
    }),
    POINTS: addPrefix('/points', {
      SUMMARY: '/summary',
      YEAR: '/year',
    }),
    CONTACT_COACH: '/contact-coach',
    COMMUNITY: addPrefix('/community', {
      ACCEPT_CLUB_LEADER_ROLE: '/accept-club-leader-role',
      CLUB: addPrefix('/club', {
        SUPPORT_ROLE: addPrefix('/support-role', {
          EDIT: '/edit',
        }),
        MEETING: addPrefix('/meeting', {
          ADD_MEETING: '/add',
        }),
        FAMILY_DAY_EVENT: addPrefix('/family-day-event', {
          ADD_EVENT: '/add',
        }),
        COLLAGE_EVENT: addPrefix('/collage-event', {
          ADD_EVENT: '/add',
        }),
      }),
    }),
  }),
  TRAINEE: addPrefix('/trainee', {
    SETUP_TRAINEE: '/setup-trainee',
    TRAINEE_ONBOARDING: '/trainee-onboarding',
    TRAINEE_ONBOARDING_DASHBOARD: 'trainee-onboarding-dashboard',
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
  COACH_SMARTSPACE_CHECK: '/coach-smart-space-check',
  COACH_TRAINEE_ONBOARDING: '/coach-trainee-onboarding',
  COACH_FRANCHISE_AGREEMENT: '/coach-franchisor-agreement',
  COACH_SELF_ASSESSMENT: '/coach-self-assessment',
  COACH: addPrefix('/coach', {
    ABOUT: addPrefix('/about', {
      SIGNATURE: '/signature',
      ADDRESS: '/address',
    }),
    PRACTITIONERS: '/practitioners',
    PRACTITIONER_PROFILE_INFO: '/practitioner-profile-info',
    PRACTITIONER_JOURNEY: '/practitioner-journey/:practitionerId',
    PRACTITIONER_BUSINESS: addPrefix('/practitioner-business', {
      BUSINESS: '/:userId',
      LIST_STATEMENTS: '/:userId/previous-statements-list',
      STATEMENT_DETAILS: '/:userId/statement-details',
      CURRENT_MONTH_SUMMARY: '/:userId/current-month-summary',
    }),
    PRACTITIONER_CLASSROOM: '/practitioner-classroom',
    PRACTITIONER_CHILD_LIST: '/practitioner-childlist',
    PRACTIONER_REMOVE: '/practioner-remove',
    PROGRAMME_INFORMATION: '/programme-information',
    CLASSES_REASSIGNED: '/classes-reassigned',
    CHILD_PROFILE: '/child-profile',
    CONTACT_PRACTITIONER: '/contact-practitioner',
    NOTES: '/notes',
    ACCOUNT: '/account',
    PROFILE: addPrefix('/profile', {
      EDIT: '/edit',
    }),
  }),
  SMART_STARTER_JOURNEY: addPrefix('/smart-starter-journey/:clientId', {}),
};

export default ROUTES;
