import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import { Label, Header } from '@/pages/mom/pregnant-profile/components';
import { DynamicFormProps } from '../../../dynamic-form';

export const maternalDistressVisitSection = 'Maternal distress screening';

export const MidUpperArmCircumferenceResultStep = ({
  mother,
  sectionQuestions,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const name = mother?.user?.firstName;
  const sectionQuestionsValues = sectionQuestions?.[0]?.questions;

  useEffect(() => {
    if (
      sectionQuestionsValues?.filter((item) => item?.answer !== undefined)
        .length === 3
    )
      setEnableButton?.(true);
  }, [sectionQuestionsValues, sectionQuestionsValues?.length, setEnableButton]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const [questions, setAnswers] = useState([
    {
      question: 'Felt unable to stop worrying or thinking too much?',
      answer: undefined,
    },
    {
      question: 'Felt down, depressed or hopeless?',
      answer: undefined,
    },
    {
      question: 'Had thoughts and plans to harm yourself or commit suicide?',
      answer: undefined,
    },
  ]);

  const renderAlert = useMemo(() => {
    if (sectionQuestionsValues?.[2].answer === true) {
      return (
        <Alert
          type="error"
          title={`Refer ${name} to the clinic immediately for emergency care.`}
          titleColor="alertDark"
          list={[
            `Give ${name} the 24-hour suicide crisis line number: 0800 567 567`,
            'Your team leader will be notified. Call them if you need extra support.',
          ]}
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationCircleIcon', 'text-alertMain w-10 h-10')}
            </div>
          }
        />
      );
    }

    if (
      sectionQuestionsValues?.[0].answer === true ||
      sectionQuestionsValues?.[1].answer === true
    ) {
      return (
        <Alert
          type="warning"
          title={`${name} is experiencing distress.`}
          titleColor="alertDark"
          list={[`Refer ${name} to the clinic for additional support`]}
          customIcon={
            <div className="rounded-full">
              {renderIcon('ExclamationCircleIcon', 'text-alertMain w-10 h-10')}
            </div>
          }
        />
      );
    }
  }, [name, sectionQuestionsValues]);

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
    },
    [questions, setQuestions]
  );

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={maternalDistressVisitSection}
      />
      <div className="p-4">
        <Label text="In the last 2 weeks, have you:" />
      </div>
      <Divider dividerType="dashed" />
      {questions.map((item, index) => {
        // if (index === 0 && !isImmunisationQuestion) return <></>;
        // if (index === 1 && !isVitaminAQuestion) return <></>;
        // if (index === 2 && !isDewormingQuestion) return <></>;

        return (
          <Fragment key={item.question}>
            <div className="p-2">
              <Typography
                type="body"
                text={item.question}
                color="textDark"
                className="mb-2"
              />
              <ButtonGroup<boolean>
                color="secondary"
                type={ButtonGroupTypes.Button}
                options={options}
                onOptionSelected={(value) => onOptionSelected(value, index)}
              />
            </div>
          </Fragment>
        );
      })}

      <div className="p-4">{renderAlert}</div>
      <div className="relative flex flex-col gap-3 p-4"></div>
    </>
  );
};
