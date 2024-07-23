import {
  ActionModal,
  Alert,
  Checkbox,
  CheckboxChange,
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
import { useCallback, useMemo, useState } from 'react';
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
          section={dangerSignsVisitSectionForBaby}
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
            <Typography
              type="body"
              align="left"
              weight="skinny"
              text={option?.name || ''}
              color="textMid"
            />
            {options.length - 1 > index && (
              <button
                className="ml-auto"
                onClick={() => {
                  setCurrentOption(option?.name);
                  setCurrentId(option?.id);
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
