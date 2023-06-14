import Article from '@/components/article/article';
import { practitionerSelectors } from '@/store/practitioner';
import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  Typography,
} from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { ContentConsentTypeEnum } from '@ecdlink/core';
import { coachSelectors } from '@/store/coach';
import { startupAgreementPaymentOptions } from './startup-accept-agreement3.types';
import {
  SectionQuestions,
  visitSection,
} from '../../startup-accept-agreement.types';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  sectionQuestions?: SectionQuestions[];
}

export const StartupAcceptAgreement3: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  setSectionQuestions,
  sectionQuestions,
}) => {
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);

  const [questions, setAnswers] = useState([
    {
      question: 'Have set up my own enterprise',
      answer: '',
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
            text={'Payment options'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'Payment options'}
          />
          <div className={'w-full'}>
            <label
              className={
                'font-body text-textMid mb-2 block text-base font-semibold leading-snug'
              }
            >
              How would you like to receive your start-up support?
            </label>
            <label
              className={
                'font-body text-textMid mb-2 block text-base leading-snug'
              }
            >
              If you do not have a bank account, please select FNB eWallet.
            </label>
            <div className="mt-1">
              <ButtonGroup<string>
                options={startupAgreementPaymentOptions}
                onOptionSelected={(value: string | string[]) =>
                  onOptionSelected(value, 0)
                }
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
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
                setAgreementStep('StartupAcceptAgreement4');
              }}
              disabled={questions?.some((item) => item?.answer === '')}
            />
          </div>
        </div>
      </div>
    </>
  );
};
