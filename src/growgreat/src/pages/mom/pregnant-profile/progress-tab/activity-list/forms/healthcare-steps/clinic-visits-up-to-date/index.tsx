import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
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
import { ReactComponent as PollyHappy } from '@/assets/pollyHappy.svg';
import { ReactComponent as PollySad } from '@/assets/pollySad.svg';

export const ClinicVisitsUpToDateStep = ({
  mother,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();

  const sectionName = 'Clinic visits up to date';

  const motherName = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const question = useMemo(
    () => `Is {client} up to date with their antenatal clinic visits?`,
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
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${motherName}`}
          subTitle="Clinic check-ups"
          sectionTitle={'Clinic visits'}
          section={'Care for mom'}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={AntenatalCareSvg}
        title={`Clinic visits`}
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
        {!!answer && (
          <div className="flex flex-col gap-4 p-4">
            <Alert
              type="warning"
              title={`Great!`}
              message={`Encourage ${mother?.user?.firstName} to stay up to date.`}
              titleColor="textDark"
              messageColor="textMid"
              customIcon={
                <div className="bg-tertiary h-14 w-14 rounded-full">
                  <PollyHappy className="h-14 w-14" />
                </div>
              }
            />
          </div>
        )}
        {answer === false && (
          <div className="flex flex-col gap-4 p-4">
            <Alert
              type="warning"
              title={`Oh no!`}
              message={`Encourage ${mother?.user?.firstName} to book as soon as possible.`}
              titleColor="textDark"
              messageColor="textMid"
              customIcon={
                <div className="bg-tertiary h-14 w-14 rounded-full">
                  <PollySad className="h-14 w-14" />
                </div>
              }
            />
          </div>
        )}
      </div>
    </>
  );
};
