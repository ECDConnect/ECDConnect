import {
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Colours,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps, SectionQuestions } from '../../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { ClassroomGroup } from '@ecdlink/graphql';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { PractitionerService } from '@/services/PractitionerService';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { options } from './options';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { usePrevious, useSessionStorage } from '@ecdlink/core';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';
import { userSelectors } from '@/store/user';
import { practitionerSelectors } from '@/store/practitioner';

export const step12VisitSection = 'Step 12';

export const Step12 = ({
  smartStarter,
  setSectionQuestions,
  setEnableButton,
  isView,
}: DynamicFormProps) => {
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();
  const [question, setAnswers] = useState({
    question: 'SmartSpace check',
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const [visitIdFromPractitionerJourney] = useSessionStorage(
    practitionerVisitIdKey
  );

  const isViewAnswers = isView || !!visitIdFromPractitionerJourney;

  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const previousData = useSelector(
    getSectionsQuestionsByStep(
      visitIdFromPractitionerJourney ?? '',
      'pqaPreviousFormData',
      step12VisitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const { isOnline } = useOnlineStatus();
  const userAuth = useSelector(authSelectors.getAuthUser);
  // INFO: from practitioner
  const user = useSelector(userSelectors.getUser);

  const isPractitionerUser = user?.id === practitioner?.userId;

  const name = smartStarter?.user
    ? `${smartStarter?.user?.firstName} ${smartStarter?.user?.surname || ''}`
    : `${user?.firstName} ${user?.surname || ''}`;

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
            visitSection: step12VisitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        { visitSection: step12VisitSection, questions: [updatedQuestion] },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

  const getScore = () => {
    const length = answers.length;
    let scoreColours: Colours = 'errorMain';
    const total = 17;
    if (length > 0 && length < total) {
      scoreColours = 'alertMain';
    }

    if (length === total) {
      scoreColours = 'successMain';
    }

    return {
      score: length,
      color: scoreColours,
      total,
    };
  };

  const classroomsDetailsForPractitioner = useCallback(async () => {
    // Needs to be updated
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      isPractitionerUser ? user?.id! : smartStarter?.userId!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [
    isPractitionerUser,
    smartStarter?.userId,
    user?.id,
    userAuth?.auth_token,
  ]);

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
    setEnableButton?.(true);
    classroomsDetailsForPractitioner();
  }, [classroomsDetailsForPractitioner, setEnableButton]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        text={`${name} - ${question.question}`}
        color="textDark"
      />
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
      <Alert
        className="mt-4"
        type="info"
        title="Walk around the site and make sure the following standards are in place."
      />
      {isViewAnswers && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Divider dividerType="dashed" className="my-4" />
      {options.question1.map((item) => (
        <CheckboxGroup
          className="mb-2"
          id={item}
          key={item}
          title={item}
          titleColours="textMid"
          titleSize="sm"
          titleWeight="normal"
          checked={answers?.some((option) => item.includes(option))}
          value={item}
          disabled={isViewAnswers}
          onChange={onCheckboxChange}
        />
      ))}
      <div className="mt-6 flex items-center gap-2">
        <span
          className={`p-2 text-sm font-semibold text-white bg-${
            getScore().color
          } rounded-15`}
        >
          {getScore().score}/{getScore().total}
        </span>
        <Typography type="h4" text="Score" />
      </div>
      {getScore().score === getScore().total && (
        <Alert
          className="mt-4"
          variant="outlined"
          type="success"
          title={`Great! ${smartStarter?.user?.firstName}’s venue meets all the basic standards.`}
          customIcon={<Emoji3 className="h-auto w-16" />}
        />
      )}
    </div>
  );
};
