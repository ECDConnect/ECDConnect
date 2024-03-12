import { ProvinceDto } from '../StaticData';

export interface DistrictDto {
  id: string;
  name: string;
  province: ProvinceDto;
}
