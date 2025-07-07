import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { options } from './options';
import { ClassroomGroup } from '@ecdlink/graphql';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { PractitionerService } from '@/services/PractitionerService';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step2ReAccreditationVisitSection = 'Step 2';

export const Step2ReAccreditation = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();
  const [question, setAnswers] = useState({
    question: `SmartSpace check`,
    answer: [] as (string | number | undefined)[],
  });

  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);

  const answers = question.answer as string[];
  const name =
    smartStarter?.user?.firstName ||
    smartStarter?.firstName ||
    'the SmartStarter';

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'reAccreditationPreviousFormData',
      step2ReAccreditationVisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const getScore = (answers: string[]) => {
    const length = answers?.length;
    let scoreColours: Colours = 'errorMain';

    if (length > 0 && length < 17) {
      scoreColours = 'alertMain';
    }

    if (length === 17) {
      scoreColours = 'successMain';
    }

    return {
      score: length,
      color: scoreColours,
    };
  };

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        return setSectionQuestions?.([
          {
            visitSection: step2ReAccreditationVisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        {
          visitSection: step2ReAccreditationVisitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  const classroomsDetailsForPractitioner = useCallback(async () => {
    // Needs to be updated
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      smartStarter?.userId! || smartStarter?.id!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [smartStarter?.userId, userAuth?.auth_token]);

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      const answer =
        previousData?.questions?.[0]?.answer?.toString()?.split('.,') ?? [];

      setAnswers((prevState) => ({
        question: prevState.question,
        answer,
      }));
    }
  }, [
    isViewAnswers,
    previousData,
    previousStatePreviousData?.questions.length,
  ]);

  useEffect(() => {
    classroomsDetailsForPractitioner();
    setEnableButton?.(true);
  }, [classroomsDetailsForPractitioner, setEnableButton]);

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
      <Typography type="h2" text={`${name} - ${question.question}`} />
      <Typography
        type="h4"
        text={
          isOnline
            ? `${practitionerClassroomDetails?.[0]?.classroom?.name || ''} ${
                practitionerClassroomDetails?.[0]?.programmeType?.description ||
                ''
              }`
            : 'Not available offline'
        }
        color="textMid"
      />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Alert
        className="my-4"
        type="info"
        title={`Spend at least 10 minutes completing the SmartSpace checklist with ${name}`}
      />
      <Divider dividerType="dashed" />
      <div className="flex flex-col gap-2 py-4">
        {options.map((item) => (
          <CheckboxGroup
            checkboxColor="primary"
            titleWeight="normal"
            id={item}
            key={item}
            title={item}
            checked={answers?.some((option) => item.includes(option))}
            disabled={isViewAnswers}
            value={item}
            onChange={onCheckboxChange}
          />
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            getScore(answers).color
          } rounded-15`}
        >
          {getScore(answers).score}/{17}
        </span>
        <Typography type="h4" text="Score" />
      </div>
    </div>
  );
};
