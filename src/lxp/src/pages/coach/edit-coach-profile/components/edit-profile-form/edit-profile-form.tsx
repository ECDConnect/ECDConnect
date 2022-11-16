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
  Alert,
} from '@ecdlink/ui';

import { useForm, useFormState, useWatch } from 'react-hook-form';
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
import { useEffect, useState, useCallback } from 'react';
import { coachSelectors } from '@store/coach';
import { authSelectors } from '@store/auth';
import { SiteAddressService } from '@/services/SiteAddressService';

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  coachProfileInformation,
  onSubmit,
}) => {
  const userAuth = useSelector(authSelectors.getAuthUser);
  const provinces = useSelector(staticDataSelectors.getProvinces);
  const siteAddress = coachProfileInformation?.siteAddress;
  const coach = useSelector(coachSelectors.getCoach);

  const [isOfficeAddress, setIsOfficeAddress] = useState<boolean | undefined>();
  const [franchisorSiteAddress, setFranchisorSetAddress] =
    useState<SiteAddressDto>();
  const [differentProvinceNotification, setDifferentProvinceNotification] =
    useState(false);

  const isAtOfficeLocation: ButtonGroupOption<boolean>[] = [
    { text: 'At the office', value: true },
    { text: 'Other location', value: false },
  ];

  const {
    getValues: getCoachProfileFormValues,
    setValue: setCoachProfileFormValue,
    // reset: resetCoachProfileFormValue,
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
  const {
    name,
    addressLine1,
    addressLine2,
    addressLine3,
    email,
    postalCode,
    provinceId,
  } = useWatch({
    control: coachProfileFormControl,
  });

  const disabledButton =
    !name ||
    !addressLine1 ||
    !addressLine2 ||
    !addressLine3 ||
    !email ||
    !postalCode ||
    !provinceId;

  const getFranchisorSiteAdress = useCallback(async () => {
    const res: SiteAddressDto = await new SiteAddressService(
      userAuth?.auth_token || ''
    ).getFranchisorSiteAddressById(coach?.franchisorId || '');
    setFranchisorSetAddress({
      name: res?.name,
      addressLine1: res?.addressLine1,
      addressLine2: res?.addressLine2,
      addressLine3: res?.addressLine3,
      province: {
        description: res?.province?.description ?? '',
        enumId: '',
      },
      postalCode: res?.postalCode,
      ward: res?.ward ?? '',
    });
    return res;
  }, [coach?.franchisorId, userAuth?.auth_token]);

  useEffect(() => {
    getFranchisorSiteAdress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentProvince: any = provinces?.find(
      (item) => item?.id === provinceId
    );

    if (
      currentProvince?.description &&
      provinceId !== '' &&
      currentProvince?.description !==
        franchisorSiteAddress?.province?.description
    ) {
      setDifferentProvinceNotification(true);
    } else {
      setDifferentProvinceNotification(false);
    }
  }, [franchisorSiteAddress?.province?.description, provinceId, provinces]);

  useEffect(() => {
    if (isOfficeAddress && franchisorSiteAddress && provinces) {
      const selectedProvince = provinces?.find(
        (item) =>
          item?.description === franchisorSiteAddress?.province?.description
      );
      setCoachProfileFormValue('name', franchisorSiteAddress?.name!);
      setCoachProfileFormValue(
        'addressLine1',
        franchisorSiteAddress?.addressLine1
      );
      setCoachProfileFormValue(
        'addressLine2',
        franchisorSiteAddress?.addressLine2!
      );
      setCoachProfileFormValue(
        'addressLine3',
        franchisorSiteAddress?.addressLine3!
      );
      setCoachProfileFormValue('provinceId', selectedProvince?.id!);
      setCoachProfileFormValue(
        'postalCode',
        franchisorSiteAddress?.postalCode!
      );
      setCoachProfileFormValue('ward', franchisorSiteAddress?.ward ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchisorSiteAddress, isOfficeAddress, provinces]);

  useEffect(() => {
    if (isOfficeAddress === false) {
      setCoachProfileFormValue('addressLine1', '');
      setCoachProfileFormValue('addressLine2', '');
      setCoachProfileFormValue('addressLine3', '');
      setCoachProfileFormValue('provinceId', '');
      setCoachProfileFormValue('postalCode', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeAddress]);

  const handleFormSubmit = (): void => {
    if (isValid /*  && onSubmit */) {
      const profileFormValues = getCoachProfileFormValues();
      // const copy = Object.assign({}, coach);
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
        if (franchisorSiteAddress?.addressLine1 !== undefined) {
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

        {isOfficeAddress === true && franchisorSiteAddress && (
          <>
            {/* <Typography
              type={'h5'}
              text={franchisorSiteAddress?.name}
              color={'textDark'}
              className={'my-3'}
            />
            <Typography
              type={'body'}
              text={formatSiteAddressAsText(franchisorSiteAddress)}
              color={'textDark'}
              hasMarkup={true}
            /> */}
            <Alert
              type="info"
              title={`${franchisorSiteAddress?.name}`}
              message={`${franchisorSiteAddress?.addressLine1} <br/> ${franchisorSiteAddress?.addressLine2} <br/> ${franchisorSiteAddress?.addressLine3}`}
              className={'mt-4'}
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

            {differentProvinceNotification && (
              <Alert
                type={'warning'}
                message={
                  'Your Franchisor does not operate in this province. Please choose a different province.'
                }
              />
            )}
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
          disabled={disabledButton || differentProvinceNotification}
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
