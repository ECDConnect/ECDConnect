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
import { useState, useEffect } from 'react';
import {
  MotherDetailsProps,
  yesNoOptions,
  relationshipTypes,
} from './mother-details.types';
import {
  MotherDetailsModel,
  motherDetailsModelSchema,
} from '@/schemas/infant/mother-details';
import { useSelector } from 'react-redux';
import { MultipleChildrenProps } from '../../infant-register-form/infant-register-form.types';
import { caregiverSelectors } from '@/store/caregiver';
import { motherSelectors } from '@/store/mother';

export const MotherDetails: React.FC<MotherDetailsProps> = ({
  onSubmit,
  setAddress,
  setContactInformation,
  setIsAlreadyClient,
  isAlreadyClient,
  infantDetails,
  multipleChildrenArray,
  setMultipleChildrenArray,
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
  const [relationshipChildrenArray, setRelationshipChildrenArray] =
    useState<MultipleChildrenProps[]>();

  const caregivers = useSelector(caregiverSelectors.getCaregivers) || [];
  const mothers = useSelector(motherSelectors?.getMothers);

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

  useEffect(() => {
    const uniqueChildrenArray = relationshipChildrenArray?.filter(
      (elem, index, self) =>
        self.findIndex((t) => {
          return (
            t.firstName && elem.firstName && t.firstName === elem.firstName
          );
        }) === index
    );

    setMultipleChildrenArray(uniqueChildrenArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipChildrenArray]);

  useEffect(() => {
    watch();
  }, [watch]);

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
                  selectedValue={
                    getMotherDetailsFormValues('relationshipId') ||
                    multipleChildrenArray[index].relationshipId
                  }
                  list={
                    (relationshipTypes &&
                      relationshipTypes
                        .filter((x) => x.label?.length > 0)
                        .map((item) => {
                          return {
                            label: item.label,
                            value: item.value,
                          };
                        })) ||
                    []
                  }
                  onChange={(value) => {
                    relationshipChildrenArray
                      ? setRelationshipChildrenArray([
                          {
                            ...multipleChildrenArray[index],
                            relationshipId: value,
                          },
                          ...relationshipChildrenArray,
                        ])
                      : setRelationshipChildrenArray([
                          {
                            ...multipleChildrenArray[index],
                            relationshipId: value,
                          },
                          ...multipleChildrenArray,
                        ]);
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
                  placeholder={'Please choose the client:'}
                  fillType="clear"
                  selectedValue={value}
                  list={
                    (relationshipTypes &&
                      relationshipTypes
                        .filter((x) => x.label?.length > 0)
                        .map((item) => {
                          return {
                            label: item.label,
                            value: item.value,
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
            options={yesNoOptions}
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
        {isAlreadyClient && !!motherAndCaregivers?.length && (
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
                  selectedValue={value}
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
          text={`Next`}
          icon={'ArrowCircleRightIcon'}
          iconPosition={'start'}
          onClick={() => {
            onSubmit(getMotherDetailsFormValues());
          }}
          disabled={
            (!multipleChildrenArray && !isValid) ||
            (isAlreadyClient && !getMotherDetailsFormValues('id')) ||
            (!isAlreadyClient && !getMotherDetailsFormValues('age')) ||
            multipleChildrenArray?.filter((child) => child?.relationshipId)
              .length !== multipleChildrenArray?.length
          }
        />
      </div>
    </>
  );
};
