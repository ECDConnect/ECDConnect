import { useMemo } from 'react';
import {
  Button,
  Dialog,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import imgMocked from './mocked.png';
import { dietFormQuestion } from '../nutrition-eating';
import { noneOption } from '../nutrition-eating/options';
import { DynamicFormProps } from '../../dynamic-form';

export const ResourcesStep = ({
  mother,
  sectionQuestions: questions,
  setIsTip,
  setEnableButton,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const answers = questions
    ?.flatMap((section) => section.questions)
    .find((question) => question.question === dietFormQuestion)
    ?.answer as string[];

  const count = answers?.includes(noneOption) ? 0 : answers?.length;

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <Divider dividerType="dashed" />
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
