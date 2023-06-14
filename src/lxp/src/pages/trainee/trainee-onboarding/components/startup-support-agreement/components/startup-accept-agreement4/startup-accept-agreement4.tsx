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
import { yesNoOptions } from './startup-accept-agreement4.types';
import {
  SectionQuestions,
  visitSection,
} from '../../startup-accept-agreement.types';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  sectionQuestions?: SectionQuestions[];
  onAllStepsComplete?: any;
}

export const StartupAcceptAgreement4: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  setSectionQuestions,
  sectionQuestions,
  onAllStepsComplete,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const coach = useSelector(coachSelectors.getCoach);
  const [viewPermissionToShare, setViewPermissionToShare] =
    useState<boolean>(false);

  const [questions, setAnswers] = useState([
    {
      question:
        'Have agreed to receive my stipend amount of R500 using FNB eWallet',
      answer: false,
    },
    {
      question:
        'I continue to deliver childcare services to a maximum of 6 children each month.',
      answer: false,
    },
    {
      question:
        'Registered the required number of children - maximum of 6 children.',
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
            text={'Payment options'}
          />
          <Typography
            className={'my-3 w-11/12'}
            color={'textDark'}
            type={'h3'}
            text={'Payment options'}
          />
          <div className="'flex items-center' w-full flex-row justify-start">
            <div className="flex items-start gap-2">
              <Checkbox
                onCheckboxChange={(e) => onOptionSelected(e.checked, 0)}
              />
              <Typography
                text={`I, ${practitioner?.user?.fullName} (ID: ${practitioner?.user?.idNumber}; Cellphone: ${practitioner?.user?.phoneNumber})  have agreed to receive my stipend amount of R500 using FNB eWallet.`}
                type="body"
                color="textMid"
              />
            </div>
            <div className="mt-2 flex items-start gap-2">
              <Checkbox
                onCheckboxChange={(e) => onOptionSelected(e.checked, 1)}
              />
              <Typography
                text={
                  'I confirm that if I lose/misplace my cell phone I will notify OrgName or my coach as soon as possible. I accept that if I do not communicate my change of details, the missed stipend will not be replaced..'
                }
                type="body"
                color={'textMid'}
              />
            </div>
            <Alert
              className={'mx-4'}
              type={'info'}
              title={
                'Disclaimer: OrgName is not liable for money being transferred to a cell phone number that was lost/misplaced without notification.'
              }
            />
            <div className="mt-2 flex items-start gap-2">
              <Checkbox
                // checked={}
                onCheckboxChange={(e) => onOptionSelected(e.checked, 2)}
              />
              <Typography
                text={`I acknowledge that I have read and accept the eWallet terms & conditions:
                  The one time pin expires in 16 hours. Once 16 hours have passed and you haven’t used the pin, you have to dial *120*277# to get a new pin and it needs airtime.
                  You have 6 months to withdraw the funds
                  eWallet recipients can withdraw funds held in a Wallet from any FNB ATM or selected Spar stores
                  FNB does not guarantee specific denominations of bank notes and will not be liable for costs associated with part withdrawals
                  If you change your cellphone number for any reason whatsoever, FNB will not transfer the funds in the eWallet to the new cellphone number. Before you change your cellphone number, you must use up the funds in the eWallet, either withdraw the funds or use them for prepaid airtime or other available functionality.`}
                type="body"
                color={'textMid'}
              />
            </div>
            {questions?.some((item) => item?.answer === false) && (
              <Alert
                className="my-4"
                variant="outlined"
                type="success"
                title={`All steps complete - your signature has been added.`}
              />
            )}
          </div>
          <div className="mt-4 mb-16 w-full">
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
                onAllStepsComplete();
              }}
              disabled={questions?.some((item) => item?.answer === false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
