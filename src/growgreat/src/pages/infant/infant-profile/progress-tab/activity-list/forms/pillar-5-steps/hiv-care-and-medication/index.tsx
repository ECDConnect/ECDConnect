import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P5 from '@/assets/pillar/p5.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { HealthPromotion } from './health-promotion';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { replaceBraces } from '@ecdlink/core';

export const HIVCareAndMedicationStep = ({
  infant,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[] | string>();

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const visitSection = 'Child documentation';

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
    { text: 'Unsure', value: 'unsure' },
  ];

  const question = useMemo(() => `Is {client} HIV positive?`, []);

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions &&
        setQuestions([
          {
            visitSection,
            questions: [
              {
                question,
                answer: value,
              },
            ],
          },
        ]);
      setEnableButton?.(true);
    },
    [question, setEnableButton, setQuestions]
  );

  if (isTipPage) {
    return (
      <HealthPromotion
        clientName={caregiverName}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P5}
        title={visitSection}
        iconHexBackgroundColor={activitiesColours.pillar5.primaryColor}
        hexBackgroundColor={activitiesColours.pillar5.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Typography type="body" text={replaceBraces(question, caregiverName)} />
        <ButtonGroup<boolean | string>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={onOptionSelected}
        />
        {answer === true && (
          <Alert
            type="warning"
            title={`${caregiverName} is HIV positive`}
            titleColor="textDark"
            message={`Discuss HIV care & medication with ${caregiverName}.`}
            messageColor="textMid"
            customIcon={
              <div className="bg-tertiary h-16 w-16 rounded-full">
                <Polly className="h-16 w-16" />
              </div>
            }
          />
        )}
      </div>
    </>
  );
};
