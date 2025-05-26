import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
import { Login } from '@auth-p/login/login';
import { NewPassword } from '@auth-p/new-password/new-password';
import PasswordReset from '@auth-p/password-reset/password-reset';
import { SignUp } from '@auth-p/sign-up/sign-up';
import { VerifyPhoneNumber } from '@auth-p/verify-phonenumber/verify-phone-number';
import { ChildAttendanceReportPage } from '@child-p/child-attendance-report/child-attendance-report';
import { ChildNotes } from '@child-p/child-notes/child-notes';
import { ChildProfile } from '@child-p/child-profile/child-profile';
import { ChildRegistration } from '@child-p/child-registration/child-registration';
import { ChildRegistrationLanding } from '@child-p/child-registration-landing/child-registration-landing';
import { ContactCaregivers } from '@child-p/contact-caregivers/contact-caregivers';
import { ContactChildCaregiver } from '@child-p/contact-child-caregiver/contact-child-caregiver';
import { EditChildInformation } from '@child-p/edit-child-information/edit-child-information';
import RemoveChild from '@child-p/remove-child/remove-child';
import { ClassDashboard } from '@classroom-p/class-dashboard/class-dashboard';
import ProgrammeTutorial from '@programme-planning-p/programme-planning-information/programme-tutorial/programme-tutorial';
import ProgrammePlanningDailyRoutine from '@programme-planning-p/programme-planning-information/sub-pages/programme-planning-daily-routine/programme-planning-daily-routine';
import ProgrammePlanningDevelopingChildren from '@programme-planning-p/programme-planning-information/sub-pages/programme-planning-developing-children/programme-planning-developing-children';
import { ProgrammeRoutine } from '@programme-planning-p/programme-routine/programme-routine';
import ProgrammeTheme from '@programme-planning-p/programme-theme/programme-theme';
import ProgrammeTiming from '@programme-planning-p/programme-timing/programme-timing';
import Dashboard from '@dashboard-p/dashboard';
import { Training } from '@/pages/training/training';
import { Messages } from '@messages-p/messages';
import { EditPractitionerProfile } from '@practitioner-p/edit-practitioner-profile/edit-practitioner-profile';
import { PractitionerAbout } from '@practitioner-p/practitioner-about/practitioner-about';
import PractitionerAccount from '@practitioner-p/practitioner-account/practitioner-account';
import { PractitionerProfile } from '@practitioner-p/practitioner-profile/practitioner-profile';
import { PractitionerProgrammeInformation } from '@practitioner-p/practitioner-programme-information/practitioner-programme-information';
import { EditPlaygroups } from '@practitioner-p/save-practitioner-playgroups/save-practitioner-playgroups';
import { ProgrammeSummaries } from '@programme-planning-p/programme-summaries/programme-summaries';
import { ChildRegistrationBirthCertificate } from '@child-p/child-registration-birth-certificate/child-registration';
import { CoachRegistration } from '@/pages/coach/coach-registation/coach-registation';
import { EditCoachProfile } from '@/pages/coach/edit-coach-profile/edit-coach-profile';
import { CoachProfile } from '@/pages/coach/coach-profile/coach-profile';
import { CoachAbout } from '@/pages/coach/coach-about/coach-about';
import { CoachSignature } from '@/pages/coach/coach-about/components/coach-signature/coach-signature';
import { Practitioners } from '@/pages/coach/practitioners/practitioners';
import { CoachPractitionerProfileInfo } from '@/pages/coach/practitioner-profile-info/practitioner-profile-info';
import { CoachPractitionerClassroom } from '@/pages/coach/coach-practitioner-classroom/coach-practitioner-classroom';
import { CoachProgrammeInformation } from '@/pages/coach/coach-programme-information/coach-programme-information';
import { CoachChildProfile } from '@/pages/coach/coach-child-profile/coach-child-profile';
import CoachAccount from '@/pages/coach/coach-account/coach-account';
import CoachPractitionerChildList from '@/pages/coach/coach-practitioner-child-list/coach-practitioner-child-list';
import ROUTES from './routes';
import { CoachClassesReassigned } from '@/pages/coach/coach-classes-reassigned/coach-classes-reassigned';
import { CoachNotes } from '@/pages/coach/practitioner-profile-info/components/coach-notes/coach-notes';
import { RemovePractioner } from '@/pages/coach/practitioner-profile-info/components/remove-practitioner/remove-practitioner';
import { SetupPrincipal } from '@/pages/principal/setup-principal/setup-principal';
import { PrincipalPractitionerProfileInfo } from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/principal-practitioner-profile';
import { PrincipalPractitionerChildList } from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-child-list/principal-practitioner-child-list';
import { PrincipalNotes } from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/principal-notes/principal-notes';
import { PractitionerList } from '@/pages/practitioner/practitioner-programme-information/practitioner-list/practitioner-list';
import { Logout } from '@/pages/auth/logout/logout';
import ReassignClass from '@/pages/classroom/class-dashboard/practitioners/reassign-class/reassign-class';
import { AddPractitioner } from '@/pages/principal/components/add-practitioner/add-practitioner';
import ConfirmPractitioner from '@/pages/principal/components/add-practitioner/confirm-practitioner';
import { ContactPractitioner } from '@/pages/principal/components/contact-practitioner/contact-practitioner';
import { PractitionerSignature } from '@/pages/practitioner/practitioner-about/components/practitioner-signature/practitioner-signature';
import { CoachContactPractitioner } from '@/pages/coach/practitioner-profile-info/coach-contact-practitioner/coach-contact-practitioner';
import Business from '@/pages/business/business';
import AddAmount from '@/pages/business/add-amount/add-amount';
import { AddIncome } from '@/pages/business/add-amount/add-income/add-income';
import { AddExpense } from '@/pages/business/add-amount/add-expense/add-expense';
import { WalkthroughTutorial } from '@/pages/classroom/attendance/components/attendance-tutorial/walkthrough-tutorial/walkthrough-tutorial';
import { PreviousStatements } from '@/pages/business/money/previous-statements/previous-statements';
import { MonthStatements } from '@/pages/business/money/monthly-statements/month-statements';
import { CoachPractitionerJourney } from '@/pages/coach/coach-practitioner-journey';
import Calendar from '@/pages/calendar/calendar-home';
import RemovePractitionerFromProgramme from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/remove-practitioner-from-programme/remove-practitioner-from-programme';
import SwitchPrincipal from '@/pages/practitioner/practitioner-programme-information/practitioner-list/switch-principal/switch-principal';
import { CoachPractitionerBusiness } from '@/pages/coach/coach-practitioner-business/coach-practitioner-business';
import { PractitionerPreviousStatements } from '@/pages/coach/coach-practitioner-business/components/statements/previous-statements';
import { PractitionerMonthStatements } from '@/pages/coach/coach-practitioner-business/components/statements/month-statements';
import { PointsSummary } from '@/pages/points/points-summary/points-summary';
import { PointsYearView } from '@/pages/points/points-year-view/points-year-view';
import { CoachContactDetails } from '@/pages/practitioner/coach-contact-details/coach-contact-details';
import CoachReassignClass from '@/pages/coach/coach-reassign-class/coach-reassign-class';
import { CoachPractitionerPoints } from '@/pages/coach/coach-practitioner-points/coach-practitioner-points';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { usePrevious } from '@ecdlink/core';
import { Location } from 'history';
import ChildList from '@/pages/classroom/child-list/child-list';
import { UserRegistration } from '@/components/user-registration/user-registration';
import { useTenant } from '@/hooks/useTenant';
import { OASignUpOrLogin } from '@/pages/auth/oa-sign-up/oa-sign-up-or-login';
import { OaLogin } from '@/pages/auth/oa-login/oa-login';
import { EditRegisters } from '@/pages/classroom/attendance/edit-registers/edit-registers';
import { UpdateIncome } from '@/pages/business/add-amount/add-income/update-income';
import ProgrammeDashboard from '@/pages/classroom/programme-planning/programme-dashboard/programme-dashboard';
import { UpdateExpense } from '@/pages/business/add-amount/add-expense/update-expense';
import { Community } from '@/pages/community/community';
import { CommunityProfile } from '@/pages/community/community-profile/community-profile';
import { ConnectionProfile } from '@/pages/community/connection-profile/connection-profile';
import MonthlyAttendanceReport from '@/pages/classroom/attendance/components/attendance-report/components/attendance-monthly-report/attendance-report';
import { ECDHeroes } from '@/pages/community/community-tabs/components/community-dashboard/components/ecd-heroes/ecd-heroes';
import { CommunityConnections } from '@/pages/community/community-tabs/components/community-dashboard/components/received-requests/community-connections';
import { ChildProgressReportsList } from '@/pages/classroom/progress/child-reports-list/child-progress-reports-list';
import { SelectChildToTrack } from '@/pages/classroom/progress/select-child-to-track-progress/select-child-to-track-progress';
import { SelectCategoryToTrack } from '@/pages/classroom/progress/select-category-to-track-progress/select-category-to-track-progress';
import { ObservationsByCategory } from '@/pages/classroom/progress/observations-by-category/observations-by-category';
import { ProgressCreateReport } from '@/pages/classroom/progress/create-report/create-report';
import { ProgressShareReport } from '@/pages/classroom/progress/share-report/share-report';
import { ProgressViewReport } from '@/pages/classroom/progress/view-report/view-report';
import { ProgressViewReportsSummary } from '@/pages/classroom/progress/view-reports-summary/view-reports-summary';
import { ProgressViewReportsSummarySelectClassroomGroupAndAgeGroup } from '@/pages/classroom/progress/view-reports-summary/view-reports-summary-select-class-and-age-group';
import { ProgressReportingPeriods } from '@/pages/classroom/progress/reporting-periods/progress-reporting-periods';
import { ObservationsForChild } from '@/pages/classroom/progress/observations-for-child/observations-for-child';
import { ObservationsForChildNotes } from '@/pages/classroom/progress/observations-for-child-landing/observations-for-child-landing-notes';
import { ObservationsForChildLanding } from '@/pages/classroom/progress/observations-for-child-landing/observations-for-child-landing';

const PublicRoutes: React.FC = () => {
  const tenant = useTenant();
  const isOpenAccessUrl = tenant?.isOpenAccess;
  //const url = window.location?.hostname;
  // const isOpenAccessUrl =
  //   url === 'ecdconnect-develop-app.azurewebsites.net' ||
  //   url === 'ecdconnect-develop-app';

  return (
    <Switch>
      <Route
        exact
        path={ROUTES.ROOT}
        render={() => (
          <Redirect
            to={isOpenAccessUrl ? ROUTES.OA_SIGN_UP_OR_LOGIN : ROUTES.LOGIN}
          />
        )}
      />
      <Route path={ROUTES.LOGIN} component={OaLogin} exact={true} />
      <Route
        path={ROUTES.OA_SIGN_UP_OR_LOGIN}
        component={isOpenAccessUrl ? OASignUpOrLogin : SignUp}
        exact={true}
      />
      <Route
        path={ROUTES.CREATE_USERNAME}
        component={UserRegistration}
        exact={true}
      />
      <Route
        path={ROUTES.PASSWORD_RESET}
        component={PasswordReset}
        exact={true}
      />
      <Route path={ROUTES.NEW_PASSWORD} component={NewPassword} exact={true} />
      <Route
        path={ROUTES.SIGN_UP}
        component={isOpenAccessUrl ? OASignUpOrLogin : SignUp}
        exact={true}
      />
      <Route
        path={ROUTES.COACH_REGISTRATION}
        component={CoachRegistration}
        exact={true}
      />
      <Route
        path={ROUTES.VERIFY_PHONE}
        component={VerifyPhoneNumber}
        exact={true}
      />
      <Route
        path={ROUTES.CHILD_REGISTRATION_LANDING}
        component={ChildRegistrationLanding}
      />
      <Route render={() => <Redirect to={ROUTES.LOGIN} />} />
    </Switch>
  );
};

const AuthRoutes: React.FC = () => {
  const { isOnline } = useOnlineStatus();
  const location = useLocation();
  const previousLocation = usePrevious(location) as
    | Location<unknown>
    | undefined;

  return (
    <Switch>
      {(!isOnline ||
        (location.pathname === ROUTES.LOGIN &&
          previousLocation?.pathname === ROUTES.LOGIN)) && (
        <Route path={ROUTES.LOGIN} component={Login} exact={true} />
      )}
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
      <Route path={ROUTES.BUSINESS} component={Business} exact={true} />
      <Route
        path={ROUTES.BUSINESS_ADD_AMOUNT}
        component={AddAmount}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_ADD_INCOME}
        component={AddIncome}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_UPDATE_INCOME}
        component={UpdateIncome}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_ADD_EXPENSE}
        component={AddExpense}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_UPDATE_EXPENSE}
        component={UpdateExpense}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_PREVIOUS_STATEMENTS_LIST}
        component={PreviousStatements}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_MONTH_STATEMENTS_DETAILS}
        component={MonthStatements}
        exact={true}
      />
      <Route path={ROUTES.TRAINING} component={Training} exact />
      <Route path={ROUTES.COMMUNITY.WELCOME} component={Community} exact />
      <Route path={ROUTES.COMMUNITY.ROOT} component={Community} exact />
      <Route
        path={ROUTES.COMMUNITY.CONNECTION_PROFILE}
        component={ConnectionProfile}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.ECD_HEROES_LIST}
        component={ECDHeroes}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.RECEIVED_REQUESTS}
        component={CommunityConnections}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.PROFILE}
        component={CommunityProfile}
        exact
      />
      <Route
        path={ROUTES.ATTENDANCE_TUTORIAL_WALKTHROUGH}
        component={WalkthroughTutorial}
        exact={true}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.ABOUT.ROOT}
        component={PractitionerAbout}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.ABOUT.SIGNATURE}
        component={PractitionerSignature}
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
      <Route
        exact
        path={ROUTES.PRACTITIONER.POINTS.SUMMARY}
        component={PointsSummary}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.POINTS.YEAR}
        component={PointsYearView}
      />
      <Route
        exact
        path={ROUTES.PRACTITIONER.CONTACT_COACH}
        component={CoachContactDetails}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.SETUP_PROFILE}
        component={SetupPrincipal}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.ADD_PRACTITIONER}
        component={AddPractitioner}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.CONFIRM_PRACTITIONER}
        component={ConfirmPractitioner}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.PRACTITIONER_PROFILE}
        component={PrincipalPractitionerProfileInfo}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.PRACTITIONER_LIST}
        component={PractitionerList}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.PRACTITIONER_REASSIGN_CLASS}
        component={ReassignClass}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.PRACTITIONER_REMOVE_FROM_PROGRAMME}
        component={RemovePractitionerFromProgramme}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.SWAP_PRINCIPAL}
        component={SwitchPrincipal}
      />
      <Route
        exact
        path={ROUTES.PRINCIPAL.PRACTITIONER_CHILD_LIST}
        component={PrincipalPractitionerChildList}
      />
      <Route exact path={ROUTES.PRINCIPAL.NOTES} component={PrincipalNotes} />
      <Route
        exact
        path={ROUTES.PRINCIPAL.CONTACT_PRACTITIONER}
        component={ContactPractitioner}
      />
      <Route exact path={ROUTES.CALENDAR} component={Calendar} />
      <Route exact path={ROUTES.CLASSROOM.ROOT} component={ClassDashboard} />
      <Route exact path={ROUTES.CLASSROOM.CHILDREN} component={ChildList} />
      <Route
        exact
        path={ROUTES.CLASSROOM.ATTENDANCE.EDIT_REGISTERS}
        component={EditRegisters}
      />
      <Route
        exact
        path={ROUTES.CLASSROOM.ATTENDANCE.MONTHLY_REPORT}
        component={MonthlyAttendanceReport}
      />
      <Route
        exact
        path={ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.ROOT}
        component={ProgrammeDashboard}
      />
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
        path={ROUTES.PROGRESS_SETUP_REPORTING_PERIODS}
        component={ProgressReportingPeriods}
      />
      <Route
        path={ROUTES.PROGRESS_OBSERVATIONS}
        component={ObservationsForChild}
      />
      <Route
        path={ROUTES.PROGRESS_OBSERVATIONS_NOTES}
        component={ObservationsForChildNotes}
      />
      <Route
        path={ROUTES.PROGRESS_REPORT_LIST}
        component={ChildProgressReportsList}
      />
      <Route
        path={ROUTES.PROGRESS_OBSERVATIONS_LANDING}
        component={ObservationsForChildLanding}
      />
      <Route
        path={ROUTES.PROGRESS_SELECT_CHILD_TO_TRACK}
        component={SelectChildToTrack}
      />
      <Route
        path={ROUTES.PROGRESS_SELECT_CATEGORY_TO_TRACK}
        component={SelectCategoryToTrack}
      />
      <Route
        path={ROUTES.PROGRESS_OBSERVATIONS_BY_CATEGORY}
        component={ObservationsByCategory}
      />
      <Route
        path={ROUTES.PROGRESS_CREATE_REPORT}
        component={ProgressCreateReport}
      />
      <Route
        path={ROUTES.PROGRESS_SHARE_REPORT}
        component={ProgressShareReport}
      />
      <Route
        path={ROUTES.PROGRESS_VIEW_REPORT}
        component={ProgressViewReport}
      />
      <Route
        path={
          ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY_SELECT_CLASSROOM_GROUP_AND_AGE_GROUP
        }
        component={ProgressViewReportsSummarySelectClassroomGroupAndAgeGroup}
      />
      <Route
        path={ROUTES.PROGRESS_VIEW_REPORTS_SUMMARY}
        component={ProgressViewReportsSummary}
      />
      <Route path={ROUTES.MESSAGES} component={Messages} />

      <Route path={ROUTES.PROGRAMMES.THEME} component={ProgrammeTheme} />
      <Route path={ROUTES.PROGRAMMES.TIMING} component={ProgrammeTiming} />
      <Route path={ROUTES.PROGRAMMES.SUMMARY} component={ProgrammeSummaries} />
      <Route path={ROUTES.PROGRAMMES.ROUTINE} component={ProgrammeRoutine} />
      <Route
        path={
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL
            .GETTING_STARTED
        }
        component={ProgrammeTutorial}
      />
      <Route
        path={
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL
            .DEVELOPING_CHILDREN
        }
        component={ProgrammePlanningDevelopingChildren}
      />
      <Route
        path={
          ROUTES.CLASSROOM.ACTIVITIES.PROGRAMME_DASHBOARD.TUTORIAL.DAILY_ROUTINE
        }
        component={ProgrammePlanningDailyRoutine}
      />
      <Route exact path={ROUTES.COACH.PROFILE.ROOT} component={CoachProfile} />
      <Route
        exact
        path={ROUTES.COACH.PROFILE.EDIT}
        component={EditCoachProfile}
      />
      <Route exact path={ROUTES.COACH.ABOUT.ROOT} component={CoachAbout} />
      <Route
        exact
        path={ROUTES.COACH.ABOUT.SIGNATURE}
        component={CoachSignature}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONERS}
        component={Practitioners}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_REASSIGN_CLASS}
        component={CoachReassignClass}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_PROFILE_INFO}
        component={CoachPractitionerProfileInfo}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_CLASSROOM}
        component={CoachPractitionerClassroom}
      />
      <Route path={ROUTES.COACH.NOTES} component={CoachNotes} />
      <Route
        path={ROUTES.COACH.PRACTIONER_REMOVE}
        component={RemovePractioner}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_CHILD_LIST}
        component={CoachPractitionerChildList}
      />
      <Route
        exact
        path={ROUTES.COACH.PROGRAMME_INFORMATION}
        component={CoachProgrammeInformation}
      />
      <Route
        exact
        path={ROUTES.COACH.CLASSES_REASSIGNED}
        component={CoachClassesReassigned}
      />
      <Route
        exact
        path={ROUTES.COACH.CHILD_PROFILE}
        component={CoachChildProfile}
      />
      <Route
        exact
        path={ROUTES.COACH.CONTACT_PRACTITIONER}
        component={CoachContactPractitioner}
      />

      <Route exact path={ROUTES.COACH.ACCOUNT} component={CoachAccount} />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_JOURNEY}
        component={CoachPractitionerJourney}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_POINTS}
        component={CoachPractitionerPoints}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_BUSINESS.BUSINESS}
        component={CoachPractitionerBusiness}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_BUSINESS.LIST_STATEMENTS}
        component={PractitionerPreviousStatements}
      />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_BUSINESS.STATEMENT_DETAILS}
        component={PractitionerMonthStatements}
      />
      <Route render={() => <Redirect to={ROUTES.DASHBOARD} />} />
    </Switch>
  );
};

export { PublicRoutes, AuthRoutes };
