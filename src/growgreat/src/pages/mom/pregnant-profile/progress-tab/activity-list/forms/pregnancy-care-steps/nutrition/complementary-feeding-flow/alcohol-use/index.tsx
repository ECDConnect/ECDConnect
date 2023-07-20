import { Header, Label } from '@/pages/infant/infant-profile/components';
import { DynamicFormProps } from '../../../../dynamic-form';
import { Fragment, useCallback, useMemo, useState } from 'react';
import {
  ActionModal,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Colours,
  Dialog,
  DialogPosition,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import Pregnant from '@/assets/pregnant.svg';
import { TipCard } from '@/pages/mom/pregnant-profile/components';
import { QuestionMarkCircleIcon } from '@heroicons/react/solid';
import { HealthPromotion } from '../../../../components/health-promotion';

export const getGroupColor = (count: number): Colours => {
  if (count < 4) {
    return 'errorDark';
  }

  if (count < 5) {
    return 'alertDark';
  }

  return 'successDark';
};

export const AlcoholUseStep = ({
  mother,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
  sectionQuestions,
  isTipPage,
}: DynamicFormProps) => {
  const name = useMemo(() => mother?.user?.firstName || '', [mother]);
  const sectionQuestionsValues = sectionQuestions?.[0]?.questions;
  const visitSection = `Alcohol use`;
  const [alcoholAbuseInfo, setAlcoholAbuseInfo] = useState(false);

  const getGroupColor = (count: number): Colours => {
    if (count >= 2) {
      return 'errorDark';
    }

    return 'successDark';
  };

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
    { text: 'NA', value: 'NA' },
    { text: '1 or 2', value: '1 or 2' },
    { text: 'More than 2', value: 'More than 2' },
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

  const tAceAnswers = sectionQuestionsValues?.filter((item) => {
    return (
      item?.answer === true ||
      item?.answer === 'More than 2' ||
      item?.answer === '1 or 2'
    );
  });

  const tAceAnswersScore =
    tAceAnswers?.[0]?.answer === 'More than 2' &&
    tAceAnswers?.[0]?.question ===
      '(T) Tolerance: how many drinks does it take to make you high?'
      ? tAceAnswers?.length + 1
      : tAceAnswers?.length;

  const renderScore = useMemo(() => {
    if (tAceAnswersScore !== undefined) {
      return (
        <div className="mt-2 flex items-center gap-2">
          <Typography
            type="h4"
            color={getGroupColor(tAceAnswersScore!)}
            text={`Score:`}
          />
          <div
            className={`text-14 flex h-5 w-5 rounded-full bg-${getGroupColor(
              tAceAnswersScore
            )} items-center justify-center font-bold text-white`}
          >
            {tAceAnswersScore}
          </div>
        </div>
      );
    }
    return (
      <div className="mt-2 flex items-center gap-2">
        <Typography
          type="h4"
          color={getGroupColor(tAceAnswersScore!)}
          text={`Score:`}
        />
        <div
          className={`text-14 flex h-5 w-5 rounded-full bg-${getGroupColor(
            tAceAnswersScore!
          )} items-center justify-center font-bold text-white`}
        >
          {0}
        </div>
      </div>
    );
  }, [tAceAnswersScore]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <HealthPromotion
          title={`Discuss with ${name}`}
          subTitle={visitSection}
          section={visitSection}
          onClose={() => setIsTip && setIsTip(false)}
        />
      </Dialog>
    );
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
                <ButtonGroup<string>
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
          </Fragment>
        ))}
        <Dialog
          // fullScreen
          visible={alcoholAbuseInfo}
          position={DialogPosition.Middle}
          className={'px-4'}
        >
          <div>
            <ActionModal
              className="z-50"
              title={`What is 1 standard drink?`}
              customDetailText={
                <div className="flex flex-col items-start" color="textMid">
                  <Typography type="body" text="About:" />
                  {[
                    '300ml (1 small bottle) of 5% beer',
                    '117ml (1 small glass) of 13% wine',
                    '37ml (1 shotglass) of 40% spirits (for example: gin whiskey, vodka).',
                  ].map((item) => (
                    <li key={item} className="text-textMid">
                      {item}
                    </li>
                  ))}
                </div>
              }
              icon="QuestionMarkCircleIcon"
              iconColor="infoDark"
              iconClassName="h-10 w-10"
              actionButtons={[
                {
                  colour: 'primary',
                  text: 'Close',
                  textColour: 'primary',
                  type: 'outlined',
                  leadingIcon: 'XIcon',
                  onClick: () => {
                    setAlcoholAbuseInfo(false);
                  },
                },
              ]}
            />
          </div>
        </Dialog>
        {renderScore}
        {tAceAnswersScore! >= 2 && (
          <div className="flex flex-col gap-4 p-4">
            <Alert
              type="error"
              title={`Refer ${name} to the clinic. ${name} may need support to reduce drinking while pregnant`}
              customIcon={
                <div className="rounded-full">
                  {renderIcon(
                    'ExclamationCircleIcon',
                    'text-errorMain w-10 h-10'
                  )}
                </div>
              }
            />
          </div>
        )}
      </div>
    </>
  );
};
