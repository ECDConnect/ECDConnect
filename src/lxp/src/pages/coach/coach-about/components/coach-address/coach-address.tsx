import {
  BannerWrapper,
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
  LoadingSpinner,
} from '@ecdlink/ui';

import { coachActions, coachSelectors, coachThunkActions } from '@store/coach';
import { SiteAddressDto, ProvinceDto } from '@ecdlink/core';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyticsActions } from '@store/analytics';
import * as styles from './coach-address.styles';
import { useHistory } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import {
  EditSiteAddressModel,
  editSiteAddressSchema,
} from '@schemas/coach/edit-profile';
import ROUTES from '@routes/routes';
import { isEqual } from 'lodash';
import { SiteAddressService } from '@/services/SiteAddressService';
import { authSelectors } from '@store/auth';

export const CoachAddress: React.FC = () => {
  const provinces = useSelector(staticDataSelectors.getProvinces);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();
  const userAuth = useSelector(authSelectors.getAuthUser);

  const coach = useSelector(coachSelectors.getCoach);
  const franchisorAddress = coach?.franchisor?.siteAddress;
  const siteAddress = coach?.siteAddress;
  const [franchisorSiteAddress, setFranchisorSetAddress] =
    useState<SiteAddressDto>();
  const [loading, setLoading] = useState(false);
  const [differentProvinceNotification, setDifferentProvinceNotification] =
    useState(false);

  /**
   * Determination method to display the Franchisor
   * address, other location or neither:
   *
   * 1. Site address exists and is equal to Franchisor Address - IS_AT_OFFICE
   * 2. Site address exists and is NOT equal to Franchisor Address - IS_NOT_AT_OFFICE
   * 3. Site address does not exist - IS_AT_OFFICE or NEITHER?
   *
   * NOTES: Coach MUST have a Franchisor, however at the moment, Franchisor can
   * exist without an address; therefore:
   * 4. Site address does not exist and Franchisor Address does not exist - IS_NOT_AT_OFFICE
   */
  const isAtOfficeOrCustomLocation =
    (siteAddress !== null && isEqual(siteAddress, franchisorAddress)) ||
    (siteAddress === null && franchisorAddress !== null) ||
    !(siteAddress === null && franchisorAddress === null);

  const [isOfficeAddress, setIsOfficeAddress] = useState(
    isAtOfficeOrCustomLocation
  );

  useEffect(() => {
    if (!isOnline) {
      appDispatch(
        analyticsActions.createViewTracking({
          pageView: window.location.pathname,
          title: 'Coach Address',
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    if (coach?.siteAddress?.addressLine1) {
      if (
        coach?.siteAddress?.addressLine1 ===
          franchisorSiteAddress?.addressLine1 &&
        coach?.siteAddress?.addressLine2 ===
          franchisorSiteAddress?.addressLine2 &&
        coach?.siteAddress?.addressLine3 === franchisorSiteAddress?.addressLine3
      ) {
        setIsOfficeAddress(true);
        return;
      }
      setIsOfficeAddress(false);
    }
  }, [
    coach?.siteAddress?.addressLine1,
    coach?.siteAddress?.addressLine2,
    coach?.siteAddress?.addressLine3,
    franchisorSiteAddress?.addressLine1,
    franchisorSiteAddress?.addressLine2,
    franchisorSiteAddress?.addressLine3,
  ]);

  const getFranchisorSiteAdress = useCallback(async () => {
    setLoading(true);
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
    setLoading(false);
    return res;
  }, [coach?.franchisorId, userAuth?.auth_token]);

  useEffect(() => {
    getFranchisorSiteAdress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOfficeAddress && franchisorAddress) {
      resetCoachAddressFormValue(franchisorAddress);
    } else {
      resetCoachAddressFormValue(siteAddress);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOfficeAddress]);

  const isAtOfficeLocation: ButtonGroupOption<boolean>[] = [
    { text: 'At the office', value: true },
    { text: 'Other location', value: false },
  ];

  const {
    getValues: getCoachAddressFormValues,
    setValue: setCoachAddressFormValue,
    reset: resetCoachAddressFormValue,
    register: coachAddressFormRegister,
    control: coachAddressFormControl,
  } = useForm<EditSiteAddressModel>({
    resolver: yupResolver(editSiteAddressSchema),
    defaultValues: siteAddress,
    mode: 'onChange',
  });

  const { errors } = useFormState({
    control: coachAddressFormControl,
  });

  const { addressLine1, addressLine2, addressLine3, postalCode, provinceId } =
    useWatch({
      control: coachAddressFormControl,
    });

  const disabledButton =
    !addressLine1 ||
    !addressLine2 ||
    !addressLine3 ||
    !postalCode ||
    !provinceId;

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

  const handleFormSubmit = (): void => {
    try {
      const copy = Object.assign({}, coach);

      if (isOfficeAddress && franchisorSiteAddress) {
        const selectedProvince = provinces?.find(
          (item) =>
            item?.description === franchisorSiteAddress?.province?.description
        );
        if (copy.franchisor?.siteAddressId !== undefined) {
          copy.siteAddressId = copy.franchisor?.siteAddressId;
        } else {
          let tempAddress = {
            addressLine1: franchisorSiteAddress?.addressLine1 ?? '',
            addressLine2: franchisorSiteAddress?.addressLine2 ?? '',
            addressLine3: franchisorSiteAddress?.addressLine3 ?? '',
            postalCode: franchisorSiteAddress?.postalCode ?? '',
            province: selectedProvince,
            provinceId: selectedProvince?.id,
            ward: franchisorSiteAddress?.ward ?? '',
            isActive: true,
          };

          copy.siteAddress = tempAddress;
        }
        setIsOfficeAddress(true);
      } else {
        const newAddress = getCoachAddressFormValues();
        const provinceDescription = (id: string) =>
          provinces.find((province) => province.id === id);

        const newProvince: ProvinceDto = {
          description: provinceDescription(newAddress.provinceId)!.description,
          enumId: newAddress.provinceId,
          id: newAddress.provinceId,
        };

        newAddress.province = newProvince;
        copy.siteAddress = newAddress;
      }

      appDispatch(coachActions.updateCoach(copy));
      appDispatch(coachThunkActions.updateCoach(copy));

      resetCoachAddressFormValue();
      history.push(ROUTES.COACH.ABOUT.ROOT);
    } catch (error) {
      console.log('not valid, errors: ', error);
    }
  };

  useEffect(() => {
    if (isOfficeAddress && franchisorSiteAddress && provinces) {
      const selectedProvince = provinces?.find(
        (item) =>
          item?.description === franchisorSiteAddress?.province?.description
      );
      setCoachAddressFormValue('name', franchisorSiteAddress?.name || '');
      setCoachAddressFormValue(
        'addressLine1',
        franchisorSiteAddress?.addressLine1
      );
      setCoachAddressFormValue(
        'addressLine2',
        franchisorSiteAddress?.addressLine2 || ''
      );
      setCoachAddressFormValue(
        'addressLine3',
        franchisorSiteAddress?.addressLine3 || ''
      );
      setCoachAddressFormValue('provinceId', selectedProvince?.id || '');
      setCoachAddressFormValue(
        'postalCode',
        franchisorSiteAddress?.postalCode!
      );
      setCoachAddressFormValue('ward', franchisorSiteAddress?.ward ?? '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [franchisorSiteAddress, isOfficeAddress, provinces]);

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title="Profile edit"
      color={'primary'}
      onBack={() => history.push(ROUTES.COACH.ABOUT.ROOT)}
      backgroundColour={'white'}
      displayOffline={!isOnline}
    >
      <div className="space-y-4 px-4 pb-20">
        <Typography
          type={'h1'}
          text={'Edit your Profile'}
          color={'primary'}
          className={'my-3'}
        />
        <Typography type={'body'} text={'Work address'} />
        {loading ? (
          <LoadingSpinner
            className="mt-6"
            size={'medium'}
            spinnerColor={'primary'}
            backgroundColor={'uiLight'}
          />
        ) : (
          <div className="space-y-4">
            <div className={'w-full'}>
              <label className={styles.label}>Where do you work?</label>
            </div>

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

            {isOfficeAddress === true && franchisorSiteAddress && (
              <>
                <Alert
                  type="info"
                  title={`${franchisorSiteAddress?.name}`}
                  message={`${franchisorSiteAddress?.addressLine1} <br/> ${franchisorSiteAddress?.addressLine2} <br/> ${franchisorSiteAddress?.addressLine3}`}
                  className={'mt-4'}
                />
              </>
            )}

            {!isOfficeAddress !== undefined && isOfficeAddress === false && (
              <>
                <FormInput<EditSiteAddressModel>
                  label={'Flat / unit / apartment number'}
                  register={coachAddressFormRegister}
                  hint={'Optional'}
                  nameProp={'ward'}
                  placeholder={'203 Oak Apartments'}
                  error={errors['ward']}
                  type={'text'}
                />
                <FormInput<EditSiteAddressModel>
                  label={'Street address'}
                  register={coachAddressFormRegister}
                  nameProp={'addressLine1'}
                  placeholder={'e.g. 11 Green Road'}
                  error={errors['addressLine1']}
                  type={'text'}
                />
                <FormInput<EditSiteAddressModel>
                  label={'Suburb / area'}
                  register={coachAddressFormRegister}
                  nameProp={'addressLine2'}
                  placeholder={'e.g. Mamelodi East'}
                  error={errors['addressLine2']}
                  type={'text'}
                />
                <FormInput<EditSiteAddressModel>
                  label={'City'}
                  register={coachAddressFormRegister}
                  nameProp={'addressLine3'}
                  placeholder={'e.g. Johannesburg'}
                  error={errors['addressLine3']}
                  type={'text'}
                />
                <Dropdown
                  placeholder={'Choose province'}
                  list={
                    (provinces &&
                      provinces.map((province: ProvinceDto) => ({
                        label: province.description,
                        value: province.id || '',
                      }))) ||
                    []
                  }
                  fillType="clear"
                  fullWidth={true}
                  label={'Province'}
                  className={classNames(styles.divider, 'w-full')}
                  selectedValue={getCoachAddressFormValues().provinceId}
                  onChange={(item: string) => {
                    setCoachAddressFormValue('provinceId', item, {
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

                <FormInput<EditSiteAddressModel>
                  label={'Postal Code'}
                  register={coachAddressFormRegister}
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
              onClick={handleFormSubmit}
              disabled={disabledButton || differentProvinceNotification}
            >
              {renderIcon('SaveIcon', styles.icon)}
              <Typography type={'h6'} text={'Save'} color={'white'} />
            </Button>
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};
