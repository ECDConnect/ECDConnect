import {
  EditProfileModel,
  editProfileSchema,
} from '@schemas/coach/edit-profile';
import { EditProfileFormProps } from './edit-profile-form.types';
import * as styles from '../../edit-coach-profile.styles';
import { staticDataSelectors } from '@store/static-data';
import { FieldPath, useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { useState } from 'react';
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
  profile,
}) => {
  const provinces = useSelector(staticDataSelectors.getProvinces);

  const franchisorAddress = {
    name: 'Lima Foundation',
    apartmentNumber: '',
    streetAddress: '111 - 113 Oxford Road',
    suburb: 'Saxonwold',
    city: 'Johannesburg',
    provinceId: 'd1a18dc2-8ad7-4417-8cbf-ebf07833f86c',
    postalCode: '2196',
  };

  const {
    getValues: getProfileFormValues,
    setValue: setProfileFormValue,
    reset: resetProfileFormValue,
    register: profileFormRegister,
    control: profileFormControl,
  } = useForm<EditProfileModel>({
    resolver: yupResolver(editProfileSchema),
    mode: 'onChange',
  });

  useEffect(() => {
    resetProfileFormValue(profile);
    setFranchisorAddress(profile?.isOfficeAddress || true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile]);

  const { isValid, errors } = useFormState({ control: profileFormControl });
  const [isOfficeAddress, setIsOfficeAddress] = useState<boolean>(true);
  const atOffice: ButtonGroupOption<boolean>[] = [
    { text: 'At the office', value: true },
    { text: 'Other location', value: false },
  ];

  const setFranchisorAddress = (isAtOfficeAddress: boolean) => {
    if (isAtOfficeAddress === true) {
      Object.keys(franchisorAddress).forEach((key: string) => {
        if (key !== 'name') {
          const fieldValue =
            franchisorAddress[key as keyof typeof franchisorAddress];
          setProfileFormValue(key as FieldPath<EditProfileModel>, fieldValue);
        }
      });
    } else {
      resetProfileFormValue(profile);
    }
  };

  const getProvinceNameFromId = (provinceId: string) => {
    const province = provinces.find((province) => province.id === provinceId);
    return province?.description;
  };

  console.log(`Is valid: ${isValid}`);

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
          register={profileFormRegister}
          nameProp={'email'}
          placeholder={'E.g. example@example.com'}
          type={'text'}
        ></FormInput>

        <div className={'w-full'}>
          <label className={styles.label}>Where do you work?</label>
          <div className="mt-1">
            <ButtonGroup
              options={atOffice}
              onOptionSelected={(value: boolean | boolean[]) => {
                setIsOfficeAddress(value as boolean);
                setProfileFormValue('isOfficeAddress', value as boolean);
                setFranchisorAddress(value as boolean);
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
            <h5>{franchisorAddress.name}</h5>
            <p>
              {franchisorAddress.apartmentNumber.length > 0 && (
                <>
                  {franchisorAddress.apartmentNumber}
                  <br />
                </>
              )}
              {franchisorAddress.streetAddress}
              <br />
              {franchisorAddress.suburb}, {franchisorAddress.city}{' '}
              {franchisorAddress.postalCode}
              <br />
              {getProvinceNameFromId(franchisorAddress.provinceId)}
            </p>
          </div>
        )}

        {isOfficeAddress === false && (
          <>
            <FormInput<EditProfileModel>
              label={'Flat / unit / apartment number'}
              hint={'Optional'}
              register={profileFormRegister}
              nameProp={'apartmentNumber'}
              placeholder={'203 Oak Apartments'}
              error={errors['apartmentNumber']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'Street address'}
              register={profileFormRegister}
              nameProp={'streetAddress'}
              placeholder={'e.g. 11 Green Road'}
              error={errors['streetAddress']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'Suburb / area'}
              register={profileFormRegister}
              nameProp={'suburb'}
              placeholder={'e.g. Mamelodi East'}
              error={errors['suburb']}
              type={'text'}
            />
            <FormInput<EditProfileModel>
              label={'City'}
              register={profileFormRegister}
              nameProp={'city'}
              placeholder={'e.g. Cape Town'}
              error={errors['city']}
              type={'text'}
            />
            <Dropdown
              placeholder={'Choose province'}
              list={
                (provinces &&
                  provinces.map((province) => ({
                    label: province.description,
                    value: province.id!,
                  }))) ||
                []
              }
              fillType="clear"
              fullWidth={true}
              label={'Province'}
              className={classNames(styles.divider, 'w-full')}
              selectedValue={getProfileFormValues().provinceId}
              onChange={(item: string) => {
                setProfileFormValue('provinceId', item, {
                  shouldValidate: true,
                });
              }}
            />
            <FormInput<EditProfileModel>
              label={'Postal Code'}
              register={profileFormRegister}
              nameProp={'postalCode'}
              placeholder={'e.g. 7700'}
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
            onClick={() => onSubmit(getProfileFormValues())}
          >
            {renderIcon('ArrowCircleRightIcon', styles.icon)}
            <Typography type={'help'} text={'Next'} color={'white'} />
          </Button>
        </div>
      </div>
    </div>
  );
};
