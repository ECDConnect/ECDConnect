import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  renderIcon,
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
import { useSelector } from 'react-redux';
import { getIsMotherFirstVisitSelector } from '@/store/mother/mother.selectors';
import AntenatalCareSvg from '@/assets/antenatalCare.svg';

export const antenatalClinicQuestion = `Has {client} gone to the clinic for her first antenatal visit?`;
export const clinicVisitsSectionName = 'Clinic visits';

export const ClinicVisitsStep = ({
  infant,
  mother,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();

  const motherName = useMemo(
    () => mother?.user?.firstName || '',
    [mother?.user?.firstName]
  );

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const question = useMemo(() => antenatalClinicQuestion, []);

  const isFirstVisit = useSelector(getIsMotherFirstVisitSelector);

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions &&
        setQuestions([
          {
            visitSection: clinicVisitsSectionName,
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
          sectionTitle={clinicVisitsSectionName}
          section={
            isFirstVisit
              ? 'Healthcare (first antenatal visit)'
              : 'Healthcare (after first visit)'
          }
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
        title={clinicVisitsSectionName}
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
