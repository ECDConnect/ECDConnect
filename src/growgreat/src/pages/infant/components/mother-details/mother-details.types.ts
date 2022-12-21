import { FormComponentProps } from '@ecdlink/core';
import { PregnantRegisterModel } from '@/schemas/pregnant/pregnant-register-form';
import { InfantDetailsModel } from '@/schemas/infant/infant-details';
import { MultipleChildrenProps } from '../../infant-register-form/infant-register-form.types';

export interface MotherDetailsProps
  extends FormComponentProps<PregnantRegisterModel> {
  name?: string;
  surname?: string;
  age?: string;
  setContactInformation?: any;
  setAddress?: any;
  setIsAlreadyClient?: any;
  isAlreadyClient?: boolean;
  relationshipId?: string;
  infantDetails?: InfantDetailsModel;
  multipleChildrenArray?: MultipleChildrenProps[];
  setMultipleChildrenArray?: any;
  isMother?: boolean;
}

export const yesNoOptions = [
  { text: 'Yes', value: true },
  { text: 'No', value: false },
];

// TODO: this CAN NOT be hard coded needs to come from DB
export const relationshipTypes = [
  { label: 'Mother', value: '568a219f-f1b9-41ac-bf38-143d8d749a39' },
  { label: 'Father', value: 'c3dd6d6c-e120-4a9f-90ab-3a8bd8ab7fdc' },
  { label: 'Grandmother', value: '95095d04-6990-4a34-ba76-23000e52e1fb' },
  { label: 'Grandfather', value: '95095d04-6990-4a34-ba76-23000e52e1fa' },
  { label: 'Guardian', value: '8fc60d17-57be-4b46-aed9-ca035c560848' },
];
