import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UPLOAD_USERS: '/upload-users',
  VIEW_USERS: '/users/view-user',
  CLINICS: addPrefix('/clinics', {
    ALL_CLINICS: '/clinics',
    VIEW_CLINICS: '/view-clinics',
  }),
  REFERRALS: addPrefix('/referrals', {
    VIEW_REFERRAL_DETAIL: addPrefix('/view-referral-detail/:referralType', {
      EDIT_BACK_REFERRAL: '/edit-back-referral/:client',
    }),
  }),
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
};

export default ROUTES;
