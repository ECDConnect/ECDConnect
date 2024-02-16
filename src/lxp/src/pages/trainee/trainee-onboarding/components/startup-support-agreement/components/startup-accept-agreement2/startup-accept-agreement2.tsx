import { Alert, Button, Checkbox, Typography } from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import {
  SectionQuestions,
  StartupAgreementSteps,
  visitSection,
} from '../../startup-accept-agreement.types';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  setSectionQuestions: (value: SectionQuestions[]) => void;
  sectionQuestions: SectionQuestions[];
}

export const StartupAcceptAgreement2: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  setSectionQuestions,
  sectionQuestions,
}) => {
  const [questions, setAnswers] = useState([
    {
      question:
        'The contract will be for the fixed term and amount agreed upon for a full day programme. I recognise that this amount will be paid monthly into my below mentioned bank account.',
      answer: false,
    },
    {
      question:
        'I recognise that the payment of the monthly start up subsidy depends on the following, and failure to comply on a monthly basis will result in the non-payment of the start-up subsidy:',
      answer: false,
    },
  ]);

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
    },
    [questions]
  );

  const onSubmitQuestions = () => {
    setSectionQuestions?.([
      {
        visitSection,
        questions:
          sectionQuestions && sectionQuestions?.length > 0
            ? [...sectionQuestions?.[0]?.questions, ...questions]
            : questions,
      },
    ]);
  };

  return (
    <>
      <div className="flex flex-col justify-around p-4">
        <div>
          <Typography
            className={'my-3'}
            color={'textDark'}
            type={'h2'}
            text={'Read & accept the agreement'}
          />
          {/* TODO integration with the data coming from SL. */}
          {/* <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'**** Name of org/dept giving the start-up support ****'}
          /> */}
          <Alert
            className={'mt-5 mb-3'}
            title="You need to accept both agreements below to continue"
            type={'info'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={
              'Please check to agree with the following and have your signature added:'
            }
          />
          <div className="'flex items-center' w-full flex-row justify-start">
            <div
              className="flex items-start gap-2"
              onClick={() => onOptionSelected(!questions?.[0].answer, 0)}
            >
              <Checkbox
                onCheckboxChange={(e) => onOptionSelected(e.checked, 0)}
                checked={questions?.[0].answer}
              />
              <Typography
                text={
                  'The contract will be for the fixed term and amount agreed upon for a full day programme. I recognise that this amount will be paid monthly into my below mentioned bank account.'
                }
                type="body"
                color={'textMid'}
              />
            </div>
            <div
              className="mt-2 flex items-start gap-2"
              onClick={() => onOptionSelected(!questions?.[1].answer, 1)}
            >
              <Checkbox
                onCheckboxChange={(e) => onOptionSelected(e.checked, 1)}
                checked={questions?.[1].answer}
              />
              <Typography
                text={`I recognise that the payment of the monthly start up subsidy depends on the following, and failure to comply on a monthly basis will result in the non-payment of the start-up subsidy:
                1. Submission of the signed monthly register using the method specified by SmartStart by 7th day of each month. Late submission of registers will result in the non-payment of subsidy.
                2. Maintaining and providing stimulation to 6 children monthly.
                3. Non submission of attendance registers for 3 months in a row will lead to termination of this agreement.`}
                type="body"
                color="textMid"
              />
            </div>
          </div>
          <div className="mt-4 mb-16 h-full w-full">
            <Button
              size="normal"
              className="mb-4 w-full"
              type="filled"
              color="primary"
              text="Next"
              textColor="white"
              icon="ArrowCircleRightIcon"
              onClick={() => {
                onSubmitQuestions();
                setAgreementStep(
                  StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT3
                );
              }}
              disabled={questions?.some((item) => item?.answer === false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
