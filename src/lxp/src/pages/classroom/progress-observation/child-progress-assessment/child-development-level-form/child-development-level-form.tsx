import { capitalizeWords, FormComponentProps, useDialog } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Alert,
  BannerWrapper,
  Button,
  ButtonGroup,
  Dialog,
  Divider,
  Typography,
} from '@ecdlink/ui';
import { ButtonGroupOption, ButtonGroupTypes, DialogPosition } from '@ecdlink/ui';
import { useFormState, useWatch } from 'react-hook-form';
import { useForm } from 'react-hook-form';
import {
  ChildDevelopmentLevelFormModel,
  childDevelopmentLevelFormSchema,
} from '@schemas/classroom/child-progress-observations/child-development-level-form';
import * as styles from './child-development-level-form.styles';
import { renderIcon, classNames } from '@ecdlink/ui';
import { useSelector } from 'react-redux';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import { progressTrackingSelectors } from '@store/progress-tracking';
import ChildDevelopmentLevelsDisplay from '../../components/child-development-levels-display/child-development-levels-display';
import { useState } from 'react';

interface ChildDevelopmentLevelFormProps
  extends FormComponentProps<ChildDevelopmentLevelFormModel> {
  childDevelopmentLevelForm?: ChildDevelopmentLevelFormModel;
  childId: string;
  childAchievedLevelId: number;
}

export const ChildDevelopmentLevelForm: React.FC<ChildDevelopmentLevelFormProps> = ({
  childDevelopmentLevelForm,
  childId,
  childAchievedLevelId,
  onSubmit,
}) => {
  const dialog = useDialog();
  const currentChild = useSelector(childrenSelectors.getChildById(childId));
  const [developmentLevelsDisplayActive, setDevelopmentLevelsDisplayActive] = useState(false);
  const currentChildUser = useSelector(childrenSelectors.getChildUserById(currentChild?.userId));
  const { getLevelSummaryText } = useChildProgressObservation(childId);

  const levels = useSelector(progressTrackingSelectors.getProgressTrackingLevels);

  const currentChildLevel = levels.find((level) => level.id === childAchievedLevelId);

  const {
    getValues: getChildDevelopmentLevelFormValues,
    setValue: setChildDevelopmentLevelFormValue,
    control: childDevelopmentLevelFormControl,
    trigger: childDevelopmentLevelFormTrigger,
  } = useForm<ChildDevelopmentLevelFormModel>({
    resolver: yupResolver(childDevelopmentLevelFormSchema),
    mode: 'onChange',
    defaultValues: { ...childDevelopmentLevelForm },
  });

  const { isValid } = useFormState({
    control: childDevelopmentLevelFormControl,
  });

  const { levelId: selectedLevelId, practitionerAgreeToLevel } = useWatch({
    defaultValue: { levelId: childAchievedLevelId },
    control: childDevelopmentLevelFormControl,
  });
  const currentLevelIndex = levels.findIndex((level) => level.id === currentChildLevel?.id);
  const practitionerAgreeToLevelOptions: ButtonGroupOption<boolean>[] = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getChildDevelopmentLevelFormValues());
    }
  };

  const openLevelDescriptions = () => {
    setDevelopmentLevelsDisplayActive(!developmentLevelsDisplayActive);
  };

  return (
    <>
      <div className={'bg-uiBg pt-2 px-4'}>
        <Typography
          type={'h1'}
          text={`${currentChildUser?.firstName}’s developmental level:`}
          color={'primary'}
        />
        <div className={'flex flex-row items-center'}>
          <img src={currentChildLevel?.imageUrl} alt="child level" />
          <Typography
            className={'mr-2'}
            type={'body'}
            text={currentChildLevel?.name || 'Level'}
            color={'textMid'}
          />
        </div>
        <div>
          <Alert
            type="info"
            title={getLevelSummaryText(childAchievedLevelId, currentChildUser?.firstName || '')}
            className={'mt-4'}
            button={
              <Button
                onClick={() => openLevelDescriptions()}
                className="w-full"
                size="small"
                color="textMid"
                type="filled"
              >
                {renderIcon('QuestionMarkCircleIcon', classNames('h-5 w-5 text-white'))}
                <Typography
                  type="small"
                  className="ml-2"
                  text="What does this mean?"
                  color="white"
                />
              </Button>
            }
          />
          <label className={classNames(styles.label, 'mt-4')}>
            {`Do you agree that ${currentChildUser?.firstName} is at ${capitalizeWords(
              currentChildLevel?.name?.toLowerCase() ?? ''
            )}?`}
          </label>
          <div className={'mt-2'}>
            <ButtonGroup
              options={practitionerAgreeToLevelOptions}
              onOptionSelected={(value: boolean | boolean[]) => {
                setChildDevelopmentLevelFormValue('practitionerAgreeToLevel', value as boolean);
                childDevelopmentLevelFormTrigger();
              }}
              selectedOptions={practitionerAgreeToLevel}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
              multiple={false}
            />
          </div>
          {practitionerAgreeToLevel === false && (
            <div className={'mt-2'}>
              <label className={classNames(styles.label)}>
                {`Choose a different level for ${currentChildUser?.firstName}`}
              </label>
              <div className={'mt-2'}>
                <ButtonGroup
                  options={
                    levels.map((level, idx) => {
                      return {
                        text: capitalizeWords(level.name.toLowerCase()),
                        value: level.id,
                        disabled: Math.abs(idx - currentLevelIndex) > 1,
                      };
                    }) as ButtonGroupOption<number>[]
                  }
                  onOptionSelected={(value: number | number[]) => {
                    setChildDevelopmentLevelFormValue('levelId', value as number);
                    childDevelopmentLevelFormTrigger();
                  }}
                  selectedOptions={[selectedLevelId || 0]}
                  color="secondary"
                  type={ButtonGroupTypes.Button}
                  className={'w-full'}
                  multiple={false}
                />
              </div>
            </div>
          )}
          <div className={'py-4'}>
            <Divider></Divider>
          </div>
          <Button
            onClick={handleFormSubmit}
            className="w-full"
            size="small"
            color="primary"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('ArrowCircleRightIcon', classNames('h-5 w-5 text-white'))}
            <Typography type="h6" className="ml-2" text="Next" color="white" />
          </Button>
        </div>
      </div>
      <Dialog
        fullScreen={false}
        visible={developmentLevelsDisplayActive}
        position={DialogPosition.Full}
      >
        <BannerWrapper
          size="small"
          onBack={openLevelDescriptions}
          title="Tracking progress"
          renderOverflow
        >
          <ChildDevelopmentLevelsDisplay onClose={openLevelDescriptions} />
        </BannerWrapper>
      </Dialog>
    </>
  );
};
