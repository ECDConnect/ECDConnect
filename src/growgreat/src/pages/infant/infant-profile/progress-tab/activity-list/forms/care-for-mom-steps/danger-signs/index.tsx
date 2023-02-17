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
import { useCallback, useEffect, useState } from 'react';
import { ReactComponent as PollyTime } from '@/assets/pollyTime.svg';
import { replaceBraces, useDialog } from '@ecdlink/core';
import { Translations } from './translations';

export const DangerSignsStep = ({
  infant,
  isTipPage,
  setQuestions,
  setEnableButton,
  setIsTip,
}: DynamicFormProps) => {
  const [currentOption, setCurrentOption] = useState<string>();
  const [answers, setAnswer] = useState<(string | number | undefined)[]>();

  // TODO: add integration
  const mockedFollowUp = {
    message: `${infant?.caregiver?.firstName} had the following danger signs at your previous visit on 2 July:`,
    list: ['Not feeling physically well', 'Not managing the baby'],
  };

  const dialog = useDialog();

  // TODO: add integration
  const isFollowUp = false;

  const options = [
    {
      name: 'Not feeling physically well',
      alert: `Eish! Refer ${infant?.caregiver?.firstName} to the clinic and discuss the importance of seeking help.`,
    },
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
    { name: 'None of the above' },
  ];

  const question = `Tick the danger signs {client} is experiencing:`;

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        if (event.value === 'None of the above') {
          dialog({
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

        return (
          setQuestions &&
          setQuestions([
            {
              question,
              answer: currentAnswers,
            },
          ])
        );
      }
      const currentAnswers = answers?.filter((item) => item !== event.value);

      setAnswer(currentAnswers);
      return (
        setQuestions &&
        setQuestions([
          {
            question,
            answer: currentAnswers,
          },
        ])
      );
    },
    [answers, dialog, infant?.caregiver?.firstName, question, setQuestions]
  );

  useEffect(() => {
    setEnableButton && setEnableButton(true);
  }, [setEnableButton]);

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
        title="Danger signs"
        {...(isFollowUp
          ? {
              subTitle: 'Follow up',
            }
          : {})}
      />
      <div className="flex flex-col p-4">
        {isFollowUp ? (
          <Alert
            type="warning"
            title={mockedFollowUp.message}
            titleColor="textDark"
            list={mockedFollowUp.list}
            customIcon={<PollyTime className="w-28" />}
          />
        ) : (
          <>
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
            {options.map((option) => (
              <div
                className="bg-uiBg mt-2 flex items-center rounded-xl p-4"
                key={option?.name}
              >
                <Checkbox
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
                <button
                  className="ml-auto"
                  onClick={() => {
                    setCurrentOption(option?.name);
                    setIsTip && setIsTip(true);
                  }}
                >
                  <Translation className="h-6 w-6" />
                </button>
              </div>
            ))}
            {answers?.find((item) => item === options[0].name) && (
              <Alert
                className="mt-4"
                type="error"
                title={options[0].alert}
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
          </>
        )}
      </div>
    </>
  );
};
