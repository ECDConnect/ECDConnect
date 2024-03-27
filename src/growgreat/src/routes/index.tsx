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
import { PractitionerAbout } from '@/pages/practitioner/practitioner-about/practitioner-about';
import PractitionerAccount from '@/pages/practitioner/practitioner-account/practitioner-account';
import { PractitionerProfile } from '@/pages/practitioner/practitioner-profile/practitioner-profile';
import ROUTES from '@/routes/routes';
import ClassDashboard from '@/pages/client/client-dashboard/class-dashboard';
import { EditPractitionerProfile } from '@/pages/practitioner/edit-practitioner-profile/edit-practitioner-profile';
import { Training } from '@/pages/training/training';
import { StartVisitFromVisitDashboard } from '@/pages/client/visits-tab/start-visit';
import PregnancyVisits from '@/pages/client/visits-tab/pregnancy-visits';
import ChildVisits from '@/pages/client/visits-tab/child-visits';
import { PregnantProfile } from '@/pages/mom/pregnant-profile';
import { RecordEvent } from '@/pages/mom/pregnant-profile/visits/record-event';
import { StartVisit } from '@/pages/mom/pregnant-profile/visits/start-visit';
import { PastVisits } from '@/pages/mom/pregnant-profile/visits/past-visits';
import { AntenatalVisit } from '@/pages/mom/pregnant-profile/visits/antenatal-visit';
import { InfantProfile } from '@/pages/infant/infant-profile';
import { ActivityList } from '@/pages/infant/infant-profile/progress-tab/activity-list';
import { MomActivityList } from '@/pages/mom/pregnant-profile/progress-tab/activity-list';
import { RecordEvent as InfantRecordEvent } from '@/pages/infant/infant-profile/visits-tab/record-event';
import { PastVisits as InfantPastVisits } from '@/pages/infant/infant-profile/visits-tab/past-visits';
import { MotherContactAddress } from '@/pages/mom/pregnant-profile/contact/edit-address';
import { MotherContactNumber } from '@/pages/mom/pregnant-profile/contact/edit-number';
import { ChildContactNumber } from '@/pages/infant/infant-profile/contact-tab/edit-number';
import { ChildContactAddress } from '@/pages/infant/infant-profile/contact-tab/edit-address';
import { MultipleChildren } from '@/pages/infant/multiple-children';
import { InfantBackReferralUpdate } from '@/pages/infant/infant-profile/referrals-tab/update-back-referral';
import { MotherBackReferralUpdate } from '@/pages/mom/pregnant-profile/referrals-tab/update-back-referral';
import { Community } from '@/pages/community/community';
import Calendar from '@/pages/calendar/calendar-home';
import { CommunityWelcome } from '@/pages/community/welcome';
import { TeamTabInfoPage } from '@/pages/community/team-tab/team/info-page';
import { TeamPoints } from '@/pages/community/team-tab/team/points';
import { TeamPointsActivityDetails } from '@/pages/community/team-tab/team/points/activity-details';
import { TeamMembers } from '@/pages/community/team-tab/team/members';
import { TeamMemberProfile } from '@/pages/community/team-tab/team/members/member-profile';
import { TeamLeaderProfile } from '@/pages/community/team-tab/team/members/leader-profile';
import { AddBreastfeedingClub } from '@/pages/community/breastfeeding-clubs-tab/add-breastfeeding-club';
import {
  IndividualPointsMonthView,
  IndividualPointsYearView,
} from '@/pages/practitioner/individual-points';
import { IndividualPointsInfoPage } from '@/pages/practitioner/individual-points/info-page';

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
        path={ROUTES.CLIENTS.MOM_PROFILE.PROGRESS.ACTIVITIES_FORM}
        component={MomActivityList}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.VISITS.RECORD_EVENT}
        component={InfantRecordEvent}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.VISITS.PAST_VISITS}
        component={InfantPastVisits}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.VISITS.ANTENATAL_VISIT}
        component={ActivityList}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.VISIT_TAB.START_VISIT}
        component={StartVisitFromVisitDashboard}
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
        path={ROUTES.CLIENTS.MOM_PROFILE.CONTACT_TAB.UPDATE_ADDRESS}
        component={MotherContactAddress}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.CONTACT_TAB.UPDATE_NUMBERS}
        component={MotherContactNumber}
      />

      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.CONTACT_TAB.UPDATE_ADDRESS}
        component={ChildContactAddress}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.CONTACT_TAB.UPDATE_NUMBERS}
        component={ChildContactNumber}
      />
      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.MULTIPLE_CHILDREN}
        component={MultipleChildren}
      />

      <Route
        exact
        path={ROUTES.CLIENTS.INFANT_PROFILE.REFERRAL_TAB.UPDATE_BACK_REFERRAL}
        component={InfantBackReferralUpdate}
      />

      <Route
        exact
        path={ROUTES.CLIENTS.MOM_PROFILE.REFERRAL_TAB.UPDATE_BACK_REFERRAL}
        component={MotherBackReferralUpdate}
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
      <Route path={ROUTES.COMMUNITY.ROOT} component={Community} exact />
      <Route
        path={ROUTES.COMMUNITY.WELCOME}
        component={CommunityWelcome}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.INFO_PAGE}
        component={TeamTabInfoPage}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.POINTS.ROOT}
        component={TeamPoints}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.POINTS.ACTIVITY_DETAILS}
        component={TeamPointsActivityDetails}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.MEMBERS.ROOT}
        component={TeamMembers}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.MEMBERS.MEMBER_PROFILE}
        component={TeamMemberProfile}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.TEAM.MEMBERS.LEADER_PROFILE}
        component={TeamLeaderProfile}
        exact
      />
      <Route
        path={ROUTES.COMMUNITY.BREASTFEEDING_CLUBS.ADD}
        component={AddBreastfeedingClub}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.ROOT}
        component={IndividualPointsMonthView}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.YEAR_VIEW}
        component={IndividualPointsYearView}
        exact
      />
      <Route
        path={ROUTES.PRACTITIONER.INDIVIDUAL_POINTS.INFO_PAGE}
        component={IndividualPointsInfoPage}
        exact
      />
      <Route exact path={ROUTES.CALENDAR} component={Calendar} />
    </Switch>
  );
}

export { PublicRoutes, AuthRoutes };
