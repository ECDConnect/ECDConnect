import { Button, Typography } from '@ecdlink/ui';
import imgMocked from './mocked.png';
import { DynamicFormProps } from '../../dynamic-form';

export const ResourcesStep = ({
  name,
  sectionQuestions: questions,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <Typography
          type="h4"
          color="black"
          text={`Show ${name} these pictures of healthy foods she could add to her diet:`}
        />
        <div className="flex items-center gap-8">
          <img
            alt="infographic"
            className="h-32 w-32 rounded-2xl object-cover"
            src={imgMocked}
          />
          <Button
            type="filled"
            color="secondaryAccent2"
            text="Share this image"
            icon="DownloadIcon"
            textColor="secondary"
            iconPosition="end"
            className="h-8"
            onClick={() => setIsTip && setIsTip(true)}
          />
        </div>
      </div>
    </>
  );
};
