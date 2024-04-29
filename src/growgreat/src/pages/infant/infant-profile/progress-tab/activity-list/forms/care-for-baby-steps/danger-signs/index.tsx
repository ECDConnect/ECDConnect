import {
  ActionModal,
  Alert,
  CheckboxChange,
  CheckboxGroup,
  Dialog,
  DialogPosition,
  Divider,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import Infant from '@/assets/infant.svg';
import { ReactComponent as Translation } from '@/assets/translation.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces, useDialog } from '@ecdlink/core';
import { Translations } from './translations';

export const dangerSignsVisitSectionForBaby = 'Danger signs';

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

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const dialog = useDialog();

  const noneOption = 'None of the above';

  const options = [
    { name: 'Blue skin colour', id: 'dangerSignA' },
    { name: 'Baby is not alert', id: 'dangerSignB' },
    { name: 'Fast breathing or difficulty breathing', id: 'dangerSignC' },
    { name: 'Poor feeding or repeated vomiting', id: 'dangerSignD' },
    { name: 'Low (below 35 degrees C) or high temperature', id: 'dangerSignE' },
    { name: 'Yellow skin or eyes', id: 'dangerSignF' },
    { name: 'Severe eye infection', id: 'dangerSignG' },
    { name: 'Severe cord infection', id: 'dangerSignH' },
    { name: noneOption },
  ];

  const [optionList, setOptionList] = useState<
    {
      name: string;
      disabled?: boolean;
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

        setAnswer(currentAnswers);
        setEnableButton?.(true);

        return setQuestions?.([
          {
            visitSection: dangerSignsVisitSectionForBaby,
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

      setEnableButton?.(!!currentAnswers?.length);

      setAnswer(currentAnswers);
      return setQuestions?.([
        {
          visitSection: dangerSignsVisitSectionForBaby,
          questions: [
            {
              question,
              answer: currentAnswers,
            },
          ],
        },
      ]);
    },
    [answers, dialog, name, question, setEnableButton, setQuestions]
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
          section={'Care for baby - postnatal'}
          id={currentId || ''}
        />
      </Dialog>
    );
  }

  return (
    <>
      <Header
        backgroundColor="tertiary"
        customIcon={Infant}
        title={dangerSignsVisitSectionForBaby}
      />
      <div className="flex flex-col p-4">
        <Label text="If you or your family notice any of these danger signs after my visit, take the baby to the clinic or hospital immediately." />
        <Divider dividerType="dashed" className="my-4" />
        <Typography
          type="h4"
          text={replaceBraces(question, name)}
          color="black"
        />
        {options.map((item, index) => (
          <CheckboxGroup
            checkboxColor="primary"
            className="mt-2"
            id={item.name}
            key={item.name}
            title={item.name}
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
            title={`Eish! Refer ${caregiverName} & ${name} to the clinic urgently and discuss the importance of seeking help.`}
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
