import addPrefix from './withParentPrefix';

const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  LOGOUT: '/logout',
  UPLOAD_USERS: '/upload-users',
  VIEW_USERS: '/users/view-user',
  CLASSROOM: addPrefix('/classroom', {
    UPDATE_FEE: '/preschool-fee',
  }),
};

export default ROUTES;
