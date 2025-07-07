import * as Yup from 'yup';
import { SiteInformationDto } from '../models/dto/SiteInformation/site-information.dto';

export const initialSiteInformationValues: SiteInformationDto = {
  description: '',
  name: '',
};

export const siteInformationSchema = Yup.object().shape({
  name: Yup.string().required('Site Information Name is Required'),
});
