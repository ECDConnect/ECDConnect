import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { replaceBraces } from '@ecdlink/core';

export const idDocumentFirstQuestion = 'Does {client} have an ID document?';
export const idDocumentSecondQuestion =
  'Is {client} a South African citizen or permanent resident?';

export const IdDocumentStep = ({
  mother,
  sectionQuestions: questions,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const visitSection = `ID document`;
  const [answer, setAnswer] = useState<boolean | undefined>(undefined);
  const [answer1, setAnswer1] = useState<boolean | undefined>(undefined);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  useEffect(() => {
    setQuestions &&
      setQuestions([
        {
          visitSection: visitSection,
          questions: [
            {
              question: idDocumentFirstQuestion,
              answer: answer,
            },
            {
              question: idDocumentSecondQuestion,
              answer: answer1,
            },
          ],
        },
      ]);
    setEnableButton && setEnableButton(true);
  }, [answer, answer1, setEnableButton, setQuestions, visitSection]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <div className="mt-2 flex flex-col gap-2">
          <Typography
            type="body"
            text={replaceBraces(idDocumentFirstQuestion, name)}
            color="textDark"
          />
          <ButtonGroup<boolean>
            color="secondary"
            type={ButtonGroupTypes.Button}
            options={options}
            onOptionSelected={(value) => {
              setAnswer(value as boolean);
            }}
            selectedOptions={answer}
          />
        </div>
        {answer === false && (
          <div className="mt-2 flex flex-col gap-2">
            <Typography
              type="body"
              text={replaceBraces(idDocumentSecondQuestion, name)}
              color="textDark"
            />
            <ButtonGroup<boolean | undefined>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={options}
              onOptionSelected={(value) => {
                setAnswer1(value as boolean);
              }}
              selectedOptions={answer1}
            />
          </div>
        )}
        {answer === true && (
          <Alert
            title={`Great, ${name} can apply for a Child Support Grant (CSG) as soon as the baby is born!`}
            type={'success'}
            list={[
              `Encourage ${name} to get the baby's birth certificate from the hospital within 30 days of birth.`,
            ]}
          />
        )}
        {answer === false && answer1 === true && (
          <Alert
            title={`Refer ${name} to the Department of Home Affairs.`}
            type={'error'}
            list={[
              `Make sure you apply for your ID book. This will allow you to apply for the Child Support Grant (CSG) as soon as the baby is born.`,
              `Make sure you also get the baby's birth certificate from the hospital within 30 days of birth.`,
            ]}
          />
        )}
      </div>
    </>
  );
};
