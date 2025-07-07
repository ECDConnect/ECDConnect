import { Typography } from '@ecdlink/ui';
import { PhotographIcon } from '@heroicons/react/solid';
import {
  FieldErrors,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from 'react-hook-form';
import FormFileInput from '../../../../form-file-input/form-file-input';

interface StepProps {
  setValue: UseFormSetValue<any>;
  register: UseFormRegister<any>;
  errors: FieldErrors;
  getValues?: UseFormGetValues<any>;
}

export const Step3: React.FC<StepProps> = ({ setValue, getValues }) => {
  const acceptedFormats = ['svg', 'png', 'PNG', 'jpg', 'JPG', 'jpeg'];
  const icoAcceptFormat = ['ico'];
  const allowedFileSize = 13631488;

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
      <div className="my-12 grid w-full grid-cols-3 gap-8">
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
            text={`Size limit: <b class='text-errorMain'>${
              allowedFileSize / (1024 * 1024)
            } </b><span class='text-textMid'>MB</span>`}
            type={'markdown'}
            color="textDark"
            className="my-8"
          />
          <FormFileInput
            acceptedFormats={acceptedFormats}
            label={''}
            hideAcceptedFormats={true}
            nameProp={'darkVersionLogo'}
            returnFullUrl={true}
            setValue={setValue}
            isImage={true}
            allowedFileSize={allowedFileSize}
            contentUrl={getValues()?.darkVersionLogo}
            isWizardComponent={true}
            hideFileName={true}
          />
        </div>
        <div>
          <Typography
            type="h3"
            color="textDark"
            text={`Light version (svg, png, jpeg):`}
          />
          <Typography
            type="help"
            color="textMid"
            text={`This version will be placed on a dark background. `}
          />
          <Typography
            text={`Size limit: <b class='text-errorMain'>${
              allowedFileSize / (1024 * 1024)
            } </b><span class='text-textMid'>MB</span>`}
            type={'markdown'}
            color="textDark"
            className="my-8"
          />
          <FormFileInput
            acceptedFormats={acceptedFormats}
            label={''}
            hideAcceptedFormats={true}
            nameProp={'lightVersionLogo'}
            returnFullUrl={true}
            setValue={setValue}
            isImage={true}
            allowedFileSize={allowedFileSize}
            contentUrl={getValues()?.lightVersionLogo}
            isWizardComponent={true}
            hideFileName={true}
          />
        </div>
        <div>
          <Typography type="h3" color="textDark" text={`Favicon (ico):`} />
          <Typography
            type="help"
            color="textMid"
            text={`This version will be shown on the browser tab and app icon. You can use a free online service like favicon.io to convert your logo to a favicon. Choose the filename ending with “.ico”.`}
          />
          <Typography
            text={`Size limit: <b class='text-errorMain'>${
              allowedFileSize / (1024 * 1024)
            } </b><span class='text-textMid'>MB</span>`}
            type={'markdown'}
            color="textDark"
            className="mt-4 mb-2"
          />
          <FormFileInput
            acceptedFormats={icoAcceptFormat}
            label={''}
            hideAcceptedFormats={true}
            nameProp={'favicon'}
            returnFullUrl={true}
            setValue={setValue}
            isImage={true}
            allowedFileSize={allowedFileSize}
            contentUrl={getValues()?.favicon}
            isWizardComponent={true}
            hideFileName={true}
          />
        </div>
      </div>
    </div>
  );
};
