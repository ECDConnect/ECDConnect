import {
  Alert,
  DialogPosition,
  Dialog,
  ButtonGroup,
  ButtonGroupTypes,
  renderIcon,
} from '@ecdlink/ui';
import { SuccessCard } from '@/components/success-card/success-card';
import { ReactComponent as CelebrateIcon } from '@/assets/celebrateIcon.svg';
import {
  Label,
  Header,
  TipCard,
} from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { HealthPromotion } from '../../components/health-promotion';
import { replaceBraces } from '@ecdlink/core';

export const clinicCheckupQuestion = `Has {client} been to the clinic for a postnatal check-up?`;
export const clinicCheckupSectionName = 'Clinic check-ups';

export const ClinicCheckupStep = ({
  infant,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions &&
        setQuestions([
          {
            visitSection: clinicCheckupSectionName,
            questions: [
              {
                question: clinicCheckupQuestion,
                answer: value,
              },
            ],
          },
        ]);
      setEnableButton?.(true);
    },
    [setEnableButton, setQuestions]
  );

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle="Clinic check-ups"
          section={clinicCheckupSectionName}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={clinicCheckupSectionName}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />

        <Label
          text={replaceBraces(
            clinicCheckupQuestion,
            infant?.caregiver?.firstName || ''
          )}
        />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={onOptionSelected}
        />
        {!!answer && (
          <SuccessCard
            customIcon={<CelebrateIcon className="h-14	w-14" />}
            text="Well done for keeping up with your clinic visits!"
            subText="Remember to go back to the clinic at 6 weeks for your baby’s immunisations."
            textColour="successDark"
            subTextColours="textDark"
            color="successBg"
          />
        )}
        {answer === false && (
          <Alert
            type="error"
            title={`Refer ${infant?.user?.firstName} & ${infant?.caregiver?.firstName} to the clinic`}
            customIcon={
              <div className="rounded-full">
                {renderIcon(
                  'ExclamationCircleIcon',
                  'text-errorMain w-10 h-10'
                )}
              </div>
            }
          />
        )}
      </div>
    </>
  );
};
