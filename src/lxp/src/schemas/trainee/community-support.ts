import * as Yup from 'yup';

export interface CommunitySupportModel {
  haveSupport: boolean;
}

export const initialCommunitySupportValues: CommunitySupportModel = {
  haveSupport: false,
};

export const CommunitySupportSchema = Yup.object().shape({
  haveSupport: Yup.boolean().required(),
});
