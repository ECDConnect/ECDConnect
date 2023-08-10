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
import { useEffect, useMemo, useState } from 'react';
import { MotherDetailsProps, yesNoOptions } from './mother-details.types';
import {
  MotherDetailsModel,
  motherDetailsModelSchema,
} from '@/schemas/infant/mother-details';
import { useSelector } from 'react-redux';
import { caregiverSelectors } from '@/store/caregiver';
import { motherSelectors } from '@/store/mother';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { InfantActions } from '@/store/infant/infant.actions';
import { EventRecordActions } from '@/store/eventRecord/eventRecord.actions';
import { staticDataSelectors } from '@/store/static-data';

export const MOTHER_TYPE_ID = '568a219f-f1b9-41ac-bf38-143d8d749a39';

export const MotherDetails: React.FC<MotherDetailsProps> = ({
  onSubmit,
  setAddress,
  setContactInformation,
  setIsAlreadyClient,
  isAlreadyClient,
  infantDetails,
  multipleChildrenArray,
  setMultipleChildrenArray,
  motherInfo,
}) => {
  const {
    watch,
    getValues: getMotherDetailsFormValues,
    // formState: pregnantDetailsFormState,
    setValue: setMotherDetailsFormValue,
    register: caregiverFormRegister,
    control: motherDetailsFormControl,
  } = useForm<MotherDetailsModel>({
    resolver: yupResolver(motherDetailsModelSchema),
    mode: 'onChange',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });
  const { isValid } = useFormState({ control: motherDetailsFormControl });
  const caregivers = useSelector(caregiverSelectors.getCaregivers) || [];
  const mothers = useSelector(motherSelectors?.getMothers);
  const relations = useSelector(staticDataSelectors.getRelations);
  const [buttonGroupOptions, setButtonGroupOptions] = useState(yesNoOptions);

  const { isLoading } = useThunkFetchCall('infants', InfantActions.ADD_INFANTS);
  const { isLoading: isLoadingInfantCount } = useThunkFetchCall(
    'infants',
    InfantActions.GET_INFANT_COUNT_FOR_MONTH
  );
  const { isLoading: isLoadingUpdateInfantCaregiver } = useThunkFetchCall(
    'infants',
    InfantActions.UPDATE_INFANT_CAREGIVER
  );
  const { isLoading: isLoadingEventRecord } = useThunkFetchCall(
    'eventRecord',
    EventRecordActions.ADD_EVENT_RECORD
  );

  const motherType = relations.find((item) => item.description === 'Mother');
  const caregiverType = relations.find(
    (item) => item.id === motherInfo?.relationId
  );

  const mothersUpdatedToCaregivers = mothers?.map((item) => ({
    firstName: item?.user?.firstName,
    surname: item?.user?.surname,
    phoneNumber: item?.user?.phoneNumber,
    siteAddress: item?.siteAddress,
    isActive: item?.isActive,
    id: item?.user?.id,
    isMother: true,
    age: '',
  }));

  const motherAndCaregivers = [...caregivers, ...mothersUpdatedToCaregivers];

  const isCaregiver = useMemo(
    () => !!motherInfo?.user || !!motherInfo?.id,
    [motherInfo]
  );

  const isShowCaregiversDropdown = useMemo(
    () =>
      isCaregiver
        ? isCaregiver && isAlreadyClient
        : isAlreadyClient && !!motherAndCaregivers?.length,
    [isAlreadyClient, motherAndCaregivers?.length, isCaregiver]
  );

  useEffect(() => {
    watch();
  }, [watch]);

  useEffect(() => {
    if (isCaregiver) {
      setButtonGroupOptions((prevState) =>
        prevState.map((item) => ({
          ...item,
          disabled: true,
        }))
      );
      setIsAlreadyClient(true);
      setMotherDetailsFormValue('id', motherInfo?.user?.id || motherInfo?.id);
      setMotherDetailsFormValue(
        'name',
        motherInfo?.user?.firstName || motherInfo?.firstName
      );
      setMotherDetailsFormValue(
        'surname',
        motherInfo?.user?.surname || motherInfo?.surname
      );
      setMotherDetailsFormValue(
        'relationshipId',
        caregiverType?.id || motherType?.id
      );
      setMotherDetailsFormValue('isMother', !!motherInfo?.user?.id);
    }
  }, [
    caregiverType?.id,
    isCaregiver,
    motherInfo,
    motherType,
    setIsAlreadyClient,
    setMotherDetailsFormValue,
  ]);

  return (
    <>
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={'Caregiver'}
          className="pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Details'}
          className="w-11/12 pt-2"
        />
      </div>
      <div className="flex w-11/12 justify-center text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div className="mb-2 w-full">
        {!!multipleChildrenArray?.length ? (
          multipleChildrenArray?.map((child, index) => {
            return (
              <div key={index}>
                <Typography
                  key={index + 2}
                  type="h3"
                  color={'textDark'}
                  text={`Relationship to ${child?.firstName}`}
                  className="bt-1 w-11/12 pt-2"
                />
                <Dropdown
                  key={index + 3}
                  placeholder={'Please choose the client:'}
                  fillType="clear"
                  disabled={isCaregiver}
                  selectedValue={
                    isCaregiver
                      ? caregiverType?.id || motherType?.id
                      : getMotherDetailsFormValues('relationshipId') ||
                        multipleChildrenArray[index].relationshipId
                  }
                  list={
                    (relations &&
                      relations
                        .filter((x) => x.description?.length > 0)
                        .map((item) => {
                          return {
                            label: item.description,
                            value: item.id,
                          };
                        })) ||
                    []
                  }
                  onChange={(value) => {
                    setMultipleChildrenArray(
                      multipleChildrenArray.map((item, currentIndex) =>
                        currentIndex === index
                          ? { ...item, relationshipId: value }
                          : item
                      )
                    );
                  }}
                />
              </div>
            );
          })
        ) : (
          <>
            <Typography
              type="h3"
              color={'textDark'}
              text={`Relationship to ${infantDetails?.firstName}`}
              className="bt-1 w-11/12 pt-2"
            />
            <Controller
              name="relationshipId"
              control={motherDetailsFormControl}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  placeholder={'Select relationship:'}
                  fillType="clear"
                  disabled={isCaregiver}
                  selectedValue={isCaregiver ? motherType?.id : value}
                  list={
                    (relations &&
                      relations
                        .filter((x) => x.description?.length > 0)
                        .map((item) => {
                          return {
                            label: item.description,
                            value: item.id,
                          };
                        })) ||
                    []
                  }
                  onChange={onChange}
                />
              )}
            />
          </>
        )}
      </div>
      <div>
        <Typography
          type="h3"
          color={'textDark'}
          text={'Is the caregiver already on CHW Connect?'}
          className="w-11/12 pt-2"
        />
        <div className="mt-2">
          <ButtonGroup<boolean>
            selectedOptions={isAlreadyClient}
            options={buttonGroupOptions}
            onOptionSelected={(value: boolean | boolean[]) => {
              setIsAlreadyClient(value);
              setMotherDetailsFormValue('id', '');
              setMotherDetailsFormValue('name', '');
              setMotherDetailsFormValue('surname', '');
            }}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
          />
        </div>

        {isAlreadyClient === false && (
          <>
            <FormInput<MotherDetailsModel>
              label={'First name'}
              register={caregiverFormRegister}
              nameProp={'name'}
              placeholder={'Enter a name'}
              type={'text'}
              className="mt-4"
            ></FormInput>
            <FormInput<MotherDetailsModel>
              label={'Surname'}
              register={caregiverFormRegister}
              nameProp={'surname'}
              placeholder={'Enter a surname'}
              type={'text'}
              className="mt-4"
            ></FormInput>
            <div className="flex items-center gap-1">
              <FormInput<MotherDetailsModel>
                label={'Age'}
                register={caregiverFormRegister}
                nameProp={'age'}
                placeholder={'Enter an age'}
                type={'number'}
                className="mt-4 w-1/2"
              ></FormInput>
              <Typography
                type="h4"
                color={'textMid'}
                text={'years'}
                className="mt-12"
              />
            </div>
          </>
        )}
        {isShowCaregiversDropdown && (
          <div className="mt-4 w-full">
            <Typography
              type="h3"
              color={'textDark'}
              text={`Choose caregiver`}
              className="bt-1 w-11/12 pt-2"
            />
            <Controller
              name="id"
              control={motherDetailsFormControl}
              render={({ field: { onChange, value } }) => (
                <Dropdown
                  placeholder={'Please choose the client:'}
                  fillType="clear"
                  disabled={isCaregiver}
                  selectedValue={
                    !!motherInfo?.user?.id ? motherInfo.user.id : value
                  }
                  list={
                    (motherAndCaregivers &&
                      motherAndCaregivers
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
                    const caregiver = motherAndCaregivers?.find(
                      (item) => item.id === value
                    );

                    if (multipleChildrenArray?.length) {
                      setMultipleChildrenArray(
                        multipleChildrenArray.map((child) => ({
                          ...child,
                          caregiver,
                        }))
                      );
                    }

                    setMotherDetailsFormValue('name', caregiver?.firstName);
                    setMotherDetailsFormValue('surname', caregiver?.surname);
                    setMotherDetailsFormValue('age', caregiver?.age);
                    if (caregiver?.isMother === true) {
                      setMotherDetailsFormValue('isMother', true);
                    }
                    onChange(value);
                  }}
                />
              )}
            />
          </div>
        )}
      </div>
      {isAlreadyClient !== false && !motherAndCaregivers?.length && (
        <Alert
          className={'mt-5 mb-3'}
          message={
            "You don't have any clients yet! Choose &quot;No&quot; above to continue."
          }
          type={'info'}
        />
      )}
      <div className="flex h-full items-end">
        <Button
          type={'filled'}
          color={'primary'}
          className="mt-4 w-full"
          textColor={'white'}
          text={isAlreadyClient ? 'Save' : 'Next'}
          icon={isAlreadyClient ? 'SaveIcon' : 'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getMotherDetailsFormValues());
          }}
          isLoading={
            isLoading ||
            isLoadingInfantCount ||
            isLoadingUpdateInfantCaregiver ||
            isLoadingEventRecord
          }
          disabled={
            isLoading ||
            isLoadingInfantCount ||
            isLoadingUpdateInfantCaregiver ||
            isLoadingEventRecord ||
            (!multipleChildrenArray?.length && !isValid) ||
            (isAlreadyClient && !getMotherDetailsFormValues('id')) ||
            (!isAlreadyClient && !getMotherDetailsFormValues('age')) ||
            (!isCaregiver &&
              multipleChildrenArray?.filter((child) => child?.relationshipId)
                .length !== multipleChildrenArray?.length)
          }
        />
      </div>
    </>
  );
};
