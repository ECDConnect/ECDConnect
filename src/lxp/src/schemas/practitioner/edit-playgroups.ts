import { ClassProgrammeDto } from '@ecdlink/core';
import * as Yup from 'yup';

export interface EditPlaygroupModel {
  groupName?: string;
  classroomGroupId: string;
  classroomId?: string;
  name: string;
  meetingDays: number[];
  isFullDay?: boolean;
  userId?: string;
  id?: string;
}

export interface EditGroupedPlaygroupModel {
  groupName: string;
  key: number;
  groups: ClassProgrammeDto[];
}

export const editPlaygroupSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^(?!(unsure)$).+$/gi, {
      excludeEmptyString: true,
      message: 'You cannot use Unsure as a playgroup name',
    })
    .required('This field is required'),
  meetingDays: Yup.number().required(),
  isFullDay: Yup.boolean(),
});
