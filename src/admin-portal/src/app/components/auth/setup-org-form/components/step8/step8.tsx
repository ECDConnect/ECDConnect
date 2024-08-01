import { Alert, Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { ThumbUpIcon, ViewGridAddIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import { SetupOrgModel } from '../../../../../schemas/setup-org';
import { useEffect } from 'react';
import { Step1 } from './components/step1';
import { Step2 } from './components/step2';
import { Step3 } from './components/step3';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
  control?: any;
  setDisableButton?: (item: boolean) => void;
  setStep?: (item: number) => void;
}

export const Step8: React.FC<StepProps> = ({
  register,
  setValue,
  errors,
  getValues,
  control,
  setDisableButton,
  setStep,
}) => {
  return (
    <div>
      <div className="mt-12 mb-4 flex items-center gap-4">
        <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
          <ThumbUpIcon className="h-8 w-8 text-white" />
        </div>
        <Typography
          type="h1"
          color="textDark"
          text={`Confirm your responses`}
        />
      </div>
      <Typography
        type="body"
        color="textMid"
        text={`ECD Connect has been built in a modular way to support a broad range of ECD service providers. You are able to select which app features you want your users to have access to.`}
      />
      <Button
        className="mt-8 w-3/12 rounded-2xl"
        icon={'PencilIcon'}
        type="filled"
        color="secondary"
        textColor="white"
        text={'Edit my responses'}
        onClick={() => setStep(1)}
      />
      <Divider dividerType="dashed" className="my-4" />
      <Step1 getValues={getValues} />
      <Divider dividerType="dashed" className="my-6" />
      <Step2 getValues={getValues} />
      <Divider dividerType="dashed" className="my-6" />
      <Step3 getValues={getValues} />
      <Divider dividerType="dashed" className="my-6" />
    </div>
  );
};
