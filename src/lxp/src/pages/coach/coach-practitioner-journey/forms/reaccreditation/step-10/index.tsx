import {
  ActionModal,
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { Fragment, useCallback, useEffect, useState } from 'react';
import { detailTexts, options } from './options';
import { DynamicFormProps, SectionQuestions } from '../../dynamic-form';
import {
  InformationCircleIcon,
  QuestionMarkCircleIcon,
} from '@heroicons/react/solid';
import { useDialog, usePrevious, useSessionStorage } from '@ecdlink/core';
import { Score } from '../components/score';
import { practitionerVisitIdKey } from '@/pages/practitioner/practitioner-profile/practitioner-journey/forms';
import { useSelector } from 'react-redux';
import { getSectionsQuestionsByStep } from '@/store/pqa/pqa.selectors';

interface State {
  question: string;
  answer: string;
}

export const step10ReAccreditation = {
  visitSection: 'Step 10',
  totalScore: 20,
};

export const Step10ReAccreditation = ({
  smartStarter,
  isView,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Warm interactions',
      answer: '',
    },
    {
      question: 'Individual attention',
      answer: '',
    },
    {
      question: 'Maintaining order',
      answer: '',
    },
    {
      question: 'Comforting children',
      answer: '',
    },
    {
      question: 'Resolving conflicts',
      answer: '',
    },
    {
      question: 'Talking with children',
      answer: '',
    },
    {
      question: 'Encouraging intiative',
      answer: '',
    },
    {
      question: 'Extending learning',
      answer: '',
    },
    {
      question: 'Appropriate activities',
      answer: '',
    },
    {
      question: 'Interactive story time',
      answer: '',
    },
  ]);

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
      step10ReAccreditation.visitSection
    )
  );
  const previousStatePreviousData = usePrevious(previousData) as
    | SectionQuestions
    | undefined;

  const optionsButtonGroup = [
    { text: '0', value: '0', disabled: isViewAnswers },
    { text: '1', value: '1', disabled: isViewAnswers },
    { text: '2', value: '2', disabled: isViewAnswers },
  ];

  const dialog = useDialog();

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question, currentIndex) => {
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
          visitSection: step10ReAccreditation.visitSection,
          questions: updatedQuestions,
        },
      ]);

      setEnableButton?.(updatedQuestions.every((item) => item.answer !== ''));
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const handleViewMode = useCallback(() => {
    if (
      isViewAnswers &&
      previousData?.questions.length !==
        previousStatePreviousData?.questions.length
    ) {
      setAnswers(previousData?.questions as State[]);
    }
  }, [isViewAnswers, previousData, previousStatePreviousData]);

  useEffect(() => {
    handleViewMode();
  }, [handleViewMode]);

  useEffect(() => {
    if (isViewAnswers) {
      setEnableButton?.(true);
    }
  }, [isViewAnswers, setEnableButton]);

  const renderDialog = ({ index }: { index?: number }) => {
    let title = 'Give each section a rating of 0, 1 or 2, where:';
    let detailText = '';

    if (index) {
      title = `Ask ${firstName}:`;
      detailText = detailTexts[index - 1];
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
            {...(!index && {
              customDetailText: (
                <div>
                  {[
                    '0 = This doesn’t seem to be happening at all.',
                    '1 = I don’t think this is happening enough',
                    '2 = I think this is happening most of the time.',
                  ].map((item) => {
                    const [number, text] = item.split('=');
                    return (
                      <Typography
                        key={number}
                        type="markdown"
                        text={`<strong>${number}</strong> = ${text}`}
                      />
                    );
                  })}
                  <ul className="text-textMid ml-5 mt-2 list-disc">
                    {[
                      `If you did not observe that part of the session, during your discussion with ${firstName}, ask about their approach.`,
                      'See some suggested questions in the boxes below.',
                    ].map((item) => (
                      <li className="mb-4" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ),
            })}
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
    <div className="flex flex-col gap-2 p-4">
      <Typography type="h2" text="B. Programme implementation" />
      {isViewAnswers && (
        <Alert
          className="my-4"
          type="warning"
          title="You are viewing this form and cannot fill in responses."
        />
      )}
      <Alert
        type="info"
        title="Give each section a rating."
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
      <Divider dividerType="dashed" />
      {questions.map((question, index) => (
        <Fragment key={question.question}>
          <div className="flex justify-between">
            <Typography type="h4" text={`${index + 1} ${question.question}`} />
            {index > 0 && (
              <button onClick={() => renderDialog({ index })}>
                <InformationCircleIcon className="text-infoMain h-6 w-6" />
              </button>
            )}
          </div>
          <Typography type="body" text={options[index]} />
          <ButtonGroup<string>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={optionsButtonGroup}
            selectedOptions={
              questions[index].answer !== ''
                ? questions[index].answer
                : undefined
            }
            onOptionSelected={(value) => onOptionSelected(value, index)}
          />
        </Fragment>
      ))}
      {questions.some((item) => item.answer !== '') && (
        <Score
          sum={questions.reduce(
            (total, question) => total + Number(question.answer),
            0
          )}
          total={step10ReAccreditation.totalScore}
        />
      )}
    </div>
  );
};
