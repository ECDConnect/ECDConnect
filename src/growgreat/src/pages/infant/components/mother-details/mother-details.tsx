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
import { useState, useMemo, useEffect } from 'react';
import {
  MotherDetailsProps,
  yesNoOptions,
  relationshipTypes,
} from './mother-details.types';
import {
  MotherDetailsModel,
  motherDetailsModelSchema,
} from '@/schemas/infant/mother-details';
import { motherSelectors } from '@/store/mother';
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
  const mothers = useSelector(motherSelectors.getMothers);
  const [relationshipChildrenArray, setRelationshipChildrenArray] =
    useState<MultipleChildrenProps[]>();
  const hasMultipleChildren = multipleChildrenArray?.length! > 1;
  const [userId, setUserId] = useState('');
  const caregivers = useSelector(caregiverSelectors.getCaregivers);
  const handleAddExistingUser = useMemo(() => {
    const existingUser = mothers.find((item) => item.userId === userId);
    return existingUser;
  }, [userId, mothers]);

  useEffect(() => {
    if (isAlreadyClient) {
      setMothereDetailsFormValue('name', handleAddExistingUser?.firstName!);
      setMothereDetailsFormValue('surname', handleAddExistingUser?.surname!);
      setMothereDetailsFormValue('age', handleAddExistingUser?.age!);
    }
  }, [isAlreadyClient, handleAddExistingUser, setMothereDetailsFormValue]);

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
    <div className="h-screen ">
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
                // selectedValue={getMomDetailsFormValues()}
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
              selectedValue={getMothereDetailsFormValues('name')}
              list={
                (caregivers &&
                  caregivers
                    .filter((x) => x.firstName?.length! > 0)
                    .map((item) => {
                      return {
                        label: item.firstName! + ' ' + item.surname!,
                        value: item.id,
                      };
                    })) ||
                []
              }
              onChange={(value) => {
                setMultipleChildrenArray({
                  ...multipleChildrenArray,
                  caregiver: value,
                });
                setUserId(value!);
              }}
            />
          </div>
        )}
      </div>
      <div className="flex h-full w-full align-bottom">
        <div className={'mt-10 flex w-11/12 justify-center align-bottom'}>
          <Button
            type={'filled'}
            color={'primary'}
            className={'absolute bottom-10 mt-2 ml-6 max-h-10 w-11/12'}
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
      </div>
    </div>
  );
};
