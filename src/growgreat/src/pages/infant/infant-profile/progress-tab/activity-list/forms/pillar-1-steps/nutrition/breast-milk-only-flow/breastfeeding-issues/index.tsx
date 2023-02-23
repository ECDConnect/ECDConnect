import {
  ActionModal,
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Checkbox,
  CheckboxChange,
  DialogPosition,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { Header, Label } from '@/pages/infant/infant-profile/components';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { replaceBraces, useDialog } from '@ecdlink/core';
import { DynamicFormProps } from '../../../../dynamic-form';
import P1 from '@/assets/pillar/p1.svg';
import { ReactComponent as PollyImpressed } from '@/assets/pollyImpressed.svg';
import { ReactComponent as PollySad } from '@/assets/pollySad.svg';

export const breastfeedingIssuesCheckboxQuestion =
  'Tick the breastfeeding issues {client} is experiencing:';
export const breastfeedingIssuesCheckboxOptions = {
  soreNipples: 'Sore nipples',
  lowMilkSupply: 'Low milk supply',
  engorged: 'Engorged (hard, full, warm, tender and painful breasts)',
  clusterFeeding:
    'Cluster feeding (baby wants to feed often, especially in the evening)',
  noneOption: 'None of the above',
};

export const BreastfeedingIssuesStep = ({
  infant,
  setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [questions, setAnswers] = useState([
    {
      question: breastfeedingIssuesCheckboxQuestion,
      answer: [],
    },
    {
      question: 'Would you like to join a breastfeeding club?',
      answer: '',
    },
  ]);

  const checkboxAnswers = questions[0].answer as string[];
  const buttonGroupAnswer = questions[1].answer;

  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  // TODO: add integration (G5.3.4)
  const showReminder = false;

  const dialog = useDialog();

  const checkboxOptions = [
    { name: breastfeedingIssuesCheckboxOptions.soreNipples },
    { name: breastfeedingIssuesCheckboxOptions.lowMilkSupply },
    { name: breastfeedingIssuesCheckboxOptions.engorged },
    { name: breastfeedingIssuesCheckboxOptions.clusterFeeding },
    { name: breastfeedingIssuesCheckboxOptions.noneOption },
  ];

  const buttonGroupOptions = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

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

      setAnswers(updatedQuestions);
      setQuestions && setQuestions(updatedQuestions);
    },
    [questions, setQuestions]
  );

  const onCheckboxChange = useCallback(
    (event: CheckboxChange) => {
      if (event.checked) {
        const none = 'None of the above';
        if (
          (event.value === none && checkboxAnswers?.length) ||
          checkboxAnswers?.includes(none)
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
                  detailText={`If ${caregiverName} is not experiencing any danger signs, first deselect all danger signs before selecting “None of the above”.`}
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

        const currentAnswers = checkboxAnswers
          ? [...checkboxAnswers, event.value]
          : [event.value];

        return onOptionSelected(currentAnswers, 0);
      }
      const currentAnswers = checkboxAnswers?.filter(
        (item) => item !== event.value
      );

      return onOptionSelected(currentAnswers, 0);
    },
    [checkboxAnswers, dialog, caregiverName, onOptionSelected]
  );

  const onOptionsChange = useCallback(() => {
    if (!setEnableButton) return;
    const isCompleted =
      !!questions[0].answer.length && questions[1].answer !== '';

    if (isCompleted) {
      return setEnableButton(true);
    }

    return setEnableButton(false);
  }, [questions, setEnableButton]);

  useEffect(() => {
    onOptionsChange();
  }, [onOptionsChange, questions, setEnableButton]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title="Breastfeeding issues"
      />
      <div className="flex flex-col p-4">
        <Typography
          type="h4"
          text={replaceBraces(
            questions[0].question,
            infant?.caregiver?.firstName || ''
          )}
          color="black"
        />
        {checkboxOptions.map((option, index) => (
          <div
            className="bg-uiBg mt-2 flex items-center rounded-xl p-4"
            key={option?.name}
          >
            <Checkbox
              checked={checkboxAnswers?.some((item) => item === option.name)}
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
          </div>
        ))}
        <Divider dividerType="dashed" className="mt-5 mb-4" />
        {showReminder ? (
          <Alert
            type="info"
            title={`Remind ${caregiverName} when the next breastfeeding club will happen.`}
          />
        ) : (
          <>
            <Label text={questions[1].question} className="mb-4" />
            <ButtonGroup<boolean>
              color="secondary"
              type={ButtonGroupTypes.Button}
              options={buttonGroupOptions}
              onOptionSelected={(value) => onOptionSelected(value, 1)}
            />
            {typeof buttonGroupAnswer !== 'string' && (
              <Alert
                className="mt-4"
                type="warning"
                title={
                  !!buttonGroupAnswer
                    ? 'Great news!'
                    : `That’s a shame! Encourage ${caregiverName} to attend.`
                }
                message={
                  !!buttonGroupAnswer
                    ? `Let ${caregiverName} know when and where you are having your next meeting.`
                    : `Tell ${caregiverName} what happens at a club and what support she’ll get there.`
                }
                messageColor="textMid"
                titleColor="textDark"
                customIcon={
                  <div className="rounded-full">
                    {!!buttonGroupAnswer ? (
                      <PollyImpressed className="h-16 w-16" />
                    ) : (
                      <PollySad className="h-16 w-16" />
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
