import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  SETUP_ORG: '/setup-org',
  SETUP_ORG_FORM: '/setup-org-form',
  FORGOT_PASSWORD: '/forgot-password',
  VERIFY_PHONE_NUMBER: '/verify-cellphone-number',
  NOTIFICATIONS_VIEW: '/notifications-view',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UPLOAD_USERS: '/upload-users',
  DOCUMENTS: '/documents',
  PROFILE: '/profile',
  RESET: '/reset',
  CONTENT_MANAGEMENT: 'content-management',
  USERS: addPrefix('/users', {
    ADMINS: '/admins',
    ALL_ROLES: '/all-roles',
    PRACTITIONERS: '/practitioners',
    COACHES: '/coaches',
    CHILDREN: '/children',
    VIEW_USER: '/view-user',
  }),
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
};

export default ROUTES;
