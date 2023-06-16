import * as Yup from 'yup';

export interface ProgrammeDetailsModel {
  haveReadTheSmartStarterInformation: boolean | undefined;
  programmeName: string;
  programmeAddress: string;
  programmeType: string;
  ownTheProperty: boolean | undefined;
  haveTheTitleDeeds: boolean | undefined;
  unproclaimedLand: boolean | undefined;
  r4bPhoto: string | undefined;
}

export const initialProgrammeDetailsValues: ProgrammeDetailsModel = {
  haveReadTheSmartStarterInformation: false,
  programmeName: '',
  programmeAddress: '',
  programmeType: '',
  ownTheProperty: undefined,
  haveTheTitleDeeds: undefined,
  unproclaimedLand: undefined,
  r4bPhoto: '',
};

export const ProgrammeDetailsSchema = Yup.object().shape({
  haveReadTheSmartStarterInformation: Yup.boolean().required(),
  programmeName: Yup.string().required(),
  programmeAddress: Yup.string().required(),
  programmeType: Yup.string().required(),
  ownTheProperty: Yup.boolean().required(),
  haveTheTitleDeeds: Yup.boolean().required(),
  unproclaimedLand: Yup.boolean(),
  r4bPhoto: Yup.string().required(),
});
