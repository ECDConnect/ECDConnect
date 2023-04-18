import { Button, FormInput, Typography } from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import { activitiesColours } from '../../../activities-list';
import {
  ChangeEvent,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import {
  getPreviousVisitInformationForInfantSelector,
  getVisitAnswersForInfantSelector,
} from '@/store/visit/visit.selectors';

// TODO: add this rule (G8.5.1) ->
// If there are multiple clients associated with the same caregiver, show additional steps with the client’s name (first example is a pregnant mom)

export const NotesStep = ({
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const question = 'Fill in any observations or notes';
  const [answer, setAnswer] = useState<string>();
  const [isPreviousNotes, setIsPreviousNotes] = useState(false);

  const visitSection = 'Notes';

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const previousNotes = useMemo(
    () => previousAnswers?.filter((item) => item.question === question),
    [previousAnswers]
  );

  // TODO: get the last visit data, it's necessary check the date from the last visit
  const previousNote = useMemo(() => {
    const insertedDate = previousVisit?.visitDataStatus?.[0]?.insertedDate;
    const date = !!insertedDate ? new Date(insertedDate) : undefined;
    const note = previousNotes?.find(
      (item) => item.question === question
    )?.questionAnswer;

    return { date, note };
  }, [previousNotes, previousVisit?.visitDataStatus]);

  const onOptionSelected = useCallback(
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value;

      setAnswer(value);
      setSectionQuestions?.([
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

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        icon="DocumentTextIcon"
        iconHexBackgroundColor={activitiesColours.other.primaryColor}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <FormInput
          label={question}
          subLabel="Optional"
          className={'mt-3'}
          textInputType="textarea"
          placeholder="E.g. Mom and baby seem happy and healthy."
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
