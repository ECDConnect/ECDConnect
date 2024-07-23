import { Alert, FormInput, Typography } from '@ecdlink/ui';
import { useState, ChangeEvent, useCallback, useEffect } from 'react';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { useSelector } from 'react-redux';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { classroomsSelectors } from '@/store/classroom';
import { NoPlaygroupClassroomType } from '@/enums/ProgrammeType';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step5ReAccreditationQuestion =
  'How many assistants will attend every session?';
export const step5ReAccreditationVisitSection = 'Step 5';

export const Step5ReAccreditation = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState('');

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step5ReAccreditationVisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const { isOnline } = useOnlineStatus();

  const classroom = useSelector(classroomsSelectors.getClassroom);
  const allClassroomGroups = useSelector(
    classroomsSelectors.getClassroomGroups
  );
  const classroomGroups = allClassroomGroups.filter(
    (x) => x.name !== NoPlaygroupClassroomType.name
  );

  const currentClassroomGroups = classroomGroups.filter(
    (item) => item?.userId === smartStarter?.userId
  );
  const onChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const value = event.target.value;
    setAnswer(value);
    setSectionQuestions?.([
      {
        visitSection: step5ReAccreditationVisitSection,
        questions: [{ answer: value, question: step5ReAccreditationQuestion }],
      },
    ]);

    if (value !== '') {
      setEnableButton?.(true);
    } else {
      setEnableButton?.(false);
    }
  };

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const currentAnswer = previousData?.questions?.[0]?.answer;
      setAnswer(currentAnswer ? String(currentAnswer) : '');
    }
  }, [
    isViewAnswers,
    previousData,
    previousStatePreviousData?.questions.length,
  ]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  return (
    <div className="p-4">
      <Typography type="h2" text="Programme details" color="textDark" />
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <div className="flex">
        <Typography
          type="h4"
          text="Programme type:"
          color="textDark"
          className="my-4"
        />
        <Typography
          type="h4"
          text={classroom?.name ?? 'Not provided'}
          color={isOnline ? 'textDark' : 'errorMain'}
          className="my-4 ml-1 font-bold"
        />
      </div>
      <FormInput
        className="mt-2"
        label={step5ReAccreditationQuestion}
        subLabel="Any programme with more than 10 children must have an assistant."
        placeholder="e.g. 2"
        value={answer}
        disabled={isViewAnswers}
        onChange={onChange}
      />
    </div>
  );
};
