import {
  Alert,
  ButtonGroup,
  ButtonGroupTypes,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { Label, Header } from '@/pages/infant/infant-profile/components';
import P4 from '@/assets/pillar/p4.svg';
import { DynamicFormProps } from '../../dynamic-form';
import { useCallback, useMemo, useState } from 'react';
import { replaceBraces } from '@ecdlink/core';
import { activitiesColours } from '../../../activities-list';

export const sicknessStepQuestion = `Is {client} sick today?`;

export const SicknessStep = ({
  infant,
  setSectionQuestions: setQuestions,
  setEnableButton,
}: DynamicFormProps) => {
  const [answer, setAnswer] = useState<boolean | boolean[]>();

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const caregiverName = useMemo(
    () => infant?.caregiver?.firstName || '',
    [infant?.caregiver?.firstName]
  );

  const visitSection = 'Sickness';

  const options = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const onOptionSelected = useCallback(
    (value) => {
      setAnswer(value);
      setQuestions?.([
        {
          visitSection,
          questions: [
            {
              question: sicknessStepQuestion,
              answer: value,
            },
          ],
        },
      ]);
      setEnableButton?.(true);
    },
    [setEnableButton, setQuestions]
  );

  return (
    <>
      <Header
        customIcon={P4}
        title={visitSection}
        subTitle={`What to do if ${name} is sick`}
        iconHexBackgroundColor={activitiesColours.pillar4.primaryColor}
        hexBackgroundColor={activitiesColours.pillar4.secondaryColor}
      />
      <div className="flex flex-col gap-4 p-4">
        <Label text={replaceBraces(sicknessStepQuestion, name || '')} />
        <ButtonGroup<boolean>
          color="secondary"
          type={ButtonGroupTypes.Button}
          options={options}
          onOptionSelected={onOptionSelected}
        />
        {!!answer && (
          <>
            <Typography
              type="h4"
              text={`Discuss with ${caregiverName}:`}
              color="textDark"
            />
            <Label
              text={`If ${name} is not able to drink or breastfeed, vomits everything or has convulsions (shakes), take them to the clinic or hospital immediately.`}
            />
            <Divider dividerType="dashed" />
            <Label
              text={`Young babies (especially those less than 2 months old) can become very sick very quickly. If ${name} is not feeding properly or has a fever, take them to the clinic immediately.`}
            />
            <Divider dividerType="dashed" />
            <Alert
              type="info"
              title="Make sure children get the right treatment quickly."
              list={[
                'Caregivers need to be able to see when their child is sick and know what to do.',
              ]}
            />
          </>
        )}
      </div>
    </>
  );
};
