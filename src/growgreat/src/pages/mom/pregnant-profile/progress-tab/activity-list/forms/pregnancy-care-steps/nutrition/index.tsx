import { Header, Label } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  ActionModal,
  DialogPosition,
  Divider,
  Radio,
  renderIcon,
} from '@ecdlink/ui';
import { useMemo, useState } from 'react';
import { DynamicFormProps } from '../../dynamic-form';
import { ReactComponent as BottleIcon } from '@/assets/pillar/pillar1/bottle.svg';
import { ReactComponent as MixedFoodIcon } from '@/assets/pillar/pillar1/mixedFoodSmall.svg';
import { ReactComponent as MomIcon } from '@/assets/pillar/pillar1/momSmall.svg';
import { replaceBraces, useDialog } from '@ecdlink/core';

export const nutritionQuestion =
  'What did {client} eat or drink in the last 48 hours?';
export const nutritionAnswers = {
  breastMilkOnly: 'Breast milk only',
  formulaMilkOnly: 'Formula milk only',
  mixedFeeding: 'Mixed feeding',
};

export const NutritionStep = ({
  infant,
  setEnableButton,
  setSectionQuestions: setQuestions,
}: DynamicFormProps) => {
  const [selectedOption, setSelectedOption] = useState('');

  const visitSection = 'Nutrition';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
    setQuestions &&
      setQuestions([
        {
          visitSection,
          questions: [
            {
              question: nutritionQuestion,
              answer: e.target.value,
            },
          ],
        },
      ]);
    setEnableButton && setEnableButton(true);
  };

  const name = useMemo(
    () => infant?.user?.firstName || '',
    [infant?.user?.firstName]
  );

  const dialog = useDialog();

  const onDisplayDialog = () =>
    dialog({
      blocking: false,
      position: DialogPosition.Middle,
      color: 'bg-white',
      render: (onClose) => {
        return (
          <ActionModal
            className="z-50"
            icon="InformationCircleIcon"
            iconColor="infoMain"
            iconClassName="h-10 w-10"
            title="Mixed feeding"
            detailText="Giving the baby anything other than breast milk or formula. This include water, juice, tea, cereals/porridge, baby foods or other foods, and/or breast milk."
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
  const options = [
    {
      text: nutritionAnswers.breastMilkOnly,
      icon: <MomIcon />,
    },
    {
      text: nutritionAnswers.formulaMilkOnly,
      icon: <BottleIcon />,
    },
    {
      text: nutritionAnswers.mixedFeeding,
      icon: <MixedFoodIcon />,
      extraButtonIcon: renderIcon(
        'InformationCircleIcon',
        'w-5 h-5 text-infoMain'
      ),
      extraButtonOnClick: onDisplayDialog,
    },
  ];

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor="#8CDBDF"
        hexBackgroundColor="#a2dadd4d"
        title={visitSection}
      />
      <div className="relative flex flex-col gap-3 p-4">
        <Label text={replaceBraces(nutritionQuestion, name)} />
        <Divider dividerType="dashed" />
        <fieldset className="flex flex-col gap-2">
          {options.map((option) => (
            <Radio
              key={option.text}
              id={option.text}
              value={option.text}
              icon={option.icon}
              description={option.text}
              checked={selectedOption === option.text}
              onChange={handleChange}
              extraButtonIcon={option.extraButtonIcon}
              extraButtonOnClick={option.extraButtonOnClick}
            />
          ))}
        </fieldset>
      </div>
    </>
  );
};
