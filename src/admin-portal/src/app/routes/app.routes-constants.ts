import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  FORGOT_PASSWORD: '/forgot-password',
  ROOT_TEAM_LEAD: '/team-lead',
  TEAM_LEAD_REGISTER: '/team-lead-register/:resetToken',
  TEAM_LEAD_RESET_PASSWORD: '/team-lead-forgot-password',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UPLOAD_USERS: '/upload-users',
  DOCUMENTS: '/documents',
  VIEW_USERS: '/users/view-user',
  CLINICS: addPrefix('/clinics', {
    ALL_CLINICS: '/clinics',
    VIEW_CLINICS: '/view-clinics',
  }),
  REFERRALS: addPrefix('/referrals', {
    VIEW_REFERRAL_DETAIL: addPrefix('/view-referral-detail/:referralType', {
      EDIT_BACK_REFERRAL: '/edit-back-referral/:visitBackReferralId',
    }),
  }),
  USERS: addPrefix('/users', {
    HEALTH_CARE_WORKERS: '/health-care-worker',
  }),
  HEALTH_CARE_WORKERS: '/health-care-workers',
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
};

export default ROUTES;
