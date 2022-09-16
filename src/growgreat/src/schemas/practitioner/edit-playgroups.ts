import { ClassProgrammeDto } from '@ecdlink/core';
import * as Yup from 'yup';

export interface EditPlaygroupModel {
  groupName?: string;
  classroomGroupId: string;
  classroomId?: string;
  name: string;
  meetingDays: number[];
  isFullDay?: boolean;
}

export interface EditGroupedPlaygroupModel {
  groupName: string;
  key: number;
  groups: ClassProgrammeDto[];
}

export const editPlaygroupSchema = Yup.object().shape({
  name: Yup.string().required(),
  meetingDays: Yup.number().required(),
  isFullDay: Yup.boolean().required(),
});
