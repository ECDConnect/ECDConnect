import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Typography,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { HealthPromotion } from '../../../../components/health-promotion';
import { replaceBraces } from '@ecdlink/core';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';

export const HIVSection = `HIV care & medication`;
export const HIVQuestion = `Is {client} HIV positive?`;

export const HivCareAndMedicationStep = ({
  mother,
  sectionQuestions: questions,
  isTipPage,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const [answer, setAnswer] = useState<boolean | boolean[] | string>();

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
    { text: 'Unsure', value: 'unsure' },
  ];

  const question = useMemo(() => HIVQuestion, []);

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions &&
        setQuestions([
          {
            visitSection: HIVSection,
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

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${name}`}
          subTitle={HIVSection}
          section={HIVSection}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={HIVSection}
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
          <ButtonGroup<boolean | string>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={onOptionSelected}
          />
          {answer === true && (
            <Alert
              type="warning"
              title={`${name} is HIV positive`}
              titleColor="textDark"
              message={`Discuss HIV care & medication with ${name}.`}
              messageColor="textMid"
              customIcon={
                <div className="bg-tertiary h-16 w-16 rounded-full">
                  <Polly className="h-16 w-16" />
                </div>
              }
            />
          )}
        </div>
      </div>
    </>
  );
};
