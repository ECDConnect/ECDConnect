import { DistrictDto } from './distric.dto';

export interface SubDistrictDto {
  id: string;
  name: string;
  district: DistrictDto;
}
