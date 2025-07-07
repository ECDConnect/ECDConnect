import { ProvinceDto } from './province.dto';

export type SiteAddressDto = {
  id: string;
  area: string | null;
  name: string;
  addressLine1: string | null;
  addressLine2: string | null;
  addressLine3: string | null;
  latitude: string | null;
  longitude: string | null;
  municipality: string | null;
  postalCode: string | null;
  province: ProvinceDto | null;
  provinceId: string | null;
  ward: string | null;
};
