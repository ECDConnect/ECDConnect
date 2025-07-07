import { ClassProgrammeDto } from '@ecdlink/core';
import * as Yup from 'yup';

export interface EditPlaygroupModel {
  groupName?: string;
  classroomGroupId: string;
  classroomId?: string;
  name: string;
  meetingDays: number[];
  meetEveryday: boolean | undefined;
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
    }),
  meetingDays: Yup.array().when('meetEveryday', {
    is: true,
    then: Yup.array().ensure().compact().of(Yup.number().required()).required(),
    otherwise: Yup.array(),
  }),
  isFullDay: Yup.boolean(),
  meetEveryday: Yup.boolean().required(),
});
