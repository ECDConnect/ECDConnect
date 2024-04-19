import {
  Alert,
  DialogPosition,
  Dialog,
  Button,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { ReactComponent as Polly } from '@/assets/momImageSvg.svg';
import { Header, TipCard } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import {
  ChangeEvent,
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { HealthPromotion } from '../../../../components/health-promotion';
import { useSelector } from 'react-redux';
import { getVisitAnswersForInfantSelector } from '@/store/visit/visit.selectors';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import { RootState } from '@/store/types';
import {
  getInfantPreviousVisitSelector,
  getInfantVisitByVisitIdSelector,
} from '@/store/infant/infant.selectors';

export const FormulaMilkNotesStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const [isPreviousNotes, setIsPreviousNotes] = useState(false);
  const [answer, setAnswer] = useState<string>();

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );
  const visitSection = 'Formula milk only';
  const noteQuestion = 'Add a note';

  const { visitId } = useParams<InfantProfileParams>();

  const visit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, visit?.plannedVisitDate || '')
  );

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const previousNotes = useMemo(
    () => previousAnswers?.filter((item) => item.question === noteQuestion),
    [previousAnswers]
  );

  const previousNote = useMemo(() => {
    const insertedDate = previousPlannedVisit?.plannedVisitDate;
    const date = !!insertedDate ? new Date(insertedDate) : undefined;
    const note = previousNotes?.find(
      (item) => item.question === noteQuestion
    )?.questionAnswer;

    return { date, note };
  }, [previousNotes, previousPlannedVisit?.plannedVisitDate]);

  const onOptionSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setAnswer(value);
      setSectionQuestions?.([
        {
          visitSection,
          questions: [
            {
              question: noteQuestion,
              answer: value,
            },
          ],
        },
      ]);
    },
    [setSectionQuestions]
  );

  const renderNote = useCallback((date: Date, note: string) => {
    return (
      <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
        <Typography
          type="h3"
          text={`Notes from ${date.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'long',
          })} visit`}
          color="textDark"
        />
        <Typography type="body" text={note || ''} color="textMid" />
      </div>
    );
  }, []);

  useEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${caregiverName}`}
          subTitle={visitSection}
          section={visitSection}
          sectionTitle="Pillar 1: Nutrition (first visit)"
          client={caregiverName}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Formula milk only"
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="warning"
          title={`Discuss formula feeding with ${caregiverName}.`}
          titleColor="textDark"
          customIcon={
            <div className="bg-tertiary h-16 w-16 rounded-full">
              <Polly className="h-16 w-16" />
            </div>
          }
        />
        <FormInput
          label={noteQuestion}
          subLabel="Optional"
          className={'mt-3'}
          textInputType="textarea"
          placeholder={'E.g. Not able to breastfeed for health reasons.'}
          value={answer}
          onChange={onOptionSelected}
        />
        {!!previousNote.date &&
          !!previousNote.note &&
          renderNote(previousNote.date, previousNote.note)}
        {isPreviousNotes &&
          previousNotes?.map((item) =>
            renderNote(new Date(item.insertedDate), item.questionAnswer || '')
          )}
        {Number(previousNotes?.length) > 1 && (
          <Button
            type="outlined"
            color="primary"
            textColor="primary"
            text={
              isPreviousNotes ? 'Hide previous notes' : 'See previous notes'
            }
            icon="DocumentTextIcon"
            onClick={() => setIsPreviousNotes((prevState) => !prevState)}
          />
        )}
      </div>
    </>
  );
};
