import {
  Alert,
  Divider,
  FormInput,
  LoadingSpinner,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from 'react';
import { replaceBraces, usePrevious } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import {
  getCurrentCoachPractitionerVisitByUserId,
  getPreviousCoachVisitByUserId,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import { currentActivityKey } from '../..';
import { useAppDispatch } from '@/store';
import { PqaActions, getVisitDataForVisitId } from '@/store/pqa/pqa.actions';
import { useParams } from 'react-router';
import { PractitionerJourneyParams } from '../../../coach-practitioner-journey.types';
import { Maybe } from 'graphql/jsutils/Maybe';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';

export const DiscussionNotes = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<string | Maybe<string> | undefined>('');

  const question = `What next steps or plans to improve did you discuss with {client}?`;
  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Discussion notes';

  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const appDispatch = useAppDispatch();

  const { isLoading } = useThunkFetchCall(
    'pqa',
    PqaActions.GET_VISIT_DATA_FOR_VISIT_ID
  );
  const wasLoading = usePrevious(isLoading);

  const { practitionerId } = useParams<PractitionerJourneyParams>();

  const previousVisit = useSelector(
    getPreviousCoachVisitByUserId(activityName, smartStarter?.userId!)
  );
  const currentVisit = useSelector(
    getCurrentCoachPractitionerVisitByUserId(
      activityName,
      smartStarter?.userId!
    )
  );
  const firstVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(previousVisit?.id, 'prePqaPreviousFormData')
  );

  const discussionNotesAnswer = firstVisitAnswers?.find(
    (item) => item.visitSection === visitSection
  );
  const isFollowUp = !!discussionNotesAnswer;

  const previousVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(currentVisit?.id, 'prePqaPreviousFormData')
  );
  const previousSectionAnswers = previousVisitAnswers?.filter(
    (item) => item.visitSection === visitSection
  );

  const question1 = previousSectionAnswers?.find(
    (item) => item.question === question
  );

  const setPreviousAnswers = useCallback(() => {
    setAnswer(question1?.questionAnswer);
  }, [question1]);

  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      {
        visitSection,
        questions: [{ answer: String(value), question: question }],
      },
    ]);

    if (value !== '') {
      return setEnableButton?.(true);
    }

    setEnableButton?.(false);
  };

  useLayoutEffect(() => {
    if (previousVisit) {
      appDispatch(
        getVisitDataForVisitId({
          visitId: previousVisit.id,
          visitType: 'pre-pqa',
        })
      );
    }
  }, [appDispatch, practitionerId, previousVisit]);

  useEffect(() => {
    if (wasLoading && !isLoading) {
      setPreviousAnswers();
    }
  }, [isLoading, setPreviousAnswers, wasLoading]);

  useEffect(() => {
    if (isView) {
      setEnableButton?.(true);
    }
  }, [isView, setEnableButton, setPreviousAnswers]);

  if (isLoading) {
    return (
      <LoadingSpinner
        className="mt-4"
        size="medium"
        spinnerColor="primary"
        backgroundColor="uiLight"
      />
    );
  }

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      {isView && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot edit responses."
        />
      )}
      <Divider dividerType="dashed" className="my-3" />
      <FormInput
        label={replaceBraces(question, name)}
        subLabel={`These notes will be shared with ${name}.`}
        textInputType="textarea"
        className="mb-4"
        value={answer ?? ''}
        disabled={isView}
        onChange={onChange}
      />

      {isFollowUp ? (
        <div className="bg-uiBg rounded-15 p-4">
          <Typography
            type="h3"
            text="Your discussion notes from the first site visit"
            color="textDark"
          />
          <Typography
            type="markdown"
            className="text-14"
            text={new Date(
              discussionNotesAnswer.insertedDate
            ).toLocaleDateString('en-ZA', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            color="textDark"
          />
          <Typography
            type="body"
            text={discussionNotesAnswer.questionAnswer || ''}
            color="textMid"
            className="mt-4"
          />
        </div>
      ) : (
        <>
          <Typography
            type="h3"
            text={`Questions to ask ${name}:`}
            color="textDark"
            className="mb-4"
          />
          <ul className="text-textMid ml-5" style={{ listStyleType: 'disc' }}>
            {[
              'How is the programme going? What are you enjoying? Is there anything you are finding difficult or anything I can help with?',
              'Do you host parent/caregiver meetings? if no, why not? If yes, when was the last one and how was it? Did you use your get set go flyers?',
              'Do you attend club meetings? If no, why not? If yes, when was the last one and how was it?',
            ].map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </>
      )}
      {!!answer && (
        <Alert
          className="mt-4"
          type="success"
          title="All steps complete - your signature has been added."
        />
      )}
    </div>
  );
};
