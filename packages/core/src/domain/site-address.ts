import { ProvinceDto } from '../models/dto/StaticData/province.dto';
import { EntityCacheBase } from './entity-cache-base';

export interface SiteAddress extends EntityCacheBase {
  id?: number;
  name: string;
  addressLine1: string;
  addressLine2: string;
  addressLine3: string;
  postalCode: string;
  ward: string;
  provinceId?: number;
  province?: ProvinceDto;
}
