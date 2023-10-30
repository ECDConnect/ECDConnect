import { Redirect, Route, Switch } from 'react-router-dom';
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
import { ChildCompletedObservationReports } from '@progress-observation-p/child-completed-observation-reports/child-completed-observation-reports';
import { DownloadChildProgressReport } from '@progress-observation-p/child-completed-observation-reports/components/download-child-progress-report/download-child-progress-report';
import { ViewChildProgressObservationReport } from '@progress-observation-p/child-completed-observation-reports/components/view-child-progress-observation-report/view-child-progress-observation-report';
import { ChildProgressAssessment } from '@progress-observation-p/child-progress-assessment/child-progress-assessment';
import { ChildProgressObservationNote } from '@progress-observation-p/child-progress-observation-note/child-progress-observation-note';
import { ChildProgressObservationReport } from '@progress-observation-p/child-progress-observation-report/child-progress-observation-report';
import { ChildProgressObservationPage } from '@progress-observation-p/child-progress-observation/child-progress-observation';
import ProgressObservationCategory from '@progress-observation-p/progress-observation-category/progress-tracking-category';
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
import { CoachAddress } from '@/pages/coach/coach-about/components/coach-address/coach-address';
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
import { PractitionerSignature } from '@/pages/practitioner/practitioner-about/components/practitioner-signature/practitioner-signature';
import { CoachContactPractitioner } from '@/pages/coach/practitioner-profile-info/coach-contact-practitioner/coach-contact-practitioner';
import Business from '@/pages/business/business';
import AddAmount from '@/pages/business/add-amount/add-amount';
import { AddIncome } from '@/pages/business/add-amount/add-income/add-income';
import { AddExpense } from '@/pages/business/add-amount/add-expense/add-expense';
import { WalkthroughTutorial } from '@/pages/classroom/attendance/components/attendance-tutorial/walkthrough-tutorial/walkthrough-tutorial';
import { SubmitIncomeStatementsList } from '@/pages/business/money/submit-income-statements/components/submit-income-statements-list/submit-income-statements-list';
import { PreviousStatements } from '@/pages/business/money/previous-statements/previous-statements';
import { MonthStatements } from '@/pages/business/money/monthly-statements/month-statements';
import { Community } from '@/pages/community/community';
import { CoachPractitionerJourney } from '@/pages/coach/coach-practitioner-journey';
import { SetupTrainee } from '@/pages/trainee/setup-trainee/setup-trainee';
import { TraineeOnboarding } from '@/pages/trainee/trainee-onboarding/trainee-onboarding';
import Calendar from '@/pages/calendar/calendar-home';
import RemovePractitionerFromProgramme from '@/pages/classroom/class-dashboard/practitioners/principal-practitioner-profile/components/remove-practitioner-from-programme/remove-practitioner-from-programme';
import { CoachSmartSpaceChecklist } from '@/pages/coach/practitioner-profile-info/components/trainee-timeline/components/smart-space-visit/coach-smart-space-checklist/coach-smart-space-checklist';
import { CoachTraineeFranchisorAgreement } from '@/pages/coach/practitioner-profile-info/components/trainee-timeline/components/smart-space-visit/trainee-franchisor-agreement/trainee-franchisor-agreement';
import { CoachSelfAssessment } from '@/pages/coach/practitioner-profile-info/components/trainee-timeline/components/smart-space-visit/coach-self-assessment/coach-self-assessment-checklist';
import SwitchPrincipal from '@/pages/practitioner/practitioner-programme-information/practitioner-list/switch-principal/switch-principal';
import { CoachPractitionerBusiness } from '@/pages/coach/coach-practitioner-business/coach-practitioner-business';
import { PractitionerPreviousStatements } from '@/pages/coach/coach-practitioner-business/components/statements/previous-statements';
import { PractitionerMonthStatements } from '@/pages/coach/coach-practitioner-business/components/statements/month-statements';
import { PointsSummary } from '@/pages/points/points-summary/points-summary';
import { CommunityWelcome } from '@/pages/community/welcome';
import { Club } from '@/pages/community/clubs-tab/club/individual-club-view';
import { ClubMembers } from '@/pages/community/clubs-tab/club/club-members';
import { ClubMembersEdit } from '@/pages/community/clubs-tab/club/club-members-edit';
import { ClubEdit } from '@/pages/community/clubs-tab/club/club-edit';
import { PointsYearView } from '@/pages/points/points-year-view/points-year-view';
import { ClubLeaderEdit } from '@/pages/community/clubs-tab/club/club-leader-edit';
import { ClubAdd } from '@/pages/community/clubs-tab/club/club-add';
import { CoachContactDetails } from '@/pages/practitioner/coach-contact-details/coach-contact-details';
import { ClubMembersAdd } from '@/pages/community/clubs-tab/club/club-members-add';
import { UserProfile } from '@/pages/community/clubs-tab/club/user-profile';
import { CoachTraineeOnboarding } from '@/pages/coach/practitioner-profile-info/components/trainee-timeline/trainee-onboarding';
import { ClubPoints } from '@/pages/community/clubs-tab/club/club-points';
import { MeetRegularly } from '@/pages/community/clubs-tab/club/club-points/activities/meet-regularly';
import { MeetingDetails } from '@/pages/community/clubs-tab/club/club-points/activities/meet-regularly/meeting-details';
import { BeCreative } from '@/pages/community/clubs-tab/club/club-points/activities/be-creative';
import { HostFamilyDays } from '@/pages/community/clubs-tab/club/club-points/activities/host-family-days';
import { LeaveNoOneBehind } from '@/pages/community/clubs-tab/club/club-points/activities/leave-no-one-behind';
import { CaptureChildAttendance } from '@/pages/community/clubs-tab/club/club-points/activities/capture-child-attendance';
import { CompleteChildProgressReports } from '@/pages/community/clubs-tab/club/club-points/activities/complete-child-progress';
import { LeagueLeaderBoard } from '@/pages/community/leagues-tab/league-leaderboard';
import { ActivityHelp } from '@/pages/community/clubs-tab/0-components/help-screen';
import { ClubMemberAdd } from '@/pages/community/clubs-tab/club/club-member-add';
import { ClubMemberView } from '@/pages/community/clubs-tab/club/club-member-view';
import UpdatePreschoolFee from '@/pages/classroom/update-preschool-fee/update-preschool-fee';
import CoachReassignClass from '@/pages/coach/coach-reassign-class/coach-reassign-class';
import { CurrentMonthSummary } from '@/pages/business/money/monthly-statements/current-month-summary';
import { PractitionerCurrentMonthSummary } from '@/pages/coach/coach-practitioner-business/components/statements/current-month-summary';
import { AcceptClubLeaderRole } from '@/pages/practitioner/practitioner-community/accept-club-leader-role';
import { PractitionerCommunity } from '@/pages/practitioner/practitioner-community';
import { SupportRoleEdit } from '@/pages/practitioner/practitioner-community/club-tab/club/club-support-edit';
import { AddMeeting } from '@/pages/practitioner/practitioner-community/club-tab/club/add-a-meeting';
import { AddAFamilyDayEvent } from '@/pages/practitioner/practitioner-community/club-tab/club/add-a-family-day-event';
import { AddCollageEvent } from '@/pages/practitioner/practitioner-community/club-tab/club/add-collage-event';

const PublicRoutes: React.FC = () => {
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
        path={ROUTES.BUSINESS_ADD_EXPENSE}
        component={AddExpense}
        exact={true}
      />
      <Route
        path={ROUTES.BUSINESS_SUBMIT_INCOME_STATEMENTS_LIST}
        component={SubmitIncomeStatementsList}
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
      <Route
        path={ROUTES.BUSINESS_CURRENT_MONTH_STATEMENTS_DETAILS}
        component={CurrentMonthSummary}
        exact={true}
      />
      <Route path={ROUTES.TRAINING} component={Training} exact />
      <Route path={ROUTES.COMMUNITY.ROOT} component={Community} exact />
      <Route
        path={ROUTES.COMMUNITY.WELCOME}
        component={CommunityWelcome}
        exact
      />
      <Route path={ROUTES.COMMUNITY.CLUB.ROOT} component={Club} exact />
      <Route path={ROUTES.COMMUNITY.CLUB.ADD} component={ClubAdd} exact />
      <Route path={ROUTES.COMMUNITY.CLUB.EDIT} component={ClubEdit} exact />
      <Route
        path={ROUTES.COMMUNITY.CLUB.MEMBERS.ROOT}
        component={ClubMembers}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.MEMBER.ROOT}
        component={ClubMemberView}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.MEMBER.ADD}
        component={ClubMemberAdd}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.MEMBERS.ADD}
        component={ClubMembersAdd}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.MEMBERS.EDIT}
        component={ClubMembersEdit}
        exact
      />
      <Route
        path={[
          ROUTES.COMMUNITY.CLUB.LEADER.ADD,
          ROUTES.COMMUNITY.CLUB.LEADER.EDIT,
        ]}
        component={ClubLeaderEdit}
        exact
      />
      <Route
        path={[
          ROUTES.COMMUNITY.CLUB.USER_PROFILE.COACH,
          ROUTES.COMMUNITY.CLUB.USER_PROFILE.LEADER,
          ROUTES.COMMUNITY.CLUB.USER_PROFILE.MEMBER,
        ]}
        component={UserProfile}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.ROOT}
        component={ClubPoints}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.ROOT}
        component={MeetRegularly}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.MEET_REGULARLY.MEETING_DETAILS}
        component={MeetingDetails}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.BE_CREATIVE}
        component={BeCreative}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.HOST_FAMILY_EVENT}
        component={HostFamilyDays}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.LEAVE_NO_ONE_BEHIND}
        component={LeaveNoOneBehind}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.CAPTURE_CHILD_ATTENDANCE}
        component={CaptureChildAttendance}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.CLUB.POINTS.COMPLETE_CHILD_PROGRESS_REPORTS}
        component={CompleteChildProgressReports}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.LEAGUE.ROOT}
        component={LeagueLeaderBoard}
        exact
      />
      <Route
        path={[ROUTES.COMMUNITY.CLUB.POINTS.HELP, ROUTES.COMMUNITY.LEAGUE.HELP]}
        component={ActivityHelp}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.ROOT}
        component={PractitionerCommunity}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE}
        component={AcceptClubLeaderRole}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.CLUB.SUPPORT_ROLE.EDIT}
        component={SupportRoleEdit}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.CLUB.MEETING.ADD_MEETING}
        component={AddMeeting}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.CLUB.FAMILY_DAY_EVENT.ADD_EVENT}
        component={AddAFamilyDayEvent}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.COMMUNITY.CLUB.COLLAGE_EVENT.ADD_EVENT}
        component={AddCollageEvent}
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
        path={ROUTES.TRAINEE.SETUP_TRAINEE}
        component={SetupTrainee}
      />
      <Route
        exact
        path={ROUTES.TRAINEE.TRAINEE_ONBOARDING}
        component={TraineeOnboarding}
      />
      <Route exact path={ROUTES.CALENDAR} component={Calendar} />
      <Route exact path={ROUTES.CLASSROOM.ROOT} component={ClassDashboard} />
      <Route
        exact
        path={ROUTES.CLASSROOM.UPDATE_FEE}
        component={UpdatePreschoolFee}
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
      <Route path={ROUTES.MESSAGES} component={Messages} />

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
      <Route exact path={ROUTES.COACH.PROFILE.ROOT} component={CoachProfile} />
      <Route
        exact
        path={ROUTES.COACH_SMARTSPACE_CHECK}
        component={CoachSmartSpaceChecklist}
      />
      <Route
        exact
        path={ROUTES.COACH_TRAINEE_ONBOARDING}
        component={CoachTraineeOnboarding}
      />
      <Route
        exact
        path={ROUTES.COACH_FRANCHISE_AGREEMENT}
        component={CoachTraineeFranchisorAgreement}
      />
      <Route
        exact
        path={ROUTES.COACH_SELF_ASSESSMENT}
        component={CoachSelfAssessment}
      />
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
      <Route exact path={ROUTES.COACH.ABOUT.ADDRESS} component={CoachAddress} />

      <Route exact path={ROUTES.COACH.ACCOUNT} component={CoachAccount} />
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_JOURNEY}
        component={CoachPractitionerJourney}
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
      <Route
        exact
        path={ROUTES.COACH.PRACTITIONER_BUSINESS.CURRENT_MONTH_SUMMARY}
        component={PractitionerCurrentMonthSummary}
      />
      <Route render={() => <Redirect to={ROUTES.DASHBOARD} />} />
    </Switch>
  );
};

export { PublicRoutes, AuthRoutes };
