import * as Yup from 'yup';

export interface EditChildInformationModel {
  classroomGroupId: string;
}

export const initialEditChildInformationValues: EditChildInformationModel = {
  classroomGroupId: '',
};

export const editChildInformationSchema = Yup.object().shape({
  classroomGroupId: Yup.string().required(),
});
