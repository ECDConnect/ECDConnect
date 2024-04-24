import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  FormInput,
  Typography,
  DialogPosition,
  Dialog,
} from '@ecdlink/ui';
import {
  Label,
  Header,
  TipCard,
} from '@/pages/infant/infant-profile/components';
import P2 from '@/assets/pillar/p2.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as BrainIcon } from '@/assets/pillar/pillar2/brain.svg';
import { ReactComponent as EarIcon } from '@/assets/pillar/pillar2/ear.svg';
import { ReactComponent as EyeIcon } from '@/assets/pillar/pillar2/eye.svg';
import { ReactComponent as ArmIcon } from '@/assets/pillar/pillar2/arm.svg';
import { MoreInformation } from '../../components/more-information';
import { replaceBraces, usePrevious } from '@ecdlink/core';
import { differenceInMonths } from 'date-fns';
import { useSelector } from 'react-redux';
import { getVisitAnswersForInfantSelector } from '@/store/visit/visit.selectors';
import { useParams } from 'react-router';
import { InfantProfileParams } from '@/pages/infant/infant-profile/infant-profile.types';
import { RootState } from '@/store/types';
import {
  getInfantPreviousVisitSelector,
  getInfantVisitByVisitIdSelector,
} from '@/store/infant/infant.selectors';
import { questionsTimes } from './questionsTimes';

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
  const [sectionName, setSectionName] = useState('');
  const [headerText, setHeaderText] = useState('');
  const [questions, setAnswers] = useState<
    {
      icon?: JSX.Element;
      title?: string;
      question: string;
      answer: string;
    }[]
  >([
    {
      question: noteQuestion,
      answer: '',
    },
  ]);

  const noteQuestionIndex = 0;

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const ageInMonths = useMemo(
    () =>
      infant?.user?.dateOfBirth &&
      differenceInMonths(new Date(), new Date(infant?.user?.dateOfBirth)),
    [infant?.user?.dateOfBirth]
  );

  const previousAgeInMonths = usePrevious(ageInMonths);

  const previousAnswers = useSelector(getVisitAnswersForInfantSelector);

  const previousNotes = useMemo(
    () => previousAnswers?.filter((item) => item.question === noteQuestion),
    [previousAnswers]
  );

  const { visitId } = useParams<InfantProfileParams>();

  const visit = useSelector((state: RootState) =>
    getInfantVisitByVisitIdSelector(state, visitId)
  );
  const previousPlannedVisit = useSelector((state: RootState) =>
    getInfantPreviousVisitSelector(state, visit?.plannedVisitDate || '')
  );

  const previousNote = useMemo(() => {
    const insertedDate = previousPlannedVisit?.plannedVisitDate;
    const date = !!insertedDate ? new Date(insertedDate) : undefined;
    const note = previousNotes?.find(
      (item) => item.question === noteQuestion
    )?.questionAnswer;

    return { date, note };
  }, [previousNotes, previousPlannedVisit?.plannedVisitDate]);

  const getQuestions = useCallback(
    (
      timing:
        | 'fourteenWeeks'
        | 'sixMonths'
        | 'nineMonths'
        | 'twelveMonths'
        | 'eighteenMonths'
    ) => {
      const hearing = questionsTimes[timing].hearing.map((item, index) => ({
        ...(index === 0 ? { icon: <EarIcon /> } : {}),
        ...(index === 0 ? { title: 'Hearing' } : {}),
        question: item,
        answer: '',
      }));

      const seeing = questionsTimes[timing].seeing.map((item, index) => ({
        ...(index === 0 ? { icon: <EyeIcon /> } : {}),
        ...(index === 0 ? { title: 'Seeing' } : {}),
        question: item,
        answer: '',
      }));

      const brain = questionsTimes[timing].brain.map((item, index) => ({
        ...(index === 0 ? { icon: <BrainIcon className="h-6 w-6" /> } : {}),
        ...(index === 0 ? { title: 'Brain' } : {}),
        question: item,
        answer: '',
      }));

      const moving = questionsTimes[timing].moving.map((item, index) => ({
        ...(index === 0 ? { icon: <ArmIcon className="h-5 w-6" /> } : {}),
        ...(index === 0 ? { title: 'Moving' } : {}),
        question: item,
        answer: '',
      }));

      return [...questions, ...hearing, ...seeing, ...brain, ...moving];
    },
    [questions]
  );

  const handleQuestionsTimes = useCallback(() => {
    if (previousAgeInMonths === ageInMonths) return;
    const numberOfAgeInMonths = Number(ageInMonths);

    if (numberOfAgeInMonths >= 18) {
      setSectionName('18 month developmental screening');
      setHeaderText('18 month');
      return setAnswers(getQuestions('eighteenMonths'));
    }

    if (numberOfAgeInMonths >= 12) {
      setSectionName('12 month developmental screening');
      setHeaderText('12 month');
      return setAnswers(getQuestions('twelveMonths'));
    }

    if (numberOfAgeInMonths >= 9) {
      setSectionName('9 month developmental screening');
      setHeaderText('9 month');
      return setAnswers(getQuestions('nineMonths'));
    }

    if (numberOfAgeInMonths >= 6) {
      setSectionName('6 month developmental screening');
      setHeaderText('6 month');
      return setAnswers(getQuestions('sixMonths'));
    }

    setSectionName('14 week developmental screening');
    setHeaderText('14 week');

    return setAnswers(getQuestions('fourteenWeeks'));
  }, [ageInMonths, getQuestions, previousAgeInMonths]);

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

      const isCompleted = formattedQuestions
        .filter((item, index) => index !== noteQuestionIndex)
        .every((item) => item.answer !== '');

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

  useLayoutEffect(() => {
    handleQuestionsTimes();
  }, [handleQuestionsTimes]);

  if (isTipPage) {
    return (
      <Dialog
        fullScreen={true}
        visible={isTipPage}
        position={DialogPosition.Full}
      >
        <MoreInformation
          client={name}
          section={sectionName}
          subTitle="Developmental screening"
          onClose={() => setIsTip?.(false)}
          title={headerText}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={P2}
        title={DevelopmentalScreeningVisitSection}
        iconHexBackgroundColor={activitiesColours.pillar2.primaryColor}
        hexBackgroundColor={activitiesColours.pillar2.secondaryColor}
        subTitle={headerText}
      />
      <div className="flex flex-col gap-4 p-4">
        <TipCard
          buttonText="See activities to share"
          buttonIcon="InformationCircleIcon"
          onClick={() => setIsTip && setIsTip(true)}
        />
        <Typography
          type="h3"
          text={`${headerText} developmental screening`}
          color="textDark"
        />
        <Divider dividerType="dashed" />
        <Typography
          type="h3"
          text={`Check what ${name} can do`}
          color="textDark"
        />
        {questions.map((item, index) => {
          if (index === noteQuestionIndex) return null;

          return (
            <div key={item.question}>
              <div className="mb-2 flex items-center gap-2">
                {item.icon && (
                  <div className="bg-tertiary flex h-9 w-9 items-center justify-center rounded-full">
                    {item.icon}
                  </div>
                )}
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
          text={replaceBraces(questions[noteQuestionIndex]?.question, name)}
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
