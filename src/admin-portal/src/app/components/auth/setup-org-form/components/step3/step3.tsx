import { Typography } from '@ecdlink/ui';
import { PhotographIcon } from '@heroicons/react/solid';
import { FieldErrors, UseFormRegister, UseFormSetValue } from 'react-hook-form';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
}

export const Step3: React.FC<StepProps> = ({ register, errors }) => {
  return (
    <div>
      <div className="mt-12 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="bg-tertiary justify-enter flex h-12 w-12 items-center rounded-full p-2">
            <PhotographIcon className="h-8 w-8 text-white" />
          </div>
          <Typography type="h1" color="textDark" text={`Add your logos`} />
        </div>
        <Typography
          type="body"
          color="textMid"
          text={`You will be able to update these on the admin portal in future.`}
        />
      </div>
      <div className="my-12 grid grid-cols-3">
        <div>
          <Typography
            type="h3"
            color="textDark"
            text={`Dark version (svg, png, jpeg):`}
          />
          <Typography
            type="help"
            color="textMid"
            text={`This version will be placed on a light background.`}
          />
          <Typography
            text={`Size limit: <b class='text-errorMain'>ABC </b><span class='text-textMid'>MB</span>`}
            type={'markdown'}
            color="textDark"
            className="my-8"
          />
        </div>
      </div>
    </div>
  );
};
