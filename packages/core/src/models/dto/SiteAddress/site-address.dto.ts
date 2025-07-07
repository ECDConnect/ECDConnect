import { EntityBase } from '../entity-base';
import { ProvinceDto } from '../StaticData/province.dto';

export interface SiteAddressDto extends EntityBase {
  area?: string | null;
  name?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  addressLine3?: string | null;
  latitude?: string | null;
  longitude?: string | null;
  municipality?: string | null;
  postalCode?: string | null;
  provinceId?: string | null;
  province?: ProvinceDto | null;
  ward?: string | null;
}
