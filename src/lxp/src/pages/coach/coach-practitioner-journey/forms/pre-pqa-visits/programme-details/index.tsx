import {
  Alert,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { parseBool, replaceBraces } from '@ecdlink/core';
import { useParams } from 'react-router';
import { PractitionerJourneyParams } from '../../../coach-practitioner-journey.types';
import { useSelector } from 'react-redux';
import {
  getCurrentCoachPractitionerVisitByUserId,
  getVisitDataByVisitIdSelector,
} from '@/store/pqa/pqa.selectors';
import { currentActivityKey } from '../..';
import { ClassroomGroup, Maybe } from '@ecdlink/graphql';
import { getPractitionerByUserId } from '@/store/practitioner/practitioner.selectors';
import { PractitionerService } from '@/services/PractitionerService';
import { authSelectors } from '@/store/auth';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';

export const ProgrammeDetails = ({
  isView,
  smartStarter,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState<
    {
      question: string;
      answer: null | Maybe<string> | string | boolean | undefined;
    }[]
  >([
    {
      question: `Does {client} receive start-up support from SmartStart?`,
      answer: '',
    },
    {
      question: `Does {client} collect preschool fees from caregivers?`,
      answer: '',
    },
    {
      question: `How much does {client} charge per month?`,
      answer: '',
    },
  ]);
  const [practitionerClassroomDetails, setPractitionerClassroomDetails] =
    useState<ClassroomGroup[]>();

  const options: ButtonGroupOption<boolean>[] = [
    { text: 'Yes', value: true, disabled: isView },
    { text: 'No', value: false, disabled: isView },
  ];

  const name = smartStarter?.user?.firstName || 'the smartStarter';
  const visitSection = 'Programme details';
  const activityName = window.sessionStorage.getItem(currentActivityKey) || '';

  const { isOnline } = useOnlineStatus();

  const { practitionerId } = useParams<PractitionerJourneyParams>();
  const practitioner = useSelector(getPractitionerByUserId(practitionerId));
  const userAuth = useSelector(authSelectors.getAuthUser);

  const currentVisit = useSelector(
    getCurrentCoachPractitionerVisitByUserId(
      activityName,
      smartStarter?.userId!
    )
  );
  const previousVisitAnswers = useSelector(
    getVisitDataByVisitIdSelector(currentVisit?.id, 'prePqaPreviousFormData')
  );

  const previousSectionAnswers = previousVisitAnswers?.filter(
    (item) => item.visitSection === visitSection
  );
  const previousDate = previousSectionAnswers?.[0].insertedDate;

  const question1 = previousSectionAnswers?.find(
    (item) => item.question === questions[0].question
  );
  const question2 = previousSectionAnswers?.find(
    (item) => item.question === questions[1].question
  );
  const question3 = previousSectionAnswers?.find(
    (item) => item.question === questions[2].question
  );

  const setPreviousAnswers = useCallback(() => {
    setAnswers((prevState) =>
      prevState.map((item, index) => {
        if (index === 0) {
          return {
            ...item,
            answer: parseBool(question1?.questionAnswer!),
          };
        }

        if (index === 1) {
          return {
            ...item,
            answer: parseBool(question2?.questionAnswer!),
          };
        }

        return {
          ...item,
          answer: question3?.questionAnswer,
        };
      })
    );
  }, [question1, question2, question3]);

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
        if (index === 1 && currentIndex === 2) {
          return {
            ...question,
            answer: '',
          };
        }

        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      const count = updatedQuestions.filter(
        (item) => item.answer !== ''
      ).length;

      if (
        (!!parseBool(updatedQuestions[1].answer) && count === 3) ||
        (parseBool(updatedQuestions[1].answer) === false && count === 2)
      ) {
        return setEnableButton?.(true);
      }

      setEnableButton?.(false);
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const classroomsDetailsForPractitioner = useCallback(async () => {
    // Needs to be updated
    const classroomDetails = (await new PractitionerService(
      userAuth?.auth_token!
    ).getClassroomGroupClassroomsForPractitioner(
      practitioner?.userId!
    )) as unknown;

    setPractitionerClassroomDetails(classroomDetails as ClassroomGroup[]);
    return classroomDetails;
  }, [practitioner?.userId, userAuth?.auth_token]);

  useEffect(() => {
    classroomsDetailsForPractitioner();
  }, [classroomsDetailsForPractitioner]);

  useEffect(() => {
    if (isView) {
      setEnableButton?.(true);
      setPreviousAnswers();
    }
  }, [isView, setEnableButton, setPreviousAnswers]);

  return (
    <div className="p-4">
      <Typography type="h2" text={visitSection} color="textDark" />
      <Typography
        type="h4"
        text={(isView && !!previousDate
          ? new Date(previousDate)
          : new Date()
        ).toLocaleDateString('en-ZA', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          weekday: 'long',
        })}
        color="textMid"
      />
      {isView && (
        <Alert
          className="mt-4"
          type="warning"
          title="You are viewing this form and cannot edit responses."
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
          text={
            isOnline
              ? practitionerClassroomDetails?.[0]?.programmeType?.description ||
                'not provided'
              : 'You need to be online to view programme type'
          }
          color={
            isOnline &&
            practitionerClassroomDetails?.[0]?.programmeType?.description
              ? 'textDark'
              : 'errorMain'
          }
          className="my-4 ml-1 font-bold"
        />
      </div>
      <Typography
        type="h4"
        text={replaceBraces(questions[0].question, name)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={
          questions[0].answer !== ''
            ? parseBool(String(questions[0].answer))
            : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 0)}
      />
      {!!parseBool(String(questions[0].answer)) && (
        <Alert
          className="mt-4"
          type="info"
          title={`Check if ${name} has any questions about fees or needs support.`}
        />
      )}
      <Typography
        type="h4"
        text={replaceBraces(questions[1].question, name)}
        color={isView ? 'textLight' : 'textDark'}
        className="my-4"
      />
      <ButtonGroup<boolean>
        color="secondary"
        type={ButtonGroupTypes.Button}
        options={options}
        selectedOptions={
          questions[1].answer !== ''
            ? parseBool(String(questions[1].answer))
            : undefined
        }
        onOptionSelected={(value) => onOptionSelected(value, 1)}
      />
      {!!parseBool(String(questions[1].answer)) && (
        <FormInput
          disabled={isView}
          className="mt-4"
          label={replaceBraces(questions[2].question, name)}
          type="number"
          prefixIcon
          value={questions[2].answer !== '' ? String(questions[2].answer) : ''}
          onChange={(event) => onOptionSelected(event.target.value, 2)}
        />
      )}
      <Alert
        className="mt-4"
        type="info"
        title={`Check if ${name} has any questions about fees or needs support.`}
      />
    </div>
  );
};
