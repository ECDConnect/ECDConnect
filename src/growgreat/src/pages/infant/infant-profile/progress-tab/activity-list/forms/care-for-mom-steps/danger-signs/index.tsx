import {
  ActionModal,
  Alert,
  Checkbox,
  CheckboxChange,
  DialogPosition,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Header } from '@/pages/infant/infant-profile/components';
import Pregnant from '@/assets/pregnant.svg';
import { ReactComponent as Translation } from '@/assets/translation.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useState } from 'react';
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
  const [answers, setAnswer] = useState<(string | number | undefined)[]>();

  const dialog = useDialog();
  const noneOption = 'None of the above';

  const options = [
    { name: 'Not feeling physically well' },
    { name: 'Abdominal pain' },
    { name: 'Heavy bleeding' },
    {
      name: 'Feeling too hot or too cold',
      description: 'A temperature above 37.5 degrees suggests an infection.',
    },
    { name: 'Offensive or bad-smelling vaginal fluid' },
    { name: 'Unable to manage the baby' },
    { name: 'High stress' },
    { name: 'Problems with breastfeeding' },
    { name: noneOption },
  ];

  const question = `Tick the danger signs {client} is experiencing:`;

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const none = 'None of the above';
        if (
          (event.value === none && answers?.length) ||
          answers?.includes(none)
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
        {options.map((option, index) => (
          <div
            className="bg-uiBg mt-2 flex items-center rounded-xl p-4"
            key={option?.name}
          >
            <Checkbox
              checked={answers?.some((item) => item === option.name)}
              value={option.name}
              onCheckboxChange={onCheckboxChange}
            />
            <div>
              <Typography
                type="body"
                align="left"
                weight="skinny"
                text={option?.name || ''}
                color="textMid"
              />
              {option?.description && (
                <Typography
                  type="body"
                  align="left"
                  weight="skinny"
                  color="textLight"
                  text={option?.description}
                />
              )}
            </div>
            {options.length - 1 > index && (
              <button
                className="ml-auto"
                onClick={() => {
                  setCurrentOption(option?.name);
                  setIsTip && setIsTip(true);
                }}
              >
                <Translation className="h-6 w-6" />
              </button>
            )}
          </div>
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
