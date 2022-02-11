import { Redirect, Route, Switch } from 'react-router-dom';
import { Login } from './pages/auth/login/login';
import { NewPassword } from './pages/auth/new-password/new-password';
import PasswordReset from './pages/auth/password-reset/password-reset';
import { SignUp } from './pages/auth/sign-up/sign-up';
import { VerifyPhoneNumber } from './pages/auth/verify-phonenumber/verify-phone-number';
import { ChildAttendanceReportPage } from './pages/child/child-attendance-report/child-attendance-report';
import { ChildNotes } from './pages/child/child-notes/child-notes';
import { ChildProfile } from './pages/child/child-profile/child-profile';
import { ChildRegistration } from './pages/child/child-registration/child-registration';
import { ChildRegistrationLanding } from './pages/child/child-registration-landing/child-registration-landing';
import { ContactCaregivers } from './pages/child/contact-caregivers/contact-caregivers';
import { ContactChildCaregiver } from './pages/child/contact-child-caregiver/contact-child-caregiver';
import { EditChildInformation } from './pages/child/edit-child-information/edit-child-information';
import RemoveChild from './pages/child/remove-child/remove-child';
import { ClassDashboard } from './pages/classroom/class-dashboard/class-dashboard';
import ProgrammeTutorial from './pages/classroom/programme-planning/programme-planning-information/programme-tutorial/programme-tutorial';
import ProgrammePlanningDailyRoutine from './pages/classroom/programme-planning/programme-planning-information/sub-pages/programme-planning-daily-routine/programme-planning-daily-routine';
import ProgrammePlanningDevelopingChildren from './pages/classroom/programme-planning/programme-planning-information/sub-pages/programme-planning-developing-children/programme-planning-developing-children';
import { ProgrammeRoutine } from './pages/classroom/programme-planning/programme-routine/programme-routine';
import ProgrammeTheme from './pages/classroom/programme-planning/programme-theme/programme-theme';
import ProgrammeTiming from './pages/classroom/programme-planning/programme-timing/programme-timing';
import { ChildCompletedObservationReports } from './pages/classroom/progress-observation/child-completed-observation-reports/child-completed-observation-reports';
import { DownloadChildProgressReport } from './pages/classroom/progress-observation/child-completed-observation-reports/components/download-child-progress-report/download-child-progress-report';
import { ViewChildProgressObservationReport } from './pages/classroom/progress-observation/child-completed-observation-reports/components/view-child-progress-observation-report/view-child-progress-observation-report';
import { ChildProgressAssessment } from './pages/classroom/progress-observation/child-progress-assessment/child-progress-assessment';
import { ChildProgressObservationNote } from './pages/classroom/progress-observation/child-progress-observation-note/child-progress-observation-note';
import { ChildProgressObservationReport } from './pages/classroom/progress-observation/child-progress-observation-report/child-progress-observation-report';
import { ChildProgressObservationPage } from './pages/classroom/progress-observation/child-progress-observation/child-progress-observation';
import ProgressObservationCategory from './pages/classroom/progress-observation/progress-observation-category/progress-tracking-category';
import Dashboard from './pages/dashboard/dashboard';
import { Messages } from './pages/messages/messages';
import { EditPractitionerProfile } from './pages/practitioner/edit-practitioner-profile/edit-practitioner-profile';
import { PractitionerAbout } from './pages/practitioner/practitioner-about/practitioner-about';
import PractitionerAccount from './pages/practitioner/practitioner-account/practitioner-account';
import { PractitionerProfile } from './pages/practitioner/practitioner-profile/practitioner-profile';
import { PractitionerProgrammeInformation } from './pages/practitioner/practitioner-programme-information/practitioner-programme-information';
import { EditPlaygroups } from './pages/practitioner/save-practitioner-playgroups/save-practitioner-playgroups';
import { ProgrammeSummaries } from './pages/classroom/programme-planning/programme-summaries/programme-summaries';
import { ChildRegistrationBirthCertificate } from './pages/child/child-registration-birth-certificate/child-registration';

const PublicRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" render={() => <Redirect to="/login" />} />
      <Route path="/login" component={Login} exact={true} />
      <Route path="/password-reset" component={PasswordReset} exact={true} />
      <Route path="/new-password" component={NewPassword} exact={true} />
      <Route path="/sign-up" component={SignUp} exact={true} />
      <Route path="/verify-phone" component={VerifyPhoneNumber} exact={true} />
      <Route path="/child-registration-landing" component={ChildRegistrationLanding} />
    </Switch>
  );
};

const ProgrammeRoutes = () => (
  <>
    <Route path="/programmes/theme" component={ProgrammeTheme} />
    <Route path="/programmes/timing" component={ProgrammeTiming} />
    <Route path="/programmes/summary" component={ProgrammeSummaries} />
    <Route path="/programmes/routine" component={ProgrammeRoutine} />
    <Route path="/programmes/tutorial/getting-started" component={ProgrammeTutorial} />

    <Route
      path="/programmes/tutorial/developing-children"
      component={ProgrammePlanningDevelopingChildren}
    />

    <Route path="/programmes/tutorial/daily-routine" component={ProgrammePlanningDailyRoutine} />
  </>
);

const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/password-reset" component={PasswordReset} exact={true} />
      <Route path="/new-password" component={NewPassword} exact={true} />
      <Route path="/sign-up" component={SignUp} exact={true} />
      <Route path="/verify-phone" component={VerifyPhoneNumber} exact={true} />

      <Route path="/" component={Dashboard} exact={true} />
      <Route path="/dashboard" component={Dashboard} exact={true} />
      <Route exact path="/practitioner/about" component={PractitionerAbout} />
      <Route path="/child-registration-landing" component={ChildRegistrationLanding} />
      <Route exact path="/practitioner/profile/playgroups" component={EditPlaygroups} />
      <Route
        exact
        path="/practitioner/programme-information"
        component={PractitionerProgrammeInformation}
      />
      <Route exact path="/practitioner/account" component={PractitionerAccount} />
      <Route exact path="/practitioner/profile" component={PractitionerProfile} />
      <Route exact path="/practitioner/profile/edit/" component={EditPractitionerProfile} />
      <Route path="/classroom" component={ClassDashboard} />
      <Route path="/child-registration" component={ChildRegistration} />
      <Route
        exact
        path="/child-registration-birth-certificate"
        component={ChildRegistrationBirthCertificate}
      />
      <Route path="/child/information/edit" component={EditChildInformation} />
      <Route path="/child-notes" component={ChildNotes} />
      <Route path="/child-profile" component={ChildProfile} />
      <Route path="/child-caregivers" component={ContactCaregivers} />
      <Route path="/child-attendance-caregiver" component={ContactChildCaregiver} />
      <Route path="/child-attendance-report" component={ChildAttendanceReportPage} />
      <Route path="/remove-child" component={RemoveChild} />
      <Route path="/progress-tracking-category" component={ProgressObservationCategory} />
      <Route path="/child-progress-assessment" component={ChildProgressAssessment} />
      <Route path="/child-progress-observation" component={ChildProgressObservationPage} />
      <Route path="/child-progress-observation-note" component={ChildProgressObservationNote} />
      <Route path="/child-progress-observation-report" component={ChildProgressObservationReport} />
      <Route
        path="/completed-child-progress-observation-reports"
        component={ChildCompletedObservationReports}
      />

      <Route
        path="/view-child-progress-observation-report"
        component={ViewChildProgressObservationReport}
      />
      <Route
        path="/download-child-progress-observation-reports"
        component={DownloadChildProgressReport}
      />
      <Route path="/messages" component={Messages} />

      {ProgrammeRoutes()}
    </Switch>
  );
};

export { PublicRoutes, AuthRoutes };
