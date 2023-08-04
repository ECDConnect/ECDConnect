import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Label, Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { Fragment, useCallback, useState } from 'react';

export const maternalDistressVisitSection = 'Maternal distress screening';
export const maternalDistressQuestion3 =
  'Had thoughts and plans to harm yourself or commit suicide?';

export const MaternalDistressScreeningStep = ({
  infant,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: 'Felt unable to stop worrying or thinking too much?',
      answer: '',
    },
    {
      question: 'Felt down, depressed or hopeless?',
      answer: '',
    },
    {
      question: maternalDistressQuestion3,
      answer: '',
    },
  ]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const onOptionSelected = useCallback(
    (value, index) => {
      const currentQuestion = questions[index];

      const updatedQuestions = questions.map((question) => {
        if (question.question === currentQuestion.question) {
          return {
            ...question,
            answer: value,
          };
        }
        return question;
      });

      setAnswers(updatedQuestions);
      setQuestions?.([
        {
          visitSection: maternalDistressVisitSection,
          questions: updatedQuestions,
        },
      ]);

      const isCompleted = updatedQuestions.every((item) => item.answer !== '');

      if (isCompleted) {
        setEnableButton?.(true);
      }
    },
    [questions, setEnableButton, setQuestions]
  );

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={maternalDistressVisitSection}
      />
      <div className="flex flex-col p-4">
        <Label text="In the last 2 weeks, have you:" />
        <Divider className="mt-4" dividerType="dashed" />
        {questions.map((item, index) => (
          <Fragment key={item.question}>
            <Typography
              className="mt-4"
              type="body"
              text={item.question}
              color="textDark"
            />
            <ButtonGroup<boolean>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={options}
              onOptionSelected={(value) => onOptionSelected(value, index)}
            />
          </Fragment>
        ))}
        {(!!questions[0].answer || !!questions[1].answer) &&
          !questions[2].answer && (
            <Alert
              className="mt-4"
              type="warning"
              title={`${infant?.caregiver?.firstName} is experiencing distress.`}
              list={[
                `Refer ${infant?.caregiver?.firstName} to the clinic for additional support`,
              ]}
              customIcon={
                <div className="rounded-full">
                  {renderIcon(
                    'ExclamationCircleIcon',
                    'text-alertMain w-10 h-10'
                  )}
                </div>
              }
            />
          )}
        {!!questions[2].answer && (
          <Alert
            className="mt-4"
            type="error"
            title={`Refer ${infant?.caregiver?.firstName} to the clinic immediately for emergency care.`}
            list={[
              `Give ${infant?.caregiver?.firstName} the 24-hour suicide crisis line number: 0800 567 567`,
              'Your team leader will be notified. Call them if you need extra support.',
            ]}
            customIcon={
              <div className="rounded-full">
                {renderIcon('ExclamationIcon', 'text-errorMain w-10 h-10')}
              </div>
            }
          />
        )}
      </div>
    </>
  );
};
