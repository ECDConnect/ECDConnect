import { Header, Label } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import { DynamicFormProps } from '../../../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  getAgeInYearsMonthsAndDays,
  replaceBraces,
  useDialog,
} from '@ecdlink/core';
import {
  ActionModal,
  CheckboxChange,
  Colours,
  Divider,
  Typography,
  DialogPosition,
} from '@ecdlink/ui';
import { noneOption, options } from './options';
import { CheckboxGroup } from '@ecdlink/ui';

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
  'What did you give {client} to eat or drink in the last 24 hours?';

export const DietFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const dateOfBirth = useMemo(
    () => infant?.user?.dateOfBirth,
    [infant?.user?.dateOfBirth]
  ) as string;

  const { years: ageYears, months: ageMonths } =
    getAgeInYearsMonthsAndDays(dateOfBirth);

  const isChild6Months = useMemo(
    () => !ageYears && ageMonths < 10,
    [ageMonths, ageYears]
  );

  const dialog = useDialog();

  const [optionList, setOptionList] = useState<
    {
      icon?: JSX.Element;
      title: string;
      description?: string;
      disabled?: boolean;
    }[]
  >(options(isChild6Months));

  useEffect(() => {
    setOptionList(options(isChild6Months));
  }, [isChild6Months]);

  const [question, setAnswers] = useState({
    question: dietFormQuestion,
    answer: [] as (string | number | undefined)[],
  });

  const answers = question.answer as string[];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant]
  );

  const visitSection = `What did {client} eat?`;

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        if (
          (event.value === noneOption && answers?.length) ||
          answers?.includes(noneOption)
        ) {
          return dialog({
            blocking: false,
            position: DialogPosition.Middle,
            color: 'bg-white',
            render: (onClose) => {
              return (
                <ActionModal
                  className="z-50"
                  icon="ExclamationCircleIcon"
                  iconColor="alertMain"
                  iconClassName="h-10 w-10"
                  title="You can only select “None of the above” if there are no foods selected"
                  detailText={`If ${name} is not eating any foods, first deselect all foods before selecting “None of the above”.`}
                  actionButtons={[
                    {
                      colour: 'primary',
                      text: 'Close',
                      textColour: 'primary',
                      type: 'outlined',
                      leadingIcon: 'XIcon',
                      onClick: onClose,
                    },
                  ]}
                />
              );
            },
          });
        }
        const currentAnswers = answers
          ? [...answers, event.value]
          : [event.value];

        const updatedQuestion = { ...question, answer: currentAnswers };

        setAnswers(updatedQuestion);
        setEnableButton && setEnableButton(true);
        return (
          setQuestions &&
          setQuestions([
            {
              visitSection,
              questions: [updatedQuestion],
            },
          ])
        );
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);
      const updatedQuestion = { ...question, answer: currentAnswers };

      setEnableButton && setEnableButton(!!currentAnswers?.length);
      setAnswers(updatedQuestion);
      return (
        setQuestions &&
        setQuestions([{ visitSection, questions: [updatedQuestion] }])
      );
    },
    [
      answers,
      question,
      setEnableButton,
      setQuestions,
      visitSection,
      name,
      dialog,
    ]
  );

  const handleOnChangeSelectedOptions = useCallback(() => {
    if (!answers?.includes(noneOption) && answers.length) {
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
  }, [answers]);

  useEffect(() => {
    handleOnChangeSelectedOptions();
  }, [handleOnChangeSelectedOptions]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title={replaceBraces(visitSection, name)}
      />
      <div className="flex flex-col gap-2 p-4">
        <Label text={replaceBraces(question.question, name)} />
        <Divider dividerType="dashed" />
        <Typography
          type="h4"
          color="black"
          text={`Tick all of the foods ${caregiverName} talks about:`}
        />
        {optionList.map((item) => (
          <CheckboxGroup
            checkboxColor="primary"
            id={item.title}
            key={item.title}
            icon={item.icon}
            title={item.title}
            description={item.description}
            checked={answers?.some((option) => option === item.title)}
            value={item.title}
            onChange={onCheckboxChange}
            disabled={answers?.includes(noneOption) ? item?.disabled : false}
          />
        ))}
        {!!answers.length && (
          <div className="mt-4 flex gap-2">
            <div
              className={`text-14 flex h-5 w-5 rounded-full bg-${getGroupColor(
                answers.length
              )} items-center justify-center font-bold text-white`}
            >
              {answers.includes(noneOption) ? 0 : answers.length}
            </div>
            <Typography
              type="h4"
              color={getGroupColor(answers.length)}
              text={'Food groups'}
            />
          </div>
        )}
      </div>
    </>
  );
};
