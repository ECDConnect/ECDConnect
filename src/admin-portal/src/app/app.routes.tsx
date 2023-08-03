import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Login from './components/auth/login/login';
import Register from './components/auth/register-user/register';
import Shell from './containers/shell/shell';
import ContentManagement from './pages/content-management/content-management';
import Dashboard from './pages/dashboard/dashboard';
import Documents from './pages/documents/documents';
import { Preview } from './pages/preview/preview';
import Profile from './pages/profile/profile';
import ViewUser from './pages/view-user/view-user';
import Reports from './pages/reports/reports';
import Roles from './pages/roles/roles';
import Settings from './pages/settings/settings';
import GeneralSettingsView from './pages/settings/sub-pages/general-settings/general-settings';
import NavigationSetup from './pages/settings/sub-pages/navigation/navigation';
import Theme from './pages/settings/sub-pages/theme/theme';
import StaticData from './pages/static-data/static-data';
import AttendingReasonsView from './pages/static-data/sub-pages/attending-reasons/attending-reasons';
import EducationLevelView from './pages/static-data/sub-pages/education-levels/education-levels';
import GenderView from './pages/static-data/sub-pages/gender/gender';
import GrantView from './pages/static-data/sub-pages/grants/grants';
import LanguageView from './pages/static-data/sub-pages/language/language';
import ProvinceView from './pages/static-data/sub-pages/provinces/provinces';
import RaceView from './pages/static-data/sub-pages/race/race';
import ReasonForLeavingView from './pages/static-data/sub-pages/reason-for-leaving/reason-for-leaving';
import RelationsView from './pages/static-data/sub-pages/relations/relations';
import ApplicationAdmins from './pages/users/sub-pages/application-admins/application-admins';
import Children from './pages/users/sub-pages/children/children';
import Coaches from './pages/users/sub-pages/coaches/coaches';
import HealthCareWorkers from './pages/users/sub-pages/health-care-worker/health-care-worker';
import Infants from './pages/users/sub-pages/infant/infant';
import Mothers from './pages/users/sub-pages/mother/mother';
import Practitioners from './pages/users/sub-pages/practitioners/practitioners';
import Franchisors from './pages/users/sub-pages/franchisors/franchisors';
import Users from './pages/users/users';
import Clinics from './pages/users/sub-pages/clincs/clinics';
import TeamLeads from './pages/users/sub-pages/team-leads/team-leads';
import ForgotPassword from './components/auth/forgot-password/forgot-password';
import ResetPassword from './components/auth/reset-password/reset-password';
import ApplicationUsers from './pages/users/sub-pages/application-users/application-users';
import UploadBulkUser from './pages/upload-bulk-users/upload-bulk-users';
import TermsPage from './pages/terms/terms';

const PublicRoutes: React.FC = () => {
  return (
    <Switch>
      <Route exact path="/" component={Login} />
      <Route exact path="/register/:resetToken" component={Register} />
      <Route exact path="/forgot-password" component={ForgotPassword} />
      <Route exact path="/reset/:resetToken/:email" component={ResetPassword} />
      <Route path={`/ecd-terms`} component={TermsPage}></Route>
    </Switch>
  );
};

const MainRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path="/" component={Shell}></Route>
    </Switch>
  );
};

const AuthRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path={`/dashboard`} component={Dashboard}></Route>
      <Route path={`/settings`} component={Settings}></Route>
      <Route path={`/data`} component={StaticData}></Route>
      <Route path={`/profile`} component={Profile}></Route>
      <Route path={`/upload-users`} component={UploadBulkUser}></Route>
      <Route path={`/users`} component={Users}></Route>
      <Route path={`/documents`} component={Documents}></Route>
      <Route path={`/content-management`} component={ContentManagement}></Route>
      <Route path={`/Reports`} component={Reports}></Route>
      <Route path={`/roles`} component={Roles}></Route>
    </Switch>
  );
};

const SettingsRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path={`/settings/theme`} component={Theme}></Route>
      <Route path={`/settings/general`} component={GeneralSettingsView}></Route>
      <Route path={`/settings/preview`} component={Preview}></Route>
      <Route path={`/settings/navigation`} component={NavigationSetup}></Route>
    </Switch>
  );
};

const UserRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path={`/users/roles`} component={Roles}></Route>
      <Route path={`/users/all-roles`} component={ApplicationUsers}></Route>
      <Route path={`/users/roles`} component={Roles}></Route>
      <Route path={`/users/view-user`} component={ViewUser}></Route>
      <Route path={`/users/admins`} component={ApplicationAdmins}></Route>
      <Route path={`/users/franchisors`} component={Franchisors}></Route>
      <Route path={`/users/coaches`} component={Coaches}></Route>
      <Route path={`/users/practitioners`} component={Practitioners}></Route>
      <Route path={`/users/clinics`} component={Clinics}></Route>
      <Route path={`/users/team-leads`} component={TeamLeads}></Route>
      <Route
        path={`/users/health-care-worker`}
        component={HealthCareWorkers}
      ></Route>
      <Route path={`/users/mother`} component={Mothers}></Route>
      <Route path={`/users/infant`} component={Infants}></Route>
      <Route path={`/users/children`} component={Children}></Route>
    </Switch>
  );
};

const StaticDataRoutes: React.FC = () => {
  return (
    <Switch>
      <Route path={`/data/sex`} component={GenderView}></Route>
      <Route path={`/data/race`} component={RaceView}></Route>
      <Route path={`/data/languages`} component={LanguageView}></Route>
      <Route path={`/data/provinces`} component={ProvinceView}></Route>
      <Route path={`/data/grants`} component={GrantView}></Route>
      <Route
        path={`/data/education-levels`}
        component={EducationLevelView}
      ></Route>
      <Route
        path={`/data/attending-reasons`}
        component={AttendingReasonsView}
      ></Route>
      <Route path={`/data/relations`} component={RelationsView}></Route>
      <Route
        path={`/data/reasons-for-leaving`}
        component={ReasonForLeavingView}
      ></Route>
    </Switch>
  );
};

export {
  PublicRoutes,
  AuthRoutes,
  MainRoutes,
  SettingsRoutes,
  StaticDataRoutes,
  UserRoutes,
};
