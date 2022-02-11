
import { EntityBase } from '../entity-base';
import { ProvinceDto } from '../StaticData/province.dto';


export interface SiteAddressDto extends EntityBase {  
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  ward: string;
  provinceId?: string;
  province?: ProvinceDto;
}
