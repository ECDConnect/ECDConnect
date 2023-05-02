import * as Yup from 'yup';

export interface InfantRoadToHealthModel {
  weightAtBirth?: number;
  lengthAtBirth?: number;
  height?: number;
  roadToHealthBook?: string;
  notRoadToHealthBook?: boolean;
}

export const initialInfantRoadToHealthValues: InfantRoadToHealthModel = {
  weightAtBirth: 0,
  lengthAtBirth: 0,
  roadToHealthBook: '',
  notRoadToHealthBook: false,
};

export const infantRoadToHealthModelSchema = Yup.object().shape({
  weightAtBirth: Yup.string().required('Weight date is required'),
  lengthAtBirth: Yup.string().required('Length is required'),
  roadToHealthBook: Yup.string(),
  notRoadToHealthBook: Yup.boolean(),
});
