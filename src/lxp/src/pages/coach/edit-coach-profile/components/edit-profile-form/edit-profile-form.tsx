import {
  Button,
  ButtonGroup,
  ButtonGroupOption,
  ButtonGroupTypes,
  Dropdown,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';

import { /* FieldPath,  */ useForm, useFormState } from 'react-hook-form';
import { EditProfileFormProps } from './edit-profile-form.types';
import * as styles from '../../edit-coach-profile.styles';
import { staticDataSelectors } from '@store/static-data';
import { yupResolver } from '@hookform/resolvers/yup';
import { ProvinceDto, SiteAddressDto } from '@ecdlink/core';
import { useSelector } from 'react-redux';
import {
  EditCoachProfileModel,
  editCoachProfileSchema,
} from '@schemas/coach/edit-profile';
import { useEffect, useState } from 'react';
import { coachActions, coachSelectors, coachThunkActions } from '@store/coach';

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  coachProfileInformation,
  onSubmit,
}) => {
  const provinces = useSelector(staticDataSelectors.getProvinces);
  const franchisorAddress = coachProfileInformation?.franchisorAddress;
  const siteAddress = coachProfileInformation?.siteAddress;
  const coach = useSelector(coachSelectors.getCoach);

  const [isOfficeAddress, setIsOfficeAddress] = useState<boolean | undefined>();

  useEffect(() => {
    if (isOfficeAddress && franchisorAddress) {
      resetCoachProfileFormValue(franchisorAddress);
    } else {
      resetCoachProfileFormValue(siteAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeAddress]);

  const isAtOfficeLocation: ButtonGroupOption<boolean>[] = [
    { text: 'At the office', value: true },
    { text: 'Other location', value: false },
  ];

  const formatSiteAddressAsText = (siteAddress: SiteAddressDto): string => {
    const address = siteAddress.ward ? `${siteAddress.ward}<br/>` : '';

    return address.concat(`
      ${siteAddress.addressLine1}<br/>
      ${siteAddress.addressLine2}, ${siteAddress?.addressLine3} ${siteAddress?.postalCode}
      <br/>${siteAddress?.province?.description}`);
  };

  const {
    getValues: getCoachProfileFormValues,
    setValue: setCoachProfileFormValue,
    reset: resetCoachProfileFormValue,
    register: coachProfileFormRegister,
    control: coachProfileFormControl,
  } = useForm<EditCoachProfileModel>({
    resolver: yupResolver(editCoachProfileSchema),
    defaultValues: {
      email: coachProfileInformation?.email || '',
      ...siteAddress,
    },
    mode: 'onChange',
  });

  const { isValid, errors } = useFormState({
    control: coachProfileFormControl,
  });

  const handleFormSubmit = (): void => {
    if (isValid /*  && onSubmit */) {
      const profileFormValues = getCoachProfileFormValues();
      const copy = Object.assign({}, coach);

      const newCoachProfileInformation = Object.assign(
        {},
        coachProfileInformation
      );

      newCoachProfileInformation.siteAddress = {
        name: isOfficeAddress ? profileFormValues.name : '',
        addressLine1: profileFormValues.addressLine1,
        addressLine2: profileFormValues.addressLine2,
        addressLine3: profileFormValues.addressLine3,
        postalCode: profileFormValues.postalCode,
        ward: profileFormValues.ward,
        provinceId: profileFormValues.provinceId,
        province: profileFormValues.province,
      };

      newCoachProfileInformation.email = profileFormValues.email;

      if (isOfficeAddress) {
        if (coachProfileInformation?.franchisorAddressId !== undefined) {
          newCoachProfileInformation.siteAddressId =
            coachProfileInformation?.franchisorAddressId;
        } else {
          let tempAddress = {
            addressLine1: '',
            addressLine2: '',
            addressLine3: '',
            postalCode: '',
            provinceId: provinces[0].id,
          };

          newCoachProfileInformation.siteAddress = tempAddress;
        }
      }

      onSubmit(newCoachProfileInformation);
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
      <div className="space-y-4 pb-16">
        <FormInput<EditCoachProfileModel>
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

        {isOfficeAddress === true && franchisorAddress && (
          <>
            <Typography
              type={'h5'}
              text={franchisorAddress.name}
              color={'textDark'}
              className={'my-3'}
            />
            <Typography
              type={'body'}
              text={formatSiteAddressAsText(franchisorAddress)}
              color={'textDark'}
              hasMarkup={true}
            />
          </>
        )}

        {isOfficeAddress !== undefined && isOfficeAddress === false && (
          <>
            <FormInput<EditCoachProfileModel>
              label={'Flat / unit / apartment number'}
              hint={'Optional'}
              register={coachProfileFormRegister}
              nameProp={'ward'}
              placeholder={'203 Oak Apartments'}
              error={errors['ward']}
              type={'text'}
            />
            <FormInput<EditCoachProfileModel>
              label={'Street address'}
              register={coachProfileFormRegister}
              nameProp={'addressLine1'}
              placeholder={'e.g. 11 Green Road'}
              error={errors['addressLine1']}
              type={'text'}
            />
            <FormInput<EditCoachProfileModel>
              label={'Suburb / area'}
              register={coachProfileFormRegister}
              nameProp={'addressLine2'}
              placeholder={'e.g. Mamelodi East'}
              error={errors['addressLine2']}
              type={'text'}
            />
            <FormInput<EditCoachProfileModel>
              label={'City'}
              register={coachProfileFormRegister}
              nameProp={'addressLine3'}
              placeholder={'e.g. Cape Town'}
              error={errors['addressLine3']}
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
            <FormInput<EditCoachProfileModel>
              label={'Postal Code'}
              register={coachProfileFormRegister}
              nameProp={'postalCode'}
              placeholder={'e.g. 0081'}
              error={errors['postalCode']}
              type={'text'}
            />
          </>
        )}

        <Button
          size="small"
          type="filled"
          color="primary"
          className={styles.button}
          disabled={!isValid}
          onClick={handleFormSubmit}
        >
          {renderIcon('ArrowCircleRightIcon', styles.icon)}
          <Typography
            type={'h6'}
            text={'Next'}
            color={'white'}
            className="ml-2"
          />
        </Button>
      </div>
    </div>
  );
};
