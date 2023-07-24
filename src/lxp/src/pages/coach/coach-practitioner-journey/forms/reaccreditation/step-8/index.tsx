import {
  ActionModal,
  Alert,
  Button,
  CheckboxChange,
  CheckboxGroup,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useEffect, useLayoutEffect, useState } from 'react';
import { detailTexts, options } from './options';
import { useDialog, usePrevious, useSessionStorage } from '@ecdlink/core';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import { Score } from '../components/score';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

export const step8ReAccreditation = {
  visitSection: 'Step 8',
  totalScore: 12,
};

export const Step8ReAccreditation = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [question, setAnswers] = useState({
    question: `A. The learning environment & use of the SmartStart routine`,
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];
  const firstName =
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
      step8ReAccreditation.visitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const dialog = useDialog();

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
            visitSection: step8ReAccreditation.visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setAnswers(updatedQuestion);
      return setSectionQuestions?.([
        {
          visitSection: step8ReAccreditation.visitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setSectionQuestions]
  );

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
    handleViewMode();
  }, [handleViewMode]);

  useLayoutEffect(() => {
    setEnableButton?.(true);
  }, [setEnableButton]);

  const renderDialog = ({ index }: { index?: number }) => {
    let title = 'Check all of the statements that are true';
    let detailText = `If you are not there for the whole session or do not see certain activities, ask the SmartStarter which statements are true for today’s session.

    See some suggested questions in the boxes below.`;

    if (index) {
      title = `Ask ${firstName}:`;
      detailText = detailTexts[index - 5];
    }

    return dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            customIcon={
              <QuestionMarkCircleIcon className="text-infoMain mb-4 w-9" />
            }
            title={title}
            detailText={detailText}
            actionButtons={[
              {
                colour: 'primary',
                text: 'Close',
                textColour: 'primary',
                type: 'outlined',
                leadingIcon: 'XIcon',
                onClick: onClose,
              },
            ]}
          />
        );
      },
    });
  };

  return (
    <div className="p-4">
      <Typography type="h2" text={question.question} className="mb-4" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Alert
        type="info"
        title="Check all of the statements that are true"
        button={
          <Button
            text="Learn more"
            icon="QuestionMarkCircleIcon"
            type="filled"
            color="primary"
            textColor="white"
            onClick={() => renderDialog({})}
          />
        }
      />
      <Divider dividerType="dashed" className="my-4" />
      {options.map((item, index) => {
        const [title, description] = item.split(':');
        const label = `<strong>${title}:</strong> ${description}`;

        return (
          <CheckboxGroup
            className="mb-2"
            checkboxColor="primary"
            id={item}
            key={item}
            title={label}
            titleWeight="normal"
            checked={answers?.some((option) => item.includes(option))}
            disabled={isViewAnswers}
            value={item}
            onChange={onCheckboxChange}
            {...(index > 4 && {
              extraChildren: (
                <button
                  className="ml-auto"
                  onClick={() => renderDialog({ index })}
                >
                  <InformationCircleIcon className="text-infoMain h-6 w-6" />
                </button>
              ),
            })}
          />
        );
      })}
      {!!answers.length && (
        <Score sum={answers.length} total={step8ReAccreditation.totalScore} />
      )}
    </div>
  );
};
