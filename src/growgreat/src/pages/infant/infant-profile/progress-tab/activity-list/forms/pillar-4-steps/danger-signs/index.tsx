import { Header } from '@/pages/infant/infant-profile/components';
import P4 from '@/assets/pillar/p4.svg';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces, useDialog } from '@ecdlink/core';
import {
  Alert,
  ActionModal,
  CheckboxChange,
  Colours,
  Dialog,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { noneOption, riskOption2, options } from './options';
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

export const dangerSignsQuestion = `Tick the danger signs {client} is experiencing:`;
export const dangerSignsVisitSection = 'Danger signs';

export const DangerSignsStep = ({
  infant,
  isTipPage,
  setIsTip,
  setEnableButton,
  setSectionQuestions: setQuestions,
  setRisk,
  onClose,
}: DynamicFormProps) => {
  const [optionList, setOptionList] = useState<
    {
      title: string;
      id?: string;
      disabled?: boolean;
    }[]
  >(options);
  const [currentOption, setCurrentOption] = useState<string>();
  const [currentId, setCurrentId] = useState<string>();
  const [question, setAnswers] = useState({
    question: dangerSignsQuestion,
    answer: [] as (string | number | undefined)[],
  });

  const dialog = useDialog();

  const answers = question.answer as string[];

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

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
                  title="You can only select “None of the above” if there are no danger signs"
                  detailText={`If ${name} is not experiencing any danger signs, first deselect all danger signs before selecting “None of the above”.`}
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
        setEnableButton?.(true);
        return setQuestions?.([
          {
            visitSection: dangerSignsVisitSection,
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
          visitSection: dangerSignsVisitSection,
          questions: [updatedQuestion],
        },
      ]);
    },
    [answers, dialog, name, question, setEnableButton, setQuestions]
  );

  const handleOnChangeSelectedOptions = useCallback(() => {
    if (!answers?.includes(noneOption) && answers.length) {
      setRisk?.(1);

      if (answers.includes(riskOption2)) {
        setRisk?.(2);
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
      setRisk?.(0);

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
      <Dialog
        fullScreen={true}
        visible={isTipPage ? isTipPage : false}
        position={DialogPosition.Full}
      >
        <Translations
          toTranslate={currentOption}
          onClose={() => setIsTip && setIsTip(false)}
          section={'Health care - postnatal'}
          id={currentId || ''}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        customIcon={P4}
        title={dangerSignsVisitSection}
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
            disabled={answers?.includes(noneOption) ? item?.disabled : false}
            {...(options.length - 1 > index && {
              extraChildren: (
                <button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentOption(item.title);
                    setCurrentId(item.id);
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
