import { FieldPath, useForm, useFormState } from 'react-hook-form';
import { EditProfileFormProps } from './edit-profile-form.types';
import * as styles from '../../edit-coach-profile.styles';
import { staticDataSelectors } from '@store/static-data';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProvinceDto } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import {
  EditProfileModel,
  editProfileSchema,
} from '@schemas/coach/edit-profile';
import { useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  Divider,
  Dropdown,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  onSubmit,
  coachProfileInformation,
}) => {
  const provinces = useSelector(staticDataSelectors.getProvinces);

  const tmpFranchisorSiteAddress = {
    name: 'Lima Foundation',
    apartmentNumber: '',
    streetAddress: '111 - 113 Oxford Road',
    suburb: 'Saxonwold',
    city: 'Johannesburg',
    provinceId: 'd1a18dc2-8ad7-4417-8cbf-ebf07833f86c',
    postalCode: '2196',
  };

  const {
    getValues: getCoachProfileFormValues,
    setValue: setCoachProfileFormValue,
    reset: resetCoachProfileFormValue,
    register: coachProfileFormRegister,
    control: coachProfileFormControl,
    trigger: coachProfileFormTrigger,
  } = useForm<EditProfileModel>({
    resolver: yupResolver(editProfileSchema),
    defaultValues: coachProfileInformation,
    mode: 'onChange',
  });

  const { isValid, errors } = useFormState({
    control: coachProfileFormControl,
  });
  const [isOfficeAddress, setIsOfficeAddress] = useState<boolean>(
    coachProfileInformation?.isOfficeAddress || true
  );

  useEffect(() => {
    setCoachAddressAsOfficeLocation(isOfficeAddress);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeAddress]);

  // useEffect(() => {
  //   resetCoachProfileFormValue(coachProfileInformation);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [coachProfileInformation]);

  const isAtOfficeLocation: ButtonGroupOption<boolean>[] = [
    { text: 'At the office', value: true },
    { text: 'Other location', value: false },
  ];

  const getProvinceNameFromId = (provinceId: string) => {
    const province = provinces.find((province) => province.id === provinceId);
    return province?.description;
  };

  const setCoachAddressAsOfficeLocation = (isAtOfficeAddress: boolean) => {
    if (isAtOfficeAddress === true) {
      const keys = Object.keys(tmpFranchisorSiteAddress);
      for (let key of keys) {
        if (key !== 'name') {
          const fieldValue =
            tmpFranchisorSiteAddress[
              key as keyof typeof tmpFranchisorSiteAddress
            ];
          setCoachProfileFormValue(
            key as FieldPath<EditProfileModel>,
            fieldValue,
            { shouldTouch: true, shouldValidate: true }
          );
        }
      }
    } else {
      resetCoachProfileFormValue(coachProfileInformation);
    }

    coachProfileFormTrigger();
  };

  const handleFormSubmit = (): void => {
    if (isValid && onSubmit) {
      onSubmit(getCoachProfileFormValues());
    }
  };

  return (
    <div>
      <Typography
        type={'h1'}
        text={'Complete your Profile'}
        color={'primary'}
        className={'my-3'}
      />
      <div className="space-y-4">
        <FormInput<EditProfileModel>
          label={'Email address?'}
          register={coachProfileFormRegister}
          nameProp={'email'}
          placeholder={'E.g. example@example.com'}
          type={'text'}
        ></FormInput>

        <div className={'w-full'}>
          <label className={styles.label}>Where do you work?</label>
          <div className="mt-1">
            <ButtonGroup
              options={isAtOfficeLocation}
              onOptionSelected={(value: boolean | boolean[]) => {
                setCoachProfileFormValue('isOfficeAddress', value as boolean);
                setIsOfficeAddress(value as boolean);
              }}
              selectedOptions={isOfficeAddress}
              color="secondary"
              type={ButtonGroupTypes.Button}
              className={'w-full'}
              multiple={false}
            />
          </div>
        </div>

        {isOfficeAddress === true && (
          <div>
            <h5>{tmpFranchisorSiteAddress.name}</h5>
            <p>
              {tmpFranchisorSiteAddress.apartmentNumber.length > 0 && (
                <>
                  {tmpFranchisorSiteAddress.apartmentNumber}
                  <br />
                </>
              )}
              {tmpFranchisorSiteAddress.streetAddress}
              <br />
              {tmpFranchisorSiteAddress.suburb}, {tmpFranchisorSiteAddress.city}{' '}
              {tmpFranchisorSiteAddress.postalCode}
              <br />
              {getProvinceNameFromId(tmpFranchisorSiteAddress.provinceId)}
            </p>
          </div>
        )}

        {isOfficeAddress === false && (
          <>
            <FormInput<EditProfileModel>
              label={'Flat / unit / apartment number'}
              hint={'Optional'}
              register={coachProfileFormRegister}
              nameProp={'apartmentNumber'}
              placeholder={'203 Oak Apartments'}
              error={errors['apartmentNumber']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'Street address'}
              register={coachProfileFormRegister}
              nameProp={'streetAddress'}
              placeholder={'e.g. 11 Green Road'}
              error={errors['streetAddress']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'Suburb / area'}
              register={coachProfileFormRegister}
              nameProp={'suburb'}
              placeholder={'e.g. Mamelodi East'}
              error={errors['suburb']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'City'}
              register={coachProfileFormRegister}
              nameProp={'city'}
              placeholder={'e.g. Cape Town'}
              error={errors['city']}
              type={'text'}
            />
            <Dropdown
              placeholder={'Choose province'}
              list={
                (provinces &&
                  provinces.map((province: ProvinceDto) => ({
                    label: province.description,
                    value: province.id!,
                  }))) ||
                []
              }
              fillType="clear"
              fullWidth={true}
              label={'Province'}
              className={classNames(styles.divider, 'w-full')}
              selectedValue={getCoachProfileFormValues().provinceId}
              onChange={(item: string) => {
                setCoachProfileFormValue('provinceId', item, {
                  shouldValidate: true,
                });
              }}
            />
            <FormInput<EditProfileModel>
              label={'Postal Code'}
              register={coachProfileFormRegister}
              nameProp={'postalCode'}
              placeholder={'e.g. 0081'}
              error={errors['postalCode']}
              type={'text'}
            />
          </>
        )}

        <Divider />
        <div className="mb-2">
          <Button
            type="filled"
            color="primary"
            className={styles.button}
            disabled={!isValid}
            onClick={handleFormSubmit}
            // onClick={() => onSubmit(getCoachProfileFormValues())}
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
