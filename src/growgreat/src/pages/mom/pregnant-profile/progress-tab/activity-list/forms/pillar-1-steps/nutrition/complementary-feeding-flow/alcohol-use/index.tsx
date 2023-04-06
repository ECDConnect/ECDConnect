import { Header, Label } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { Fragment, useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAgeInYearsMonthsAndDays,
  replaceBraces,
  useDialog,
} from '@ecdlink/core';
import {
  ActionModal,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  CheckboxChange,
  Colours,
  Dialog,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { noneOption, options } from './options';
import { CheckboxGroup } from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';

export const getGroupColor = (count: number): Colours => {
  if (count < 4) {
    return 'errorDark';
  }

  if (count < 5) {
    return 'alertDark';
  }

  return 'successDark';
};

export const dietFormQuestion =
  'What did you give {client} to eat or drink in the last 48 hours?';

export const AlcoholUseStep = ({
  mother,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const dialog = useDialog();
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const visitSection = `Alcohol use`;
  const [alcoholAbuseInfo, setAlcoholAbuseInfo] = useState(false);

  const [questions, setAnswers] = useState([
    {
      question: '(T) Tolerance: how many drinks does it take to make you high?',
      answer: '',
    },
    {
      question: '(A) Have people annoyed you by criticizing your drinking?',
      answer: '',
    },
    {
      question: '(C) Have you ever felt you need to cut down on your drinking?',
      answer: '',
    },
    {
      question:
        '(E) Eye-opener: have you ever had a drink the first thing in the morning to steady your nerves or get rid of a hangover?',
      answer: '',
    },
  ]);

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const toleranceOptions = [
    { text: 'NA', value: false },
    { text: '1 or 2', value: false },
    { text: 'More than 2', value: true },
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
          visitSection,
          questions: updatedQuestions,
        },
      ]);

      const isCompleted = updatedQuestions.every((item) => item.answer !== '');

      if (isCompleted) {
        setEnableButton?.(true);
      }
    },
    [questions, setEnableButton, setQuestions, visitSection]
  );

  function standardDrinkAlert() {
    return dialog({
      position: DialogPosition.Middle,
      color: 'white',
      render(close) {
        return (
          <ActionModal
            className={'mx-4 bg-white'}
            title="What is 1 standard drink?"
            paragraphs={[
              'About:',
              '• 300ml (1 small bottle) of 5% beer',
              '• 117ml (1 small glass) of 13% wine',
              '• 37ml (1 shotglass) of 40% spirits (for example: gin whiskey, vodka).',
            ]}
            icon={'QuestionMarkCircleIcon'}
            iconColor={'infoDark'}
            iconBorderColor={'transparent'}
            iconClassName={'h-16 w-16'}
            actionButtons={[
              {
                text: 'Close',
                colour: 'primary',
                onClick: close,
                type: 'outlined',
                textColour: 'primary',
                leadingIcon: 'XIcon',
              },
            ]}
          />
        );
      },
    });
  }

  return (
    <>
      <Header
        customIcon={Pregnant}
        backgroundColor={'tertiary'}
        title={visitSection}
      />
      <div className="flex flex-col gap-2 p-4">
        <TipCard
          buttonText="See more info"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Alert
          type="info"
          title="Speak in a friendly and supportive way."
          className="mt-2"
        />
        <Label
          text={`Ask ${name} these questions about her drinking in the past 2 weeks:`}
          className="my-2"
        />
        <Divider dividerType="dashed" />
        {questions.map((item, index) => (
          <Fragment key={item.question}>
            {index === 0 ? (
              <>
                <div className="flex items-center">
                  <Typography
                    className="mt-4"
                    type="body"
                    text={item.question}
                    color="textDark"
                  />
                  <QuestionMarkCircleIcon
                    className={'text-infoMain h-6 w-8 rounded-full bg-white'}
                    width={25}
                    height={30}
                    onClick={() => setAlcoholAbuseInfo(true)}
                  />
                </div>
                <Typography
                  type="body"
                  text={`Choose NA if the client does not drink.`}
                  color="textMid"
                />
                <ButtonGroup<boolean>
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  options={toleranceOptions}
                  onOptionSelected={(value) => onOptionSelected(value, index)}
                />
              </>
            ) : (
              <>
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
              </>
            )}
            {/* <Typography
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
            /> */}
          </Fragment>
        ))}
        <Dialog
          // fullScreen
          visible={alcoholAbuseInfo}
          position={DialogPosition.Middle}
        >
          <div>
            <ActionModal
              className="z-50"
              title={`Only share this with ${name}`}
              detailText={`You can only share this information with your client, ${name}.`}
              icon="ExclamationCircleIcon"
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Share',
                  textColour: 'white',
                  type: 'filled',
                  leadingIcon: 'ShareIcon',
                  onClick: () => {
                    setAlcoholAbuseInfo(false);
                  },
                },
                // {
                //   colour: 'primary',
                //   text: 'Cancel',
                //   textColour: 'primary',
                //   type: 'outlined',
                //   leadingIcon: 'XIcon',
                //   onClick: onClose,
                // },
              ]}
            />
          </div>
        </Dialog>
      </div>
    </>
  );
};
