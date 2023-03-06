import {
  Alert,
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
} from '@ecdlink/ui';
import {
  Label,
  Header,
  TipCard,
} from '@/pages/infant/infant-profile/components';
import P2 from '@/assets/pillar/p2.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as BrainIcon } from '@/assets/pillar/pillar2/brain.svg';
import { ReactComponent as EarIcon } from '@/assets/pillar/pillar2/ear.svg';
import { ReactComponent as EyeIcon } from '@/assets/pillar/pillar2/eye.svg';
import { ReactComponent as ArmIcon } from '@/assets/pillar/pillar2/arm.svg';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { MoreInformation } from './more-information';

const mocked_week = 14;

export const DevelopmentalScreeningWeeksStep = ({
  infant,
  isTipPage,
  setSectionQuestions: setQuestions,
  setEnableButton,
  setIsTip,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      icon: <EarIcon />,
      title: 'Hearing',
      question: 'Felt unable to stop worrying or thinking too much?',
      answer: '',
    },
    {
      icon: <EyeIcon />,
      title: 'Seeing',
      question: 'Felt down, depressed or hopeless?',
      answer: '',
    },
    {
      icon: <BrainIcon className="h-6 w-6" />,
      title: 'Brain',
      question: 'Had thoughts and plans to harm yourself or commit suicide?',
      answer: '',
    },
    {
      icon: <ArmIcon className="h-5 w-6" />,
      title: 'Moving',
      question: 'Holds their head upright when held against shoulder',
      answer: '',
    },
  ]);

  const visitSection = 'Developmental screening';

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant]
  );

  // TODO: add integration (G5.4.3)
  const mockedFollowUp = {
    message: `In the 14 week developmental screening, ${name} had issues with these skills:`,
    list: ['Hearing', 'Seeing'],
  };

  // TODO: add integration (G5.4.3)
  const mockedNote = {
    name: 'Notes from 12 March visit',
    type: 'formula milk only',
    note: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  };
  // TODO: add integration (G5.4.3)
  const isPreviousNote = true;

  // TODO: add integration (G5.4.3)
  const isFollowUp = false;

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

      const formattedQuestions = updatedQuestions.map((item) => {
        const { icon, title, ...rest } = item;

        return rest;
      });

      setAnswers(updatedQuestions);
      setQuestions?.([
        {
          visitSection,
          questions: formattedQuestions,
        },
      ]);

      const isCompleted = updatedQuestions.every((item) => item.answer !== '');

      if (isCompleted && setEnableButton) {
        setEnableButton(true);
      }
    },
    [questions, setEnableButton, setQuestions]
  );

  const renderNote = useMemo(() => {
    return (
      <>
        <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
          <Typography type="h3" text={mockedNote.name} color="textDark" />
          <Typography type="body" text={mockedNote.note} color="textMid" />
        </div>
      </>
    );
  }, [mockedNote.name, mockedNote.note]);

  if (isTipPage) {
    return <MoreInformation onClose={() => setIsTip && setIsTip(false)} />;
  }

  return (
    <>
      <Header
        customIcon={P2}
        title={visitSection}
        iconHexBackgroundColor={activitiesColours.pillar2.primaryColor}
        hexBackgroundColor={activitiesColours.pillar2.secondaryColor}
        subTitle={
          isFollowUp
            ? 'Follow up'
            : `${mocked_week} week${mocked_week > 1 && 's'}`
        }
      />
      <div className="flex flex-col gap-4 p-4">
        {isFollowUp ? (
          <>
            <Alert
              type="warning"
              title={mockedFollowUp.message}
              titleColor="textDark"
              list={mockedFollowUp.list}
              customIcon={<PollyTime className="w-28" />}
            />
            <Typography
              type="h3"
              text={`Discuss with ${caregiverName}:`}
              color="textDark"
            />
            <Label text="Do you have an update?" />
            <Divider dividerType="dashed" />
            <Label
              text={`Remember, children develop at different speeds. Keep taking ${name} for check-ups and monitoring their development.`}
            />
            <Divider dividerType="dashed" />
            {isPreviousNote && renderNote}
          </>
        ) : (
          <>
            <TipCard
              buttonText="See more info"
              buttonIcon="InformationCircleIcon"
              onClick={() => setIsTip && setIsTip(true)}
            />
            <Typography
              type="h3"
              text={`${mocked_week} week developmental screening`}
              color="textDark"
            />
            <Divider dividerType="dashed" />
            {questions.map((item, index) => (
              <div key={item.question}>
                <div className="mb-2 flex items-center gap-2">
                  <div className="bg-tertiary flex h-9 w-9 items-center justify-center rounded-full">
                    {item.icon}
                  </div>
                  <Typography type="h4" text={item.title} color="textDark" />
                </div>
                <Typography type="body" text={item.question} color="textDark" />
                <ButtonGroup<boolean>
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  options={options}
                  onOptionSelected={(value) => onOptionSelected(value, index)}
                />
              </div>
            ))}
            <Divider dividerType="dashed" />
            <Label text="Do you have any specific concerns about how Themba hears, sees, communicates, learns, behaves, interacts with others, or how they use their hands, arms, legs and body?" />
            <Divider dividerType="dashed" />
            <FormInput
              label="Add a note"
              subLabel="Optional"
              textInputType="textarea"
              placeholder={'E.g. Caregiver is concerned about baby’s hearing.'}
            />
            {isPreviousNote && (
              <>
                {renderNote}
                <Button
                  type="outlined"
                  color="primary"
                  textColor="primary"
                  text="See previous notes"
                  icon="DocumentTextIcon"
                />
              </>
            )}
          </>
        )}
      </div>
    </>
  );
};
