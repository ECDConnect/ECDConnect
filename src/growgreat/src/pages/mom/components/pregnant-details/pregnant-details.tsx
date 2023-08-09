import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Dropdown,
  Alert,
} from '@ecdlink/ui';
import { Controller, useForm, useFormState } from 'react-hook-form';
import { useCallback, useEffect } from 'react';
import {
  EditPregnantDetailsProps,
  yesNoOptions,
} from './pregnant-details.types';
import {
  pregnantDetailsModelSchema,
  PregnantDetailsModel,
} from '@/schemas/pregnant/pregnant-details';
import { useSelector } from 'react-redux';
import { caregiverSelectors } from '@/store/caregiver';
import { useLocation } from 'react-router';
import { PregnantProfileRouteState } from '../../pregnant-profile/index.types';
import { RootState } from '@/store/types';
import { getInfantById } from '@/store/infant/infant.selectors';

export const PregnantDetails: React.FC<EditPregnantDetailsProps> = ({
  onSubmit,
  setAddress,
  setContactInformation,
  setIsAlreadyClient,
  isAlreadyClient,
}) => {
  const {
    watch,
    getValues: getPregnantDetailsFormValues,
    // formState: pregnantDetailsFormState,
    setValue: setPregnantDetailsFormValue,
    register: consentFormRegister,
    // reset: resetPregnantDetailsFormValue,
    control: momDetailsFormControl,
  } = useForm<PregnantDetailsModel>({
    resolver: yupResolver(pregnantDetailsModelSchema),
    mode: 'onChange',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const location = useLocation<PregnantProfileRouteState>();
  const infant = useSelector((state: RootState) => {
    const infantId = location?.state?.linkedInfantId;

    if (!!infantId) {
      return getInfantById(state, infantId);
    }

    return undefined;
  });

  const { isValid } = useFormState({ control: momDetailsFormControl });

  const caregivers = useSelector(caregiverSelectors.getCaregivers);

  const onChangeClient = useCallback(
    (id) => {
      const caregiver = caregivers?.find(
        (currentlyCaregiver) => currentlyCaregiver.id === id
      );

      setPregnantDetailsFormValue('age', caregiver?.age);
      setPregnantDetailsFormValue('name', caregiver?.firstName);
      setPregnantDetailsFormValue('surname', caregiver?.surname);
      setAddress(caregiver?.siteAddress);
      setContactInformation({ cellphone: caregiver?.phoneNumber });
    },
    [caregivers, setAddress, setContactInformation, setPregnantDetailsFormValue]
  );

  const setDataFromRecordAnEvent = useCallback(() => {
    if (infant?.id) {
      setPregnantDetailsFormValue('name', infant.caregiver?.firstName);
      setPregnantDetailsFormValue('surname', infant.caregiver?.surname);
      setPregnantDetailsFormValue('age', infant.caregiver?.age);
      setIsAlreadyClient(false);
    }
  }, [infant, setIsAlreadyClient, setPregnantDetailsFormValue]);

  useEffect(() => {
    setDataFromRecordAnEvent();
  }, [setDataFromRecordAnEvent]);

  useEffect(() => {
    watch();
  }, [watch]);

  return (
    <>
      <Typography
        type="h2"
        color={'textDark'}
        text={'Pregnant client'}
        className="z-50 pt-6"
      />
      <Typography
        type="h4"
        color={'textMid'}
        text={'Details'}
        className="z-50 w-11/12 pt-2"
      />
      <div className="flex w-11/12 justify-center text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div>
        {!infant?.id && (
          <>
            <Typography
              type="h3"
              color={'textDark'}
              text={'Is this client already on CHW Connect?'}
              className="z-50 w-11/12 pt-2"
            />
            <div className="mt-2">
              <ButtonGroup<boolean>
                options={yesNoOptions}
                onOptionSelected={(value: boolean | boolean[]) => {
                  setPregnantDetailsFormValue('age', '');
                  setPregnantDetailsFormValue('name', '');
                  setPregnantDetailsFormValue('surname', '');
                  setPregnantDetailsFormValue('id', '');
                  setIsAlreadyClient(value);
                }}
                color="secondary"
                type={ButtonGroupTypes.Button}
                className={'w-full'}
              />
            </div>
          </>
        )}
        {isAlreadyClient === false && (
          <>
            <FormInput<PregnantDetailsModel>
              label={'First name'}
              register={consentFormRegister}
              nameProp={'name'}
              placeholder={'Enter a name'}
              type={'text'}
              className="mt-4"
            />
            <FormInput<PregnantDetailsModel>
              label={'Surname'}
              register={consentFormRegister}
              nameProp={'surname'}
              placeholder={'Enter a surname'}
              type={'text'}
              className="mt-4"
            />
            <div className="flex items-center gap-1">
              <FormInput<PregnantDetailsModel>
                label={'Age'}
                register={consentFormRegister}
                nameProp={'age'}
                placeholder={'Enter an age'}
                type={'number'}
                className="mt-4 w-1/2"
              />
              <Typography
                type="h4"
                color={'textMid'}
                text={'years'}
                className="z-50 mt-12"
              />
            </div>
          </>
        )}
        {isAlreadyClient === true && !!caregivers?.length && (
          <div className="mt-4 w-full">
            <Controller
              name="id"
              control={momDetailsFormControl}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  placeholder={'Please choose the client:'}
                  fillType="clear"
                  selectedValue={value}
                  list={
                    (caregivers &&
                      caregivers
                        .filter((x) => x.id && x.firstName?.length! > 0)
                        .map((item) => {
                          return {
                            label: item.firstName! + ' ' + item.surname!,
                            value: item.id,
                          };
                        })) ||
                    []
                  }
                  onChange={(value) => {
                    onChangeClient(value);
                    onChange(value);
                  }}
                />
              )}
            />
          </div>
        )}
        {isAlreadyClient !== false && !caregivers?.length && (
          <Alert
            className={'mt-5 mb-3'}
            message={
              "You don't have any clients yet! Choose &quot;No&quot; above to continue."
            }
            type={'info'}
          />
        )}
      </div>
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className={'mt-4 w-full'}
          textColor={'white'}
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getPregnantDetailsFormValues());
          }}
          disabled={
            (isAlreadyClient && !getPregnantDetailsFormValues('id')) ||
            (!isAlreadyClient &&
              (!isValid || !getPregnantDetailsFormValues('age')))
          }
        />
      </div>
    </>
  );
};
