import { Redirect, Route, Switch } from 'react-router-dom';
import { Login } from '../pages/auth/login/login';
import { NewPassword } from '../pages/auth/new-password/new-password';
import PasswordReset from '../pages/auth/password-reset/password-reset';
import { SignUp } from '../pages/auth/sign-up/sign-up';
import { VerifyPhoneNumber } from '../pages/auth/verify-phonenumber/verify-phone-number';
import { ChildAttendanceReportPage } from '../pages/child/child-attendance-report/child-attendance-report';
import { ChildNotes } from '../pages/child/child-notes/child-notes';
import { ChildProfile } from '../pages/child/child-profile/child-profile';
import { ChildRegistration } from '../pages/child/child-registration/child-registration';
import { ChildRegistrationLanding } from '../pages/child/child-registration-landing/child-registration-landing';
import { ContactCaregivers } from '../pages/child/contact-caregivers/contact-caregivers';
import { ContactChildCaregiver } from '../pages/child/contact-child-caregiver/contact-child-caregiver';
import { EditChildInformation } from '../pages/child/edit-child-information/edit-child-information';
import RemoveChild from '../pages/child/remove-child/remove-child';
import { ClassDashboard } from '../pages/classroom/class-dashboard/class-dashboard';
import ProgrammeTutorial from '../pages/classroom/programme-planning/programme-planning-information/programme-tutorial/programme-tutorial';
import ProgrammePlanningDailyRoutine from '../pages/classroom/programme-planning/programme-planning-information/sub-pages/programme-planning-daily-routine/programme-planning-daily-routine';
import ProgrammePlanningDevelopingChildren from '../pages/classroom/programme-planning/programme-planning-information/sub-pages/programme-planning-developing-children/programme-planning-developing-children';
import { ProgrammeRoutine } from '../pages/classroom/programme-planning/programme-routine/programme-routine';
import ProgrammeTheme from '../pages/classroom/programme-planning/programme-theme/programme-theme';
import ProgrammeTiming from '../pages/classroom/programme-planning/programme-timing/programme-timing';
import { ChildCompletedObservationReports } from '../pages/classroom/progress-observation/child-completed-observation-reports/child-completed-observation-reports';
import { DownloadChildProgressReport } from '../pages/classroom/progress-observation/child-completed-observation-reports/components/download-child-progress-report/download-child-progress-report';
import { ViewChildProgressObservationReport } from '../pages/classroom/progress-observation/child-completed-observation-reports/components/view-child-progress-observation-report/view-child-progress-observation-report';
import { ChildProgressAssessment } from '../pages/classroom/progress-observation/child-progress-assessment/child-progress-assessment';
import { ChildProgressObservationNote } from '../pages/classroom/progress-observation/child-progress-observation-note/child-progress-observation-note';
import { ChildProgressObservationReport } from '../pages/classroom/progress-observation/child-progress-observation-report/child-progress-observation-report';
import { ChildProgressObservationPage } from '../pages/classroom/progress-observation/child-progress-observation/child-progress-observation';
import ProgressObservationCategory from '../pages/classroom/progress-observation/progress-observation-category/progress-tracking-category';
import Dashboard from '../pages/dashboard/dashboard';
import { Messages } from '../pages/messages/messages';
import { EditPractitionerProfile } from '../pages/practitioner/edit-practitioner-profile/edit-practitioner-profile';
import { PractitionerAbout } from '../pages/practitioner/practitioner-about/practitioner-about';
import PractitionerAccount from '../pages/practitioner/practitioner-account/practitioner-account';
import { PractitionerProfile } from '../pages/practitioner/practitioner-profile/practitioner-profile';
import { PractitionerProgrammeInformation } from '../pages/practitioner/practitioner-programme-information/practitioner-programme-information';
import { EditPlaygroups } from '../pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups';
import { ProgrammeSummaries } from '../pages/classroom/programme-planning/programme-summaries/programme-summaries';
import { ChildRegistrationBirthCertificate } from '../pages/child/child-registration-birth-certificate/child-registration';
import ROUTES from './routes';

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
      <Route
        path={ROUTES.CHILD_REGISTRATION_LANDING}
        component={ChildRegistrationLanding}
      />
    </Switch>
  );
};

const ProgrammeRoutes = () => (
  <>
    <Route path={ROUTES.PROGRAMMES.THEME} component={ProgrammeTheme} />
    <Route path={ROUTES.PROGRAMMES.TIMING} component={ProgrammeTiming} />
    <Route path={ROUTES.PROGRAMMES.SUMMARY} component={ProgrammeSummaries} />
    <Route path={ROUTES.PROGRAMMES.ROUTINE} component={ProgrammeRoutine} />
    <Route
      path={ROUTES.PROGRAMMES.TUTORIAL.GETTING_STARTED}
      component={ProgrammeTutorial}
    />

    <Route
      path={ROUTES.PROGRAMMES.TUTORIAL.DEVELOPING_CHILDREN}
      component={ProgrammePlanningDevelopingChildren}
    />

    <Route
      path={ROUTES.PROGRAMMES.TUTORIAL.DAILY_ROUTINE}
      component={ProgrammePlanningDailyRoutine}
    />
  </>
);

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
        path={ROUTES.CHILD_REGISTRATION_LANDING}
        component={ChildRegistrationLanding}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.PROFILE.PLAYGROUPS}
        component={EditPlaygroups}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.PROGRAMME_INFORMATION}
        component={PractitionerProgrammeInformation}
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
      <Route
        exact
        path={ROUTES.PRACTITIONER.PROFILE.EDIT}
        component={EditPractitionerProfile}
      />
      <Route path={ROUTES.CLASSROOM} component={ClassDashboard} />
      <Route path={ROUTES.CHILD_REGISTRATION} component={ChildRegistration} />
      <Route
        exact
        path={ROUTES.CHILD_REGISTRATION_BIRTH_CERTIFICATE}
        component={ChildRegistrationBirthCertificate}
      />
      <Route
        path={ROUTES.CHILD.INFORMATION.EDIT}
        component={EditChildInformation}
      />
      <Route path={ROUTES.CHILD_NOTES} component={ChildNotes} />
      <Route path={ROUTES.CHILD_PROFILE} component={ChildProfile} />
      <Route path={ROUTES.CHILD_CAREGIVERS} component={ContactCaregivers} />
      <Route
        path={ROUTES.CHILD_ATTENDANCE_CAREGIVER}
        component={ContactChildCaregiver}
      />
      <Route
        path={ROUTES.CHILD_ATTENDANCE_REPORT}
        component={ChildAttendanceReportPage}
      />
      <Route path={ROUTES.REMOVE_CHILD} component={RemoveChild} />
      <Route
        path={ROUTES.PROGRESS_TRACKING_CATEGORY}
        component={ProgressObservationCategory}
      />
      <Route
        path={ROUTES.CHILD_PROGRESS_ASSESSMENT}
        component={ChildProgressAssessment}
      />
      <Route
        path={ROUTES.CHILD_PROGRESS_OBSERVATION}
        component={ChildProgressObservationPage}
      />
      <Route
        path={ROUTES.CHILD_PROGRESS_OBSERVATION_NOTE}
        component={ChildProgressObservationNote}
      />
      <Route
        path={ROUTES.CHILD_PROGRESS_OBSERVATION_REPORT}
        component={ChildProgressObservationReport}
      />
      <Route
        path={ROUTES.COMPLETED_CHILD_PROGRESS_OBSERVATION_REPORTS}
        component={ChildCompletedObservationReports}
      />

      <Route
        path={ROUTES.VIEW_CHILD_PROGRESS_OBSERVATION_REPORT}
        component={ViewChildProgressObservationReport}
      />
      <Route
        path={ROUTES.DOWNLOAD_CHILD_PROGRESS_OBSERVATION_REPORTS}
        component={DownloadChildProgressReport}
      />
      <Route path={ROUTES.MESSAGE} component={Messages} />

      {ProgrammeRoutes()}
    </Switch>
  );
};

export { PublicRoutes, AuthRoutes };
