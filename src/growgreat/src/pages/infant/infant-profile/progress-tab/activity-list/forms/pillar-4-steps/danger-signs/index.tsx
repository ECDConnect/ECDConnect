import { Header } from '@/pages/infant/infant-profile/components';
import P4 from '@/assets/pillar/p4.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';
import {
  Alert,
  CheckboxChange,
  Colours,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { noneOption, riskOption1, riskOption2, options } from './options';
import { CheckboxGroup } from '@ecdlink/ui';
import { DynamicFormProps } from '../../dynamic-form';
import { activitiesColours } from '../../../activities-list';
import { ReactComponent as Translation } from '@/assets/translation.svg';
import { Translations } from './translations';

export const getGroupColor = (count: number): Colours => {
  if (count < 4) {
    return 'errorDark';
  }

  if (count < 6) {
    return 'alertDark';
  }

  return 'successDark';
};

export const dietFormQuestion =
  'What did you give {client} to eat or drink in the last 24 hours?';

export const DangerSignsStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
  setRisk,
}: DynamicFormProps) => {
  const [optionList, setOptionList] = useState<
    {
      title: string;
      disabled?: boolean;
    }[]
  >(options);
  const [currentOption, setCurrentOption] = useState<string>();
  const [question, setAnswers] = useState({
    question: `Tick the danger signs {client} is experiencing:`,
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const visitSection = 'Danger signs';

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        setEnableButton?.(true);
        return setQuestions?.([
          {
            visitSection,
            questions: [updatedQuestion],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setEnableButton?.(!!currentAnswers?.length);
      setAnswers(updatedQuestion);
      return setQuestions?.([
        {
          visitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, question, setEnableButton, setQuestions]
  );

  const handleOnChangeSelectedOptions = useCallback(() => {
    if (!answers?.includes(noneOption) && answers.length) {
      setRisk && setRisk(0);
      if (answers?.includes(riskOption1) || answers.includes(riskOption2)) {
        setRisk && setRisk(answers?.includes(riskOption2) ? 2 : 1);
      }
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.title === noneOption) {
            return { ...item, disabled: true };
          }
          return { ...item, disabled: false };
        })
      );
    }

    if (answers?.includes(noneOption)) {
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.title !== noneOption) {
            return { ...item, disabled: true };
          }
          return { ...item, disabled: false };
        })
      );
    }

    return setOptionList((prevState) =>
      prevState.map((item) => ({ ...item, disabled: false }))
    );
  }, [answers, setRisk]);

  useEffect(() => {
    handleOnChangeSelectedOptions();
  }, [handleOnChangeSelectedOptions]);

  if (isTipPage && currentOption) {
    return (
      <Translations
        toTranslate={currentOption}
        onClose={() => setIsTip && setIsTip(false)}
      />
    );
  }

  return (
    <>
      <Header
        customIcon={P4}
        title={visitSection}
        subTitle="Check for these signs"
        iconHexBackgroundColor={activitiesColours.pillar4.primaryColor}
        hexBackgroundColor={activitiesColours.pillar4.secondaryColor}
      />
      <div className="flex flex-col gap-2 p-4">
        <Typography
          type="h4"
          color="black"
          text={replaceBraces(question.question, name)}
        />
        {optionList.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item.title}
            key={item.title}
            title={item.title}
            checked={answers?.some((option) => option === item.title)}
            value={item.title}
            onChange={onCheckboxChange}
            disabled={item?.disabled}
            {...(options.length - 1 > index && {
              extraChildren: (
                <button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentOption(item.title);
                    setIsTip && setIsTip(true);
                  }}
                >
                  <Translation className="h-6 w-6" />
                </button>
              ),
            })}
          />
        ))}
        {!!answers.length && !answers.includes(noneOption) && (
          <Alert
            type="error"
            title={`Take ${name} to the clinic immediately or call an ambulance!`}
            customIcon={
              <div className="rounded-full">
                {renderIcon(
                  'ExclamationCircleIcon',
                  'text-errorMain w-10 h-10'
                )}
              </div>
            }
          />
        )}
      </div>
    </>
  );
};
