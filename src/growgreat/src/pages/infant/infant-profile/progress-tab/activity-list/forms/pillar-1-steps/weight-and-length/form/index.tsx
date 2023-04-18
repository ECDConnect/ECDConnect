import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  ActionModal,
  DialogPosition,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo } from 'react';
import { useDialog } from '@ecdlink/core';
import { DynamicFormProps, Question } from '../../../dynamic-form';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InfantRoadToHealthModel,
  infantRoadToHealthModelSchema,
} from '@/schemas/infant/infant-road-to-health';
import { activitiesColours } from '../../../../activities-list';

export const weightAndLengthFormQuestions = {
  weight: 'Weight',
  length: 'Length',
};
export const weightAndLengthFormSection = 'Growth monitoring (Weight & length)';

export const WeightAndLengthFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const { formState, register, watch } = useForm<InfantRoadToHealthModel>({
    resolver: yupResolver(infantRoadToHealthModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { lengthAtBirth, weightAtBirth } = watch();
  const { isValid } = formState;

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);

  const dialog = useDialog();

  const showInfo = () =>
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
            title="Growth monitoring"
            detailText={`Make sure your scale is working and place it on a flat hard surface. Weigh and measure ${name} without any clothes on (remove nappy, clothes, hats and socks).

          Weighing and measuring babies can help you identify children who are not growing well.`}
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

  useEffect(() => {
    if (isValid) {
      setSectionQuestions?.([
        {
          visitSection: weightAndLengthFormSection,
          questions: [
            {
              question: weightAndLengthFormQuestions.weight,
              answer: weightAtBirth as Question['answer'],
            },
            {
              question: weightAndLengthFormQuestions.length,
              answer: lengthAtBirth as Question['answer'],
            },
          ],
        },
      ]);
      return setEnableButton && setEnableButton(true);
    }

    return setEnableButton && setEnableButton(false);
  }, [
    setEnableButton,
    isValid,
    setSectionQuestions,
    weightAtBirth,
    lengthAtBirth,
  ]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor={activitiesColours.pillar1.primaryColor}
        hexBackgroundColor={activitiesColours.pillar1.secondaryColor}
        title="Growth monitoring"
        subTitle="Weight & length"
      />
      <div className="relative flex flex-col gap-3 p-4">
        <button className="absolute right-4" onClick={showInfo}>
          {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
        </button>
        <div className="flex items-center gap-1">
          <FormInput
            register={register}
            nameProp={'weightAtBirth'}
            label={'Weight'}
            placeholder={'Tap to add'}
            type={'number'}
          ></FormInput>
          <Typography
            type="body"
            color="textDark"
            text={'kg'}
            className="mt-7"
          />
        </div>
        <div className="flex items-center gap-1">
          <FormInput
            register={register}
            nameProp={'lengthAtBirth'}
            label={'Length'}
            placeholder={'Tap to add'}
            type={'number'}
          ></FormInput>
          <Typography type="body" color="textDark" text="cm" className="mt-7" />
        </div>
      </div>
    </>
  );
};
