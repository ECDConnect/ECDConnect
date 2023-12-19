import { practitionerSelectors } from '@/store/practitioner';
import { Alert, Button, Checkbox, Typography } from '@ecdlink/ui';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { coachSelectors } from '@/store/coach';
import {
  SectionQuestions,
  StartupAgreementSteps,
  visitSection,
} from '../../startup-accept-agreement.types';

interface ReadAndAcceptAgreementProps {
  setAgreementStep: any;
  setSectionQuestions?: (value?: SectionQuestions[]) => void;
  startupSupportAgreementSigned?: boolean;
}

export const StartupAcceptAgreement1: React.FC<ReadAndAcceptAgreementProps> = ({
  setAgreementStep,
  setSectionQuestions,
  startupSupportAgreementSigned,
}) => {
  const practitioner = useSelector(practitionerSelectors.getPractitioner);
  const coach = useSelector(coachSelectors.getCoach);

  const [questions, setAnswers] = useState([
    {
      question: 'Have set up my own enterprise',
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
      setSectionQuestions?.([
        {
          visitSection,
          questions: updatedQuestions,
        },
      ]);
    },
    [questions, setSectionQuestions]
  );

  return (
    <>
      <div
        className={`flex h-screen flex-col justify-around p-4 ${
          startupSupportAgreementSigned ? 'pointer-events-none opacity-50' : ''
        }`}
      >
        <div className="h-screen">
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
            title="You need to accept all 3 agreements below to continue"
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
                checked={
                  startupSupportAgreementSigned
                    ? startupSupportAgreementSigned
                    : undefined || questions?.[0].answer
                }
              />
              <Typography
                text={`I, ${practitioner?.user?.fullName} (ID: ${
                  practitioner?.user?.idNumber || '0000000000000'
                }; Cellphone: ${
                  practitioner?.user?.phoneNumber || '000000000000'
                }) have set up my own enterprise and am committed to providing early childhood development services to a maximum of 6 children, from 8am - 6pm, Monday to Friday for the the term agreed upon at the site, ${
                  practitioner?.siteAddress?.addressLine1
                }, ${practitioner?.siteAddress?.addressLine2}, ${
                  practitioner?.siteAddress?.addressLine3
                }.`}
                type="body"
                color="textMid"
              />
            </div>
            <div
              className="mt-2 flex items-start gap-2"
              onClick={() => onOptionSelected(!questions?.[1].answer, 1)}
            >
              <Checkbox
                onCheckboxChange={(e) => onOptionSelected(e.checked, 1)}
                checked={
                  startupSupportAgreementSigned
                    ? startupSupportAgreementSigned
                    : undefined || questions?.[1].answer
                }
              />
              <Typography
                text={
                  'I acknowledge that the start-up support is an opportunity to enable me to kick start an early childhood development enterprise and will only be provided if I continue to deliver childcare services to a maximum of 6 children each month.'
                }
                type="body"
                color={'textMid'}
              />
            </div>
            <div
              className="mt-2 flex items-start gap-2"
              onClick={() => onOptionSelected(!questions?.[2].answer, 2)}
            >
              <Checkbox
                checked={
                  startupSupportAgreementSigned
                    ? startupSupportAgreementSigned
                    : undefined || questions?.[2].answer
                }
                onCheckboxChange={(e) => onOptionSelected(e.checked, 2)}
              />
              <Typography
                text={
                  'I further acknowledge that the funding is provided subject to the following requirements being met and maintained: Registered the required number of children - maximum of 6 children.'
                }
                type="body"
                color={'textMid'}
              />
            </div>
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
              onClick={() =>
                setAgreementStep(
                  StartupAgreementSteps.STARTUP_ACCEPT_AGREEMENT2
                )
              }
              disabled={questions?.some((item) => item?.answer === false)}
            />
          </div>
        </div>
      </div>
    </>
  );
};
