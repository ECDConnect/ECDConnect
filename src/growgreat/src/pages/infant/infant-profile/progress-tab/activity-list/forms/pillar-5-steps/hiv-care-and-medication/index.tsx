import {
  Alert,
  DialogPosition,
  Dialog,
  ButtonGroup,
  ButtonGroupTypes,
  Typography,
} from '@ecdlink/ui';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P5 from '@/assets/pillar/p5.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState, useEffect } from 'react';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { replaceBraces } from '@ecdlink/core';
import { HealthPromotion } from '../../components/health-promotion';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/types';
import { getVisitAnswersForInfantSelector } from '@/store/visit/visit.selectors';
import {
  getInfantNearestPreviousVisitByOrderDate,
  getInfantVisitByVisitIdSelector,
} from '@/store/infant/infant.selectors';
import { useParams } from 'react-router';
import { InfantProfileParams } from '../../../../../infant-profile.types';

export const HIVQuestion = `Is {client} HIV positive?`;
export const HIVSection = 'HIV care & medication';

export const HIVCareAndMedicationStep = ({
  infant,
  isTipPage,
  setIsTip,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[] | string>();

  const { visitId } = useParams<InfantProfileParams>();

  const visit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);
  const previousVisit = useSelector((state: RootState) =>
    getInfantNearestPreviousVisitByOrderDate(state, visit)
  );

  const previousHIVAnswer = previousAnswers?.find(
    (item) =>
      item.question === HIVQuestion && item.visitId === previousVisit?.id
  )?.questionAnswer;

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

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
      setEnableButton?.(true);
    },
    [question, setEnableButton, setQuestions]
  );

  useEffect(() => {
    if (previousHIVAnswer === 'true') {
      setAnswer(true);
      setQuestions &&
        setQuestions([
          {
            visitSection: HIVSection,
            questions: [
              {
                question,
                answer: true,
              },
            ],
          },
        ]);
      setEnableButton?.(true);
    }
  }, [previousHIVAnswer, question, setEnableButton, setQuestions]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle="HIV care & medication"
          section="HIV care & medication"
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={P5}
        title={HIVSection}
        iconHexBackgroundColor={activitiesColours.pillar5.primaryColor}
        hexBackgroundColor={activitiesColours.pillar5.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        {previousHIVAnswer! !== 'true' && (
          <>
            <Typography
              type="body"
              text={replaceBraces(question, caregiverName)}
            />
            <ButtonGroup<boolean | string>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={options}
              onOptionSelected={onOptionSelected}
            />
          </>
        )}
        {(answer === true || previousHIVAnswer === 'true') && (
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
