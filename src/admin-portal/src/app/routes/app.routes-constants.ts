import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  FORGOT_PASSWORD: '/forgot-password',
  ROOT_TEAM_LEAD: '/team-lead',
  TEAM_LEAD_REGISTER: '/team-lead-register/:resetToken',
  TEAM_LEAD_RESET_PASSWORD: '/team-lead-forgot-password',
  VERIFY_PHONE_NUMBER: '/verify-cellphone-number',
  TEAM_MEETINGS: '/team-meetings',
  TL_MEETINGS: addPrefix('/tl-meetings', {
    MEETINGS: 'meetings',
    REPORTS: addPrefix('/reports', {
      SEE_REPORTS: '/see-reports',
      VIEW_REPORT: '/view-report',
    }),
    EDIT_TOPICS: '/edit-topics',
  }),
  NOTIFICATIONS_VIEW: '/notifications-view',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UPLOAD_USERS: '/upload-users',
  DOCUMENTS: '/documents',
  VIEW_USERS: '/users/view-user',
  PROFILE: '/profile',
  RESET: '/reset',
  TEAM_LEAD_LEAGUES: '/tl-leagues',
  CLINICS: addPrefix('/clinics', {
    ALL_CLINICS: '/clinics',
    VIEW_CLINICS: '/view-clinics',
    LEAGUES: addPrefix('/leagues', {
      LEAGUE_MANAGEMENT: addPrefix('/league-management ', {
        ADD_LEAGUES: '/add-leagues',
        // LEAGUE_DETAILS: '/league-details/:leagueId',
      }),
      VIEW_LEAGUE_SEASON: addPrefix('/view-season', {
        ADD_LEAGUES: '/add-leagues',
        LEAGUE_DETAILS: '/league-details/:leagueId',
      }),
    }),
    DISTRICTS: '/districts',
    SUB_DISTRICTS: '/sub-districts',
  }),
  REFERRALS: addPrefix('/referrals', {
    VIEW_REFERRAL_DETAIL: addPrefix('/view-referral-detail/:referralType', {
      EDIT_BACK_REFERRAL: '/edit-back-referral/:visitDataStatusId',
    }),
  }),
  USERS: addPrefix('/users', {
    HEALTH_CARE_WORKERS: '/health-care-worker',
    TEAM_LEADS: '/team-leads',
    ADMINS: '/admins',
    ALL_ROLES: '/all-roles',
  }),
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
  HEALTH_CARE_WORKER: addPrefix('/health-care-worker', {
    OPTED_OUT: '/opted-out',
  }),
};

export default ROUTES;
