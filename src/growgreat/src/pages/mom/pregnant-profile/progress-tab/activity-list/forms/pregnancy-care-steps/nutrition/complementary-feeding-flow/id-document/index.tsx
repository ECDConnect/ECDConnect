import { Header } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useEffect, useMemo, useState } from 'react';
import { Alert, ButtonGroup, ButtonGroupTypes, Typography } from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { HealthPromotion } from '../../../../components/health-promotion';
import { replaceBraces } from '@ecdlink/core';

export const IdDocumentStep = ({
  mother,
  sectionQuestions: questions,
  isTipPage,
  setIsTip,
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

  const question = useMemo(() => `Does {client} have an ID document?`, []);

  const question2 = useMemo(
    () => `Is {client} a South African citizen or permanent resident?`,
    []
  );

  useEffect(() => {
    setQuestions &&
      setQuestions([
        {
          visitSection: visitSection,
          questions: [
            {
              question: question,
              answer: answer,
            },
            {
              question: question2,
              answer: answer1,
            },
          ],
        },
      ]);
    setEnableButton && setEnableButton(true);
  }, [
    answer,
    answer1,
    question,
    question2,
    setEnableButton,
    setQuestions,
    visitSection,
  ]);

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

  if (isTipPage) {
    return (
      <HealthPromotion
        title={`Discuss with ${name}`}
        subTitle={visitSection}
        section={visitSection}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={visitSection}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="Health promotion"
          buttonIcon="ChatIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <div className="mt-2 flex flex-col gap-2">
          <Typography
            type="body"
            text={replaceBraces(question, name)}
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
              text={replaceBraces(question2, name)}
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
