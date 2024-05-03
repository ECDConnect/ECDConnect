import {
  ActionModal,
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Dialog,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { ReactComponent as Translation } from '@/assets/translation.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useState } from 'react';
import { replaceBraces, useDialog } from '@ecdlink/core';
import { Translations } from './translations';

export const dangerSignsVisitSection = 'Danger signs';

export const DangerSignsStep = ({
  infant,
  isTipPage,
  setSectionQuestions: setQuestions,
  setEnableButton,
  setIsTip,
}: DynamicFormProps) => {
  const [currentOption, setCurrentOption] = useState<string>();
  const [currentId, setCurrentId] = useState<string>();
  const [answers, setAnswer] = useState<(string | number | undefined)[]>();
  const dialog = useDialog();
  const noneOption = 'None of the above';

  const options = [
    { name: 'Not feeling physically well', id: 'dangerSignA' },
    { name: 'Abdominal pain', id: 'dangerSignB' },
    { name: 'Heavy bleeding', id: 'dangerSignC' },
    {
      name: 'Feeling too hot or too cold',
      description: 'A temperature above 37.5 degrees suggests an infection.',
      id: 'dangerSignD',
    },
    { name: 'Offensive or bad-smelling vaginal fluid', id: 'dangerSignE' },
    { name: 'Unable to manage the baby', id: 'dangerSignF' },
    { name: 'High stress', id: 'dangerSignG' },
    { name: 'Problems with breastfeeding', id: 'dangerSignH' },
    { name: noneOption, id: 'dangerSignI' },
  ];

  const [optionList, setOptionList] = useState<
    {
      name: string;
      disabled?: boolean;
      description?: string;
    }[]
  >(options);

  const question = `Tick the danger signs {client} is experiencing:`;

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
                  detailText={`If ${infant?.caregiver?.firstName} is not experiencing any danger signs, first deselect all danger signs before selecting “None of the above”.`}
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

        setAnswer(currentAnswers);
        setEnableButton && setEnableButton(true);
        return setQuestions?.([
          {
            visitSection: dangerSignsVisitSection,
            questions: [
              {
                question,
                answer: currentAnswers,
              },
            ],
          },
        ]);
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);

      setEnableButton && setEnableButton(!!currentAnswers?.length);
      setAnswer(currentAnswers);
      return setQuestions?.([
        {
          visitSection: dangerSignsVisitSection,
          questions: [
            {
              question,
              answer: currentAnswers,
            },
          ],
        },
      ]);
    },
    [
      answers,
      dialog,
      infant?.caregiver?.firstName,
      question,
      setEnableButton,
      setQuestions,
    ]
  );

  const handleOnChangeSelectedOptions = useCallback(() => {
    if (!answers?.includes(noneOption) && answers?.length) {
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.name === noneOption) {
            return { ...item, disabled: true };
          }
          return { ...item, disabled: false };
        })
      );
    }

    if (answers?.includes(noneOption)) {
      return setOptionList((prevState) =>
        prevState.map((item) => {
          if (item.name !== noneOption) {
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
          section={'Care for mom - postnatal'}
          id={currentId || ''}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Pregnant}
        title={dangerSignsVisitSection}
      />
      <div className="flex flex-col p-4">
        <Alert
          type="info"
          title="The most common complications after delivery are infection and vaginal bleeding."
          className="mb-4"
        />
        <Typography
          type="h4"
          text={replaceBraces(question, infant?.caregiver?.firstName || '')}
          color="black"
        />
        <Typography
          type="body"
          text="Tap the chat icons to see translations"
          color="textMid"
          className="mb-4"
        />
        {options.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            className="mt-2"
            id={item.name}
            key={item.name}
            title={item.name}
            description={item.description}
            checked={answers?.some((option) => option === item.name)}
            value={item.name}
            onChange={onCheckboxChange}
            {...(options.length - 1 > index && {
              extraChildren: (
                <button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentOption(item.name);
                    setCurrentId(item.id);
                    setIsTip?.(true);
                  }}
                >
                  <Translation className="h-6 w-6" />
                </button>
              ),
            })}
          />
        ))}
        {answers?.some((item) => item !== noneOption) && (
          <Alert
            className="mt-4"
            type="error"
            title={`Eish! Refer ${infant?.caregiver?.firstName} to the clinic and discuss the importance of seeking help.`}
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
