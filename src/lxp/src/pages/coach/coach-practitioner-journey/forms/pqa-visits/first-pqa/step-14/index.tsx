import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import { DynamicFormProps } from '../../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { options as step12Options } from '../step-12/options';
import { options as step13Options } from '../step-13/options';
import { ReactComponent as Emoji3 } from '@/assets/ECD_Connect_emoji3.svg';
import { replaceBraces } from '@ecdlink/core';
import { step13VisitSection } from '../step-13';
import { step12VisitSection } from '../step-12';

export const step14VisitSection = 'Step 14';
export const step14CertificateQuestion =
  'Are you re-issuing the SmartSpace certificate for {client}’s venue?';
export const step14NoteQuestion =
  'Together with the franchisee, agree on what next steps can be taken and note them here:';

export const Step14 = ({
  smartStarter,
  sectionQuestions,
  setSectionQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: step14CertificateQuestion,
      answer: '',
    },
    {
      question: step14NoteQuestion,
      answer: '',
    },
  ]);

  const name = smartStarter?.user?.firstName || 'the smartStarter';

  const step12Total = 17;
  const step13Total = 5;
  const step12Answer = sectionQuestions?.find(
    (item) => item.visitSection === step12VisitSection
  )?.questions[0].answer as string[];
  const step13Answer = sectionQuestions?.find(
    (item) => item.visitSection === step13VisitSection
  )?.questions[0].answer as string[];

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
      setSectionQuestions?.([
        {
          visitSection: step14VisitSection,
          questions: updatedQuestions,
        },
      ]);

      if (updatedQuestions[1].answer !== '') {
        setEnableButton?.(true);
      } else {
        setEnableButton?.(false);
      }
    },
    [questions, setEnableButton, setSectionQuestions]
  );

  const renderTopCard = useMemo(() => {
    const list = [
      'Venue scored 12 or more on standards 1 to 17.',
      'You are satisfied that there is no danger to children.',
      'Actions have been agreed for any standards 1 to 21 that are not met, and recorded in the comment box below.',
    ];

    if (step12Answer?.length < 12) {
      return (
        <>
          <Alert
            className="mb-4"
            type="error"
            title={`You cannot reissue ${name}’s SmartSpace Licence.`}
            list={[
              `Discuss ways that ${name} can prepare for the next SmartSpace visit.`,
              `Schedule a follow-up visit with ${name}.`,
            ]}
          />
          <Alert
            type="info"
            title={`${name}’s venue scored ${
              step12Answer?.length || 0
            }/17 for the basic standards. To get a SmartSpace certificate re-issued, the following must be true:`}
            list={list}
          />
        </>
      );
    }

    return (
      <Alert
        type="info"
        title={`${name}’s venue scored ${
          step12Answer?.length || 0
        }/17 for the basic standards. To get a SmartSpace certificate re-issued, the following must be true:`}
        list={list}
      />
    );
  }, [name, step12Answer]);

  const renderBottomCard = useMemo(() => {
    if (
      step13Answer?.length === step13Total &&
      step12Answer?.length === step12Total
    ) {
      return (
        <Alert
          className="mt-4"
          variant="outlined"
          type="success"
          title={`${name}’s venue meets all the basic SmartSpace standards as well as the additional standards!`}
          customIcon={
            <div>
              <Emoji3 className="h-auto w-16" />
            </div>
          }
        />
      );
    }

    return (
      <>
        {step12Answer?.length !== step12Total && (
          <Alert
            className="mb-4"
            type="warning"
            title={`${name}’s venue does not meet the basic SmartSpace standards. ${
              smartStarter?.user?.gender?.description === 'Female'
                ? 'She'
                : 'He'
            } is still working on:`}
            list={step12Options.question1.filter(
              (option) => !step12Answer?.some((item) => item === option)
            )}
          />
        )}
        {step13Answer?.length !== step13Total && (
          <Alert
            type="info"
            title={`${name}’s venue meets all the basic SmartSpace standards. She is working towards these additional standards:`}
            list={step13Options.question1.filter(
              (option) => !step13Answer?.some((item) => item === option)
            )}
          />
        )}
      </>
    );
  }, [name, smartStarter, step12Answer, step13Answer]);

  return (
    <div className="p-4">
      <Typography
        type="h2"
        className="mb-4"
        text="Rating & next steps"
        color="textDark"
      />
      {renderTopCard}
      {step12Answer?.length >= 12 && (
        <>
          <Typography
            type="h4"
            text={replaceBraces(questions[0].question, name)}
            color="textDark"
            className="mt-4 mb-2"
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={(value) => onOptionSelected(value, 0)}
          />
        </>
      )}
      <FormInput
        className="my-4"
        label={questions[1].question}
        value={questions[1].answer}
        onChange={(e) => onOptionSelected(e.target.value, 1)}
        textInputType="textarea"
        placeholder={'e.g. create a list of emergency numbers'}
      />
      {renderBottomCard}
    </div>
  );
};
