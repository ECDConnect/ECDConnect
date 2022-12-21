import * as Yup from 'yup';

export const initialTenantValues = {
  adminSiteAddress: '',
  applicationName: '',
  organisationName: '',
  siteAddress: '',
  themePathVar: '',
  tenantType: '',
  var1: '',
  var2: '',
  moodleUrlVar: '',
  Id: '',
};

export const tenantSchema = Yup.object().shape({
  adminSiteAddress: Yup.string(),
  applicationName: Yup.string(),
  organisationName: Yup.string(),
  siteAddress: Yup.string(),
  themePathVar: Yup.string(),
  tenantType: Yup.string(),
  var1: Yup.string(),
  var2: Yup.string(),
  moodleUrlVar: Yup.string(),
  Id: Yup.string(),
});
