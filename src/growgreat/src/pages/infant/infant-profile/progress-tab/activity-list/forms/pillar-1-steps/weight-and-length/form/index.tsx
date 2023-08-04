import { Header } from '@/pages/infant/infant-profile/components';
import P1 from '@/assets/pillar/p1.svg';
import {
  ActionModal,
  Alert,
  DialogPosition,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { useEffect, useMemo } from 'react';
import { getAgeInYearsMonthsAndDays, useDialog } from '@ecdlink/core';
import { DynamicFormProps, Question } from '../../../dynamic-form';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  InfantRoadToHealthModel,
  infantRoadToHealthModelSchema,
} from '@/schemas/infant/infant-road-to-health';
import { activitiesColours } from '../../../../activities-list';
import { differenceInMonths } from 'date-fns';

export const weightLengthAndHeightFormQuestions = {
  weight: 'Weight',
  length: 'Length',
  height: 'Height',
};
export const weightAndLengthFormSection = 'Growth monitoring (Weight & length)';

export const WeightAndLengthFormStep = ({
  infant,
  setEnableButton,
  setSectionQuestions,
}: DynamicFormProps) => {
  const {
    register,
    watch,
    control: infantRoadToHealthFormControl,
  } = useForm<InfantRoadToHealthModel>({
    resolver: yupResolver(infantRoadToHealthModelSchema),
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { lengthAtBirth, weightAtBirth, height } = watch();

  const { errors } = useFormState({
    control: infantRoadToHealthFormControl,
  });

  const name = useMemo(() => infant?.user?.firstName || '', [infant]);
  const dateOfBirth = infant?.user?.dateOfBirth as string;

  const ageInMonths = differenceInMonths(new Date(), new Date(dateOfBirth));
  const { years: ageInYears } = getAgeInYearsMonthsAndDays(dateOfBirth);

  const isDisplayLength = useMemo(
    () => ageInMonths >= 6 && ageInMonths < 15,
    [ageInMonths]
  );
  const isDisplayHeight = useMemo(
    () => ageInMonths >= 24 && ageInYears < 5,
    [ageInMonths, ageInYears]
  );

  const isCheckedWeight = useMemo(() => {
    return (
      weightAtBirth && Number(weightAtBirth) > 0 && Number(weightAtBirth) <= 50
    );
  }, [weightAtBirth]);

  const isCheckedLength = useMemo(() => {
    return (
      lengthAtBirth && Number(lengthAtBirth) > 0 && Number(lengthAtBirth) <= 250
    );
  }, [lengthAtBirth]);

  const isCheckedHeight = useMemo(() => {
    return height && Number(height) > 0 && Number(height) <= 250;
  }, [height]);

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
    if (
      !!weightAtBirth &&
      weightAtBirth <= 50 &&
      ((isDisplayHeight && height) ||
        !isDisplayHeight ||
        (isDisplayLength && lengthAtBirth) ||
        !isDisplayLength)
    ) {
      setSectionQuestions?.([
        {
          visitSection: weightAndLengthFormSection,
          questions: [
            {
              question: weightLengthAndHeightFormQuestions.weight,
              answer: String(weightAtBirth) as Question['answer'],
            },
            ...(isDisplayLength
              ? [
                  {
                    question: weightLengthAndHeightFormQuestions.length,
                    answer: lengthAtBirth as Question['answer'],
                  },
                ]
              : []),
            ...(isDisplayHeight
              ? [
                  {
                    question: weightLengthAndHeightFormQuestions.height,
                    answer: height as Question['answer'],
                  },
                ]
              : []),
          ],
        },
      ]);
    }

    if (isDisplayHeight || isDisplayLength) {
      if (
        isCheckedWeight &&
        ((isDisplayLength && isCheckedLength) ||
          (isDisplayHeight && isCheckedHeight))
      ) {
        return setEnableButton?.(true);
      } else {
        return setEnableButton?.(false);
      }
    } else {
      if (isCheckedWeight) {
        return setEnableButton?.(true);
      } else {
        return setEnableButton?.(false);
      }
    }
  }, [
    setEnableButton,
    setSectionQuestions,
    weightAtBirth,
    lengthAtBirth,
    isDisplayLength,
    isDisplayHeight,
    height,
    isCheckedWeight,
    isCheckedLength,
    isCheckedHeight,
  ]);

  return (
    <>
      <Header
        customIcon={P1}
        iconHexBackgroundColor={activitiesColours.pillar1.primaryColor}
        hexBackgroundColor={activitiesColours.pillar1.secondaryColor}
        title="Growth monitoring"
        subTitle={`Weight${isDisplayLength ? ' & length' : ''}${
          isDisplayHeight ? ' & height' : ''
        }`}
      />
      <div className="relative flex flex-col gap-3 p-4">
        <button className="absolute right-4" onClick={showInfo}>
          {renderIcon('InformationCircleIcon', 'h-6 w-6 text-infoMain')}
        </button>
        <div className="flex items-center gap-1">
          <FormInput
            register={register}
            nameProp={'weightAtBirth'}
            label={weightLengthAndHeightFormQuestions.weight}
            placeholder={'Tap to add'}
            type={'number'}
            min={0}
            maxLength={5}
          ></FormInput>
          <Typography
            type="body"
            color="textDark"
            text={'kg'}
            className="mt-7"
          />
        </div>
        {!!weightAtBirth && !isCheckedWeight && (
          <Alert
            className="mb-4"
            type="error"
            title="Please enter a valid weight"
          />
        )}
        {isDisplayLength && (
          <>
            <div className="flex items-center gap-1">
              <FormInput
                register={register}
                nameProp={'lengthAtBirth'}
                label={weightLengthAndHeightFormQuestions.length}
                placeholder={'Tap to add'}
                type={'number'}
                min={0}
                maxLength={6}
              ></FormInput>
              <Typography
                type="body"
                color="textDark"
                text="cm"
                className="mt-7"
              />
            </div>
            {!!lengthAtBirth && !isCheckedLength && (
              <Alert
                className="mb-4"
                type="error"
                title="Please enter a valid length"
              />
            )}
          </>
        )}
        {isDisplayHeight && (
          <div className="flex items-center gap-1">
            <FormInput
              register={register}
              nameProp={'height'}
              label={weightLengthAndHeightFormQuestions.height}
              placeholder={'Tap to add'}
              type={'number'}
            ></FormInput>
            <Typography
              type="body"
              color="textDark"
              text="cm"
              className="mt-7"
            />
          </div>
        )}
      </div>
    </>
  );
};
