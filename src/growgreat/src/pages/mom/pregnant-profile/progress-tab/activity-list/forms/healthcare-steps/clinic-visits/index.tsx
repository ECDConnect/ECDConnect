import { Alert, ButtonGroup, ButtonGroupTypes, renderIcon } from '@ecdlink/ui';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import {
  Label,
  Header,
  TipCard,
} from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { HealthPromotion } from '../../components/health-promotion';
import { replaceBraces } from '@ecdlink/core';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';

export const ClinicVisitsStep = ({
  infant,
  mother,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();

  const sectionName = 'Clinic visits';

  const motherName = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const question = useMemo(
    () => `Has {client} gone to the clinic for her first antenatal visit?`,
    []
  );

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions &&
        setQuestions([
          {
            visitSection: sectionName,
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
    [question, setEnableButton, setQuestions]
  );

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${motherName}`}
        subTitle="Clinic check-ups"
        section={sectionName}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={AntenatalCareSvg}
        title={sectionName}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <Label text={replaceBraces(question, mother?.user?.firstName || '')} />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={onOptionSelected}
        />
        {answer === false && (
          <Alert
            type="error"
            title={`Encourage ${mother?.user?.firstName} to visit the clinic as early as possible and before 20 weeks of pregnancy.`}
            customIcon={
              <div className="rounded-full">
                {renderIcon(
                  'ExclamationCircleIcon',
                  'text-errorMain w-10 h-10'
                )}
              </div>
            }
            list={[
              `Help ${mother?.user?.firstName} plan when they will go to the clinic and how they will get there.`,
            ]}
          />
        )}
      </div>
    </>
  );
};
