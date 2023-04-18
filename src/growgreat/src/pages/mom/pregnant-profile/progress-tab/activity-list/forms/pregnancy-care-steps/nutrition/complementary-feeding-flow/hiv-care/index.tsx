import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { HealthPromotion } from '../../../../components/health-promotion';
import { replaceBraces } from '@ecdlink/core';

export const HivCareAndMedicationStep = ({
  mother,
  sectionQuestions: questions,
  isTipPage,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const visitSection = `HIV care & medication`;

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
    { text: 'Unsure', value: undefined },
  ];

  const question = useMemo(() => `Is {client} HIV positive?`, []);

  const onOptionSelected = useCallback(
    (value) => {
      setQuestions &&
        setQuestions([
          {
            visitSection: visitSection,
            questions: [
              {
                question,
                answer: value,
              },
            ],
          },
        ]);
      setEnableButton && setEnableButton(true);
    },
    [question, setEnableButton, setQuestions, visitSection]
  );

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${name}`}
        subTitle={visitSection}
        section={visitSection}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <div className="mt-2 flex flex-col gap-2">
          <Typography
            type="body"
            text={`Refer to ${name} Maternal Health Record. ${replaceBraces(
              question,
              name
            )}`}
            color="textDark"
          />
          <ButtonGroup<boolean | undefined>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={onOptionSelected}
          />
        </div>
      </div>
    </>
  );
};
