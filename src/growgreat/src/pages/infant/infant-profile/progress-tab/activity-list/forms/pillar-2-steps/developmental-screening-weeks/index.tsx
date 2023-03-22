import {
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
import { MoreInformation } from '../../components/more-information';
import { replaceBraces } from '@ecdlink/core';
import { differenceInWeeks } from 'date-fns';
import { useSelector } from 'react-redux';
import {
  getPreviousVisitInformationForInfantSelector,
  getVisitAnswersForInfantSelector,
} from '@/store/visit/visit.selectors';

export const DevelopmentalScreeningVisitSection = 'Developmental screening';
export const noteQuestion =
  'Do you have any specific concerns about how {client} hears, sees, communicates, learns, behaves, interacts with others, or how they use their hands, arms, legs and body?';

export const DevelopmentalScreeningWeeksStep = ({
  infant,
  isTipPage,
  setSectionQuestions: setQuestions,
  setEnableButton,
  setIsTip,
}: DynamicFormProps) => {
  const [isPreviousNotes, setIsPreviousNotes] = useState(false);
  const [questions, setAnswers] = useState([
    {
      icon: <EarIcon />,
      title: 'Hearing',
      question: 'Gets a fright when they hear a loud sound',
      answer: '',
    },
    {
      icon: <EyeIcon />,
      title: 'Seeing',
      question: 'Follows faces or close objects with their eyes',
      answer: '',
    },
    {
      icon: <BrainIcon className="h-6 w-6" />,
      title: 'Brain',
      question: 'Smiles at people',
      answer: '',
    },
    {
      icon: <ArmIcon className="h-5 w-6" />,
      title: 'Moving',
      question: 'Holds their head upright when held against shoulder',
      answer: '',
    },
    {
      question: noteQuestion,
      answer: '',
    },
  ]);

  const noteQuestionIndex = 4;

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const weeks = useMemo(
    () =>
      infant?.user?.dateOfBirth &&
      differenceInWeeks(new Date(), new Date(infant?.user?.dateOfBirth)),
    [infant?.user?.dateOfBirth]
  );

  const previousVisit = useSelector(
    getPreviousVisitInformationForInfantSelector
  );
  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const previousNotes = useMemo(
    () => previousAnswers?.filter((item) => item.question === noteQuestion),
    [previousAnswers]
  );

  // TODO: get the last visit data, it's necessary check the date from the last visit
  const previousNote = useMemo(() => {
    const insertedDate = previousVisit?.visitDataStatus?.[0]?.insertedDate;
    const date = !!insertedDate ? new Date(insertedDate) : undefined;
    const note = previousNotes?.find(
      (item) => item.question === noteQuestion
    )?.questionAnswer;

    return { date, note };
  }, [previousNotes, previousVisit?.visitDataStatus]);

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
          visitSection: DevelopmentalScreeningVisitSection,
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

  const renderNote = useCallback((date: Date, note: string) => {
    return (
      <div className="bg-uiBg rounded-15 flex flex-col gap-2 p-4">
        <Typography
          type="h3"
          text={`Notes from ${date.toLocaleDateString('en-ZA', {
            day: 'numeric',
            month: 'long',
          })} visit`}
          color="textDark"
        />
        <Typography type="body" text={note || ''} color="textMid" />
      </div>
    );
  }, []);

  console.log(previousNote);
  if (isTipPage) {
    return (
      <MoreInformation
        client={name}
        section="Developmental screening 2"
        subTitle="Developmental screening"
        onClose={() => setIsTip?.(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P2}
        title={DevelopmentalScreeningVisitSection}
        iconHexBackgroundColor={activitiesColours.pillar2.primaryColor}
        hexBackgroundColor={activitiesColours.pillar2.secondaryColor}
        {...(weeks
          ? {
              subTitle: `${weeks} week${weeks > 1 && 's'}`,
            }
          : {})}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See activities to share"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Typography
          type="h3"
          text={`${weeks} week developmental screening`}
          color="textDark"
        />
        <Divider dividerType="dashed" />
        {questions.map((item, index) => {
          if (index === noteQuestionIndex) return null;

          return (
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
          );
        })}
        <Divider dividerType="dashed" />
        <Label
          text={replaceBraces(questions[noteQuestionIndex].question, name)}
        />
        <Divider dividerType="dashed" />
        <FormInput
          label="Add a note"
          subLabel="Optional"
          value={questions[noteQuestionIndex].answer}
          onChange={(e) => onOptionSelected(e.target.value, noteQuestionIndex)}
          textInputType="textarea"
          placeholder={'E.g. Caregiver is concerned about baby’s hearing.'}
        />
        {!!previousNote.date &&
          !!previousNote.note &&
          renderNote(previousNote.date, previousNote.note)}
        {isPreviousNotes &&
          previousNotes?.map((item) =>
            renderNote(new Date(item.insertedDate), item.questionAnswer || '')
          )}
        {Number(previousNotes?.length) > 1 && (
          <Button
            type="outlined"
            color="primary"
            textColor="primary"
            text={
              isPreviousNotes ? 'Hide previous notes' : 'See previous notes'
            }
            icon="DocumentTextIcon"
            onClick={() => setIsPreviousNotes((prevState) => !prevState)}
          />
        )}
      </div>
    </>
  );
};
