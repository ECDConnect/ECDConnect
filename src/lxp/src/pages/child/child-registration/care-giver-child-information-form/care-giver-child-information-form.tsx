import { ProvinceDto } from '@ecdlink/core';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Dropdown,
  FormInput,
  Typography,
  classNames,
} from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { staticDataSelectors } from '@store/static-data';
import * as styles from './care-giver-child-information-form.styles';
import {
  CareGiverChildInformationFormModel,
  careGiverChildInformationFormSchema,
} from '@schemas/child/child-registration/care-giver-child-information-form';
import { CareGiverChildInformationFormProps } from './care-giver-child-information-form.types';

export const CareGiverChildInformationForm: React.FC<
  CareGiverChildInformationFormProps
> = ({
  careGiverInformation,
  submitButtonText = 'Next',
  submitButtonIcon = 'ArrowCircleRightIcon',
  onSubmit,
}) => {
  const provinces = useSelector(staticDataSelectors.getProvinces);

  useEffect(() => {
    document
      .querySelector('.min-h-full')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const {
    getValues: getCareGiverChildInformationFormValues,
    setValue: setCareGiverChildInformationFormValue,
    register: careGiverChildInformationFormRegister,
    control: careGiverInformationFormControl,
  } = useForm<CareGiverChildInformationFormModel>({
    resolver: yupResolver(careGiverChildInformationFormSchema),
    mode: 'onBlur',
    defaultValues: careGiverInformation,
  });

  const { isValid, errors } = useFormState({
    control: careGiverInformationFormControl,
  });

  const handleFormSubmit = () => {
    if (isValid && onSubmit) {
      onSubmit(getCareGiverChildInformationFormValues());
    }
  };

  return (
    <div className={styles.wrapper}>
      <Typography
        type={'h1'}
        text={'Primary caregiver & child'}
        color={'primary'}
      />
      <Typography type={'h2'} text={'Address'} color={'textMid'} />

      <FormInput<CareGiverChildInformationFormModel>
        label={'Flat / unit / apartment number'}
        hint={'Optional'}
        className={styles.spacer}
        register={careGiverChildInformationFormRegister}
        error={errors['apartmentNumber']}
        nameProp={'apartmentNumber'}
        placeholder={'203 Oak Apartments'}
      />

      <FormInput<CareGiverChildInformationFormModel>
        label={'Street address'}
        register={careGiverChildInformationFormRegister}
        nameProp={'streetAddress'}
        error={errors['streetAddress']}
        className={styles.spacer}
        placeholder={'E.g. 11 Green Road'}
      />
      <FormInput<CareGiverChildInformationFormModel>
        label={'Suburb/area'}
        register={careGiverChildInformationFormRegister}
        nameProp={'suburb'}
        error={errors['suburb']}
        className={styles.spacer}
        placeholder={'E.g.  Mamelodi East'}
      />
      <FormInput<CareGiverChildInformationFormModel>
        label={'City'}
        register={careGiverChildInformationFormRegister}
        nameProp={'city'}
        error={errors['city']}
        className={styles.spacer}
        placeholder={'E.g. Cape Town'}
      />

      <Dropdown
        placeholder={'Choose province'}
        list={
          (provinces &&
            provinces.map((province: ProvinceDto) => {
              return { label: province.description, value: province.id };
            })) ||
          []
        }
        fillType="clear"
        fullWidth
        label={'Province'}
        className={classNames(styles.spacer, 'w-full')}
        selectedValue={getCareGiverChildInformationFormValues().provinceId}
        onChange={(item: any) => {
          setCareGiverChildInformationFormValue('provinceId', item, {
            shouldValidate: true,
          });
        }}
      />
      <FormInput<CareGiverChildInformationFormModel>
        label={'Postal code'}
        register={careGiverChildInformationFormRegister}
        nameProp={'postalCode'}
        error={errors['postalCode']}
        placeholder={'E.g. 0081'}
        className={styles.spacer}
      />
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
        {renderIcon(submitButtonIcon, classNames('h-5 w-5 text-white'))}
        <Typography
          type="h6"
          className="ml-2"
          text={submitButtonText}
          color="white"
        />
      </Button>
    </div>
  );
};
