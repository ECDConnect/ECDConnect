import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Dropdown,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
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
    // watch,
    getValues: getMothereDetailsFormValues,
    // formState: pregnantDetailsFormState,
    setValue: setMothereDetailsFormValue,
    register: caregiverFormRegister,
    // reset: resetMothereDetailsFormValue,
    control: motherDetailsFormControl,
  } = useForm<MotherDetailsModel>({
    resolver: yupResolver(motherDetailsModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({ control: motherDetailsFormControl });
  const [relationshipChildrenArray, setRelationshipChildrenArray] =
    useState<MultipleChildrenProps[]>();
  const hasMultipleChildren = multipleChildrenArray?.length! > 1;

  const caregivers = useSelector(caregiverSelectors.getCaregivers);

  useEffect(() => {
    const uniqueChildrenArray = relationshipChildrenArray?.filter(
      (elem, index, self) =>
        self.findIndex((t) => {
          return (
            // TODO: Fix this expression
            // REASON: The expression is duplicated on both sides of a logical operator.
            // deepcode ignore CopyPasteError: <We will address this in the next phase>
            t.firstName === elem.firstName && t.firstName === elem.firstName
          );
        }) === index
    );
    // if (uniqueChildrenArray)
    setMultipleChildrenArray(uniqueChildrenArray);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationshipChildrenArray]);

  return (
    <>
      <div>
        <Typography
          type="h2"
          color={'textDark'}
          text={'Caregiver'}
          className="z-50 pt-6"
        />
        <Typography
          type="h4"
          color={'textMid'}
          text={'Details'}
          className="z-50 w-11/12 pt-2"
        />
      </div>
      <div className="flex w-11/12 justify-center text-red-400">
        <Divider dividerType="dashed" />
      </div>
      <div>
        <Typography
          type="h3"
          color={'textDark'}
          text={'Is this client already on CHW Connect?'}
          className="z-50 w-11/12 pt-2"
        />
        <div className="mt-2">
          <ButtonGroup<boolean>
            options={yesNoOptions}
            onOptionSelected={(value: boolean | boolean[]) =>
              setIsAlreadyClient(value)
            }
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
          />
        </div>
        <div className="mt-4 w-full">
          {multipleChildrenArray?.length! > 1 ? (
            multipleChildrenArray?.map((child, index) => {
              return (
                <div key={index}>
                  <Typography
                    key={index + 2}
                    type="h3"
                    color={'textDark'}
                    text={`Relationship to ${child?.firstName}`}
                    className="bt-1 z-50 w-11/12 pt-2"
                  />
                  <Dropdown
                    key={index + 3}
                    placeholder={'Please choose the client:'}
                    fillType="clear"
                    selectedValue={
                      getMothereDetailsFormValues('relationshipId') ||
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
                            ...relationshipChildrenArray!,
                          ])
                        : setRelationshipChildrenArray([
                            {
                              ...multipleChildrenArray[index],
                              relationshipId: value,
                            },
                            ...multipleChildrenArray!,
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
                className="bt-1 z-50 w-11/12 pt-2"
              />
              <Dropdown
                placeholder={'Please choose the client:'}
                fillType="clear"
                selectedValue={getMothereDetailsFormValues('relationshipId')}
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
                  setMothereDetailsFormValue('relationshipId', value);
                }}
              />
            </>
          )}
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
                className="z-50 mt-12"
              />
            </div>
          </>
        )}
        {isAlreadyClient === true && (
          <div className="mt-4 w-full">
            <Typography
              type="h3"
              color={'textDark'}
              text={`Choose caregiver`}
              className="bt-1 z-50 w-11/12 pt-2"
            />
            <Dropdown
              placeholder={'Please choose the client:'}
              fillType="clear"
              selectedValue={getMothereDetailsFormValues('id')}
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
                const caregiver = caregivers?.find((item) => item.id === value);
                setMothereDetailsFormValue('id', value);
                setMothereDetailsFormValue('name', caregiver?.firstName);
                setMothereDetailsFormValue('surname', caregiver?.surname);
                setMothereDetailsFormValue('age', caregiver?.age);
              }}
            />
          </div>
        )}
      </div>
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
            onSubmit(getMothereDetailsFormValues());
            // setAddress(handleAddExistingUser?.siteAddress);
            // setContactInformation(handleAddExistingUser?.phoneNumber);
          }}
          disabled={!isValid && !isAlreadyClient && !hasMultipleChildren}
        />
      </div>
    </>
  );
};
