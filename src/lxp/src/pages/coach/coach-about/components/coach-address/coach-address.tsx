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
} from '@ecdlink/ui';

import { coachActions, coachSelectors } from '@store/coach';
import { SiteAddressDto, ProvinceDto } from '@ecdlink/core';
import { staticDataSelectors } from '@store/static-data';
import { useOnlineStatus } from '@hooks/useOnlineStatus';
import { useForm, useFormState } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { analyticsActions } from '@store/analytics';
import * as styles from './coach-address.styles';
import { useHistory } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '@store';
import {
  EditSiteAddressModel,
  editSiteAddressSchema,
} from '@schemas/coach/edit-profile';
import ROUTES from '@routes/routes';
import { isEqual } from 'lodash';

export const CoachAddress: React.FC = () => {
  const provinces = useSelector(staticDataSelectors.getProvinces);
  const { isOnline } = useOnlineStatus();
  const appDispatch = useAppDispatch();
  const history = useHistory();

  const coach = useSelector(coachSelectors.getCoach);
  const franchisorAddress = coach?.franchisor?.siteAddress;
  const siteAddress = coach?.siteAddress;

  const [isOfficeAddress, setIsOfficeAddress] = useState<boolean>(
    coach?.siteAddressId === coach?.franchisor?.siteAddressId || false
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

  const formatSiteAddressAsText = (siteAddress: SiteAddressDto): string => {
    const address = siteAddress.ward ? `${siteAddress.ward}<br/>` : '';

    return address.concat(`
      ${siteAddress.addressLine1}<br/>
      ${siteAddress.addressLine2}, ${siteAddress?.addressLine3} ${siteAddress?.postalCode}
      <br/>${siteAddress?.province?.description}`);
  };

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

  const { isValid, errors } = useFormState({
    control: coachAddressFormControl,
  });

  const handleFormSubmit = (): void => {
    if (isValid) {
      const newAddress = getCoachAddressFormValues();
      const copy = Object.assign({}, coach);

      if (!isEqual(copy.siteAddress, newAddress)) {
        copy.siteAddress = newAddress;

        if (isOfficeAddress) {
          copy.siteAddressId = copy.franchisor?.siteAddressId;
          setIsOfficeAddress(true);
        }

        appDispatch(coachActions.updateCoach(copy));
        resetCoachAddressFormValue(copy.siteAddress);
      }
    }
  };

  return (
    <BannerWrapper
      size="normal"
      renderBorder={true}
      title="Profile edit"
      color={'primary'}
      onBack={() => history.push(ROUTES.COACH.ABOUT.ROOT)}
      backgroundColour="uiBg"
      displayOffline={!isOnline}
    >
      <div className="px-4 pb-5">
        <Typography
          type={'h1'}
          text={'Edit your Profile'}
          color={'primary'}
          className={'my-3'}
        />
        <Typography type={'body'} text={'Work address'} />
        <div className="space-y-4">
          <div className={'w-full'}>
            <label className={styles.label}>Where do you work?</label>
          </div>

          {franchisorAddress && (
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
          )}

          {isOfficeAddress && franchisorAddress && (
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

          {!isOfficeAddress && (
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
                      value: province.id!,
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

          <div className="mt-5 mb-2">
            <Button
              type="filled"
              color="primary"
              className={styles.button}
              disabled={!isValid}
              onClick={handleFormSubmit}
            >
              {renderIcon('SaveIcon', styles.icon)}
              <Typography type={'help'} text={'Save'} color={'white'} />
            </Button>
          </div>
        </div>
      </div>
    </BannerWrapper>
  );
};
