import * as Yup from 'yup';

export interface EditClassModel {
  id?: string;
  name?: string;
  classroomId?: string;
  meetEveryday: boolean;
  practitioner: string;
  meetingDays: number[];
  isFullDay: boolean;
}

export const editClassroomSchema = Yup.object().shape({
  name: Yup.string().required(),
  practitioner: Yup.string().required(),
  meetEveryday: Yup.boolean().required(),
  isFullDay: Yup.boolean().required(),
  meetingDays: Yup.array().when('meetEveryday', {
    is: true,
    then: Yup.array().ensure().compact().of(Yup.number().required()).required(),
    otherwise: Yup.array(),
  }),
});
