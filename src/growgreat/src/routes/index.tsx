import { Redirect, Route, Switch } from 'react-router-dom';
import { Login } from '@auth-p/login/login';
import { NewPassword } from '@auth-p/new-password/new-password';
import PasswordReset from '@auth-p/password-reset/password-reset';
import { SignUp } from '@auth-p/sign-up/sign-up';
import { VerifyPhoneNumber } from '@auth-p/verify-phonenumber/verify-phone-number';
import Dashboard from '@dashboard-p/dashboard';
import { Messages } from '@messages-p/messages';
import { PregnantRegister } from '@/pages/mom/pregnant-register/pregnant-register';
import { PregnantRegisterForm } from '@/pages/mom/pregnant-register-form/pregnant-register-form';
import { InfantRegister } from '@/pages/infant/infant-register/infant-register';
import { InfantRegisterForm } from '@/pages/infant/infant-register-form/infant-register-form';
import { PractitionerAbout } from '@practitioner-p/practitioner-about/practitioner-about';
import PractitionerAccount from '@practitioner-p/practitioner-account/practitioner-account';
import { PractitionerProfile } from '@practitioner-p/practitioner-profile/practitioner-profile';
import ROUTES from './routes';
import ClassDashboard from '@/pages/classroom/class-dashboard/class-dashboard';

const PublicRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path={ROUTES.ROOT} render={() => <Redirect to="/login" />} />
      <Route path={ROUTES.LOGIN} component={Login} exact={true} />
      <Route
        path={ROUTES.PASSWORD_RESET}
        component={PasswordReset}
        exact={true}
      />
      <Route path={ROUTES.NEW_PASSWORD} component={NewPassword} exact={true} />
      <Route path={ROUTES.SIGN_UP} component={SignUp} exact={true} />
      <Route
        path={ROUTES.VERIFY_PHONE}
        component={VerifyPhoneNumber}
        exact={true}
      />
    </Switch>
  );
};

const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      <Route
        path={ROUTES.PASSWORD_RESET}
        component={PasswordReset}
        exact={true}
      />
      <Route path={ROUTES.NEW_PASSWORD} component={NewPassword} exact={true} />
      <Route path={ROUTES.SIGN_UP} component={SignUp} exact={true} />
      <Route
        path={ROUTES.VERIFY_PHONE}
        component={VerifyPhoneNumber}
        exact={true}
      />

      <Route path={ROUTES.ROOT} component={Dashboard} exact={true} />
      <Route path={ROUTES.DASHBOARD} component={Dashboard} exact={true} />
      <Route
        exact
        path={ROUTES.PRACTITIONER.ABOUT}
        component={PractitionerAbout}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.ACCOUNT}
        component={PractitionerAccount}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.PROFILE.ROOT}
        component={PractitionerProfile}
      />

      <Route path={ROUTES.CLASSROOM} component={ClassDashboard} />

      <Route path={ROUTES.MESSAGES} component={Messages} />

      <Route path={ROUTES.MOM_REGISTER} component={PregnantRegister} />
      <Route path={ROUTES.MOM_REGISTER_FORM} component={PregnantRegisterForm} />
      <Route path={ROUTES.INFANT_REGISTER} component={InfantRegister} />
      <Route
        path={ROUTES.INFANT_REGISTER_FORM}
        component={InfantRegisterForm}
      />
    </Switch>
  );
};

export { PublicRoutes, AuthRoutes };
