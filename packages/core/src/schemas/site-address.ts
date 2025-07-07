import * as Yup from 'yup';
import { SiteAddressDto } from '../models/dto/SiteAddress/site-address.dto';

export const initialSiteAddressValues: SiteAddressDto = {
  name: '',
  addressLine1: '',
  addressLine2: '',
  addressLine3: '',
  postalCode: '',
  ward: '',
  provinceId: '',
};

export const siteAddressSchema = Yup.object().shape({
  name: Yup.string(),
  addressLine1: Yup.string(),
  addressLine2: Yup.string(),
  addressLine3: Yup.string(),
  postalCode: Yup.string(),
  ward: Yup.string(),
  provinceId: Yup.string(),
});
