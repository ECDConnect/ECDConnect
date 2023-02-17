import { Redirect, Route, Switch } from 'react-router-dom';
import { Login } from '@/pages/auth/login/login';
import { Logout } from '@/pages/auth/logout/logout';
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
import ROUTES from '@/routes/routes';
import ClassDashboard from '@/pages/client/client-dashboard/class-dashboard';
import { EditPractitionerProfile } from '@/pages/practitioner/edit-practitioner-profile/edit-practitioner-profile';
import { Training } from '@/pages/training/training';
import { StartVisitFromVisitDashboard } from '@/pages/client/visits-tab/start-visit';
import PregnancyVisits from '@/pages/client/visits-tab/pregnancy-visits';
import ChildVisits from '@/pages/client/visits-tab/child-visits';
import BookVisitFromVisitDashboard from '@/pages/client/visits-tab/book-visit';
import { PregnantProfile } from '@/pages/mom/pregnant-profile';
import { RecordEvent } from '@/pages/mom/pregnant-profile/visits/record-event';
import { StartVisit } from '@/pages/mom/pregnant-profile/visits/start-visit';
import { BookVisit } from '@/pages/mom/pregnant-profile/visits/book-visit';
import { PastVisits } from '@/pages/mom/pregnant-profile/visits/past-visits';
import { AntenatalVisit } from '@/pages/mom/pregnant-profile/visits/antenatal-visit';
import PointsSummary from '@/pages/client/highlights-tab/points-summary';
import UpcomingVisit from '@/pages/client/highlights-tab/upcoming-visit';
import { InfantProfile } from '@/pages/infant/infant-profile';
import { ActivityList } from '@/pages/infant/infant-profile/progress-tab/activity-list';

function PublicRoutes() {
  return (
    <Switch>
      <Route
        exact
        path={ROUTES.ROOT}
        render={() => <Redirect to={ROUTES.LOGIN} />}
      />
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
      <Route render={() => <Redirect to={ROUTES.LOGIN} />} />
    </Switch>
  );
}

function AuthRoutes() {
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
      <Route path={ROUTES.LOGOUT} component={Logout} exact={true} />

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

      <Route exact path={ROUTES.CLIENTS.ROOT} component={ClassDashboard} />
      <Route
        exact
        path={`${ROUTES.CLIENTS.MOM_PROFILE.ROOT}:id`}
        component={PregnantProfile}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.VISITS.RECORD_EVENT}
        component={RecordEvent}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.VISITS.START_VISIT}
        component={StartVisit}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.VISITS.BOOK_VISIT}
        component={BookVisit}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.VISITS.PAST_VISITS}
        component={PastVisits}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.VISITS.ANTENATAL_VISIT}
        component={AntenatalVisit}
      />
      <Route
        exact
        path={`${ROUTES.CLIENTS.INFANT_PROFILE.ROOT}:id`}
        component={InfantProfile}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.PROGRESS.ACTIVITIES_FORM}
        component={ActivityList}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.VISIT_TAB.START_VISIT}
        component={StartVisitFromVisitDashboard}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.VISIT_TAB.BOOK_VISIT}
        component={BookVisitFromVisitDashboard}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.VISIT_TAB.PREGNANCY_VISITS}
        component={PregnancyVisits}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.VISIT_TAB.CHILD_VISITS}
        component={ChildVisits}
      />

      <Route
        exact
        path={ROUTES.CLIENTS.HIGHLIGHTS_TAB.POINTS_SUMMARY}
        component={PointsSummary}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.HIGHLIGHTS_TAB.UPCOMING_VISIT}
        component={UpcomingVisit}
      />

      <Route path={ROUTES.MESSAGES} component={Messages} />

      <Route path={ROUTES.MOM_REGISTER} component={PregnantRegister} />
      <Route path={ROUTES.MOM_REGISTER_FORM} component={PregnantRegisterForm} />
      <Route path={ROUTES.INFANT_REGISTER} component={InfantRegister} />
      <Route
        path={ROUTES.INFANT_REGISTER_FORM}
        component={InfantRegisterForm}
      />
      <Route
        path={ROUTES.HEALTH_CAREWORKER_PROFILE_SETUP}
        component={EditPractitionerProfile}
      />
      <Route path={ROUTES.TRAINING} component={Training} exact={true} />
    </Switch>
  );
}

export { PublicRoutes, AuthRoutes };
