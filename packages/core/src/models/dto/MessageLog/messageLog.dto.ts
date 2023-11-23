import { EntityBase } from '../entity-base';
export interface MessageLogDto extends EntityBase {
  districtId?: string;
  wardName?: string;
  provinceId?: string;
  sendByUserId: string;
  message: string;
  messageDate: Date;
  messageTime: string;
  subject: string;
  toGroups: string;
  roleIds: string[];
  roleNames: string;
}
