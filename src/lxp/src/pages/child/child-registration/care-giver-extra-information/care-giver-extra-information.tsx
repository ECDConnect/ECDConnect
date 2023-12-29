import { EducationLevelDto, GrantDto } from '@ecdlink/core';
import {
  Button,
  ButtonGroup,
  ButtonGroupTypes,
  classNames,
  Divider,
  Dropdown,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  CareGiverExtraInformationFormModel,
  careGiverExtraInformationFormSchema,
} from '@schemas/child/child-registration/care-giver-extra-information';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './care-giver-extra-information.styles';
import { CareGiverExtraInformationFormProps } from './care-giver-extra-information.types';

export const CareGiverExtraInformationForm: React.FC<
  CareGiverExtraInformationFormProps
> = ({ careGiverExtraInformation, onSubmit }) => {
  const [selectedFamilyGrants, setSelectedFamilyGrants] = useState<string[]>(
    careGiverExtraInformation?.familyGrants || []
  );

  const grants: GrantDto[] = useSelector(staticDataSelectors.getGrants);
  const education: EducationLevelDto[] = useSelector(
    staticDataSelectors.getEducationLevels
  );

  const {
    getValues: getCareGiverExtraInformationFormValues,
    setValue: setCareGiverExtraInformationFormValue,
  } = useForm<CareGiverExtraInformationFormModel>({
    resolver: yupResolver(careGiverExtraInformationFormSchema),
    mode: 'all',
    defaultValues: careGiverExtraInformation,
  });

  const [isValid, setIsValid] = useState<boolean>(false);
  const handleFormSubmit = () => {
    if (onSubmit) {
      onSubmit(getCareGiverExtraInformationFormValues());
    }
  };

  const handleFamilyGrantSelection = (familyGrants: string[]) => {
    setSelectedFamilyGrants(familyGrants);
    setCareGiverExtraInformationFormValue('familyGrants', familyGrants);
    updateFormValidity();
  };

  const onEducationChanged = (id: string) => {
    setCareGiverExtraInformationFormValue('highestEducationId', id);
    updateFormValidity();
  };

  const updateFormValidity = () => {
    const formValidity = careGiverExtraInformationFormSchema.isValidSync(
      getCareGiverExtraInformationFormValues()
    );

    setIsValid(formValidity);
  };

  useEffect(() => {
    updateFormValidity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={'h-full bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h1'} text={'Primary caregiver'} color={'primary'} />
      <Typography
        type={'h2'}
        text={'Additional information'}
        color={'textMid'}
      />

      <Dropdown<string>
        placeholder={'Choose highest level of education'}
        list={education.map((edu) => ({
          label: edu.description ?? '',
          value: edu.id ?? '',
        }))}
        fillType="clear"
        fullWidth
        label={'What is your highest level of education?'}
        className={'mt-3 w-full'}
        selectedValue={
          getCareGiverExtraInformationFormValues().highestEducationId
        }
        onChange={(item: string | string[]) => {
          onEducationChanged(item as string);
        }}
      />

      <label className={classNames(styles.label, 'mt-4')}>
        {'Which of these grants does the family receive?'}
      </label>
      <label className={styles.hintStyle}>{'Select all that apply'}</label>
      <div className={'mt-2'}>
        <ButtonGroup<string>
          type={ButtonGroupTypes.Chip}
          options={
            grants?.map((lang) => ({
              text: lang.description,
              value: lang.id ?? '',
            })) || []
          }
          onOptionSelected={(value: string | string[]) =>
            handleFamilyGrantSelection(value as string[])
          }
          multiple
          selectedOptions={selectedFamilyGrants}
          color="secondary"
        />
      </div>
      <div className={'pb-4'}>
        <Divider></Divider>
      </div>
      <Button
        onClick={() => {
          handleFormSubmit();
        }}
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
  );
};
