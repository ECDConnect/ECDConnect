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
  EditPregnantDetailsProps,
  yesNoOptions,
} from './pregnant-details.types';
import {
  pregnantDetailsModelSchema,
  PregnantDetailsModel,
} from '@/schemas/pregnant/pregnant-details';
import { motherSelectors } from '@/store/mother';
import { useSelector } from 'react-redux';

export const PregnantDetails: React.FC<EditPregnantDetailsProps> = ({
  onSubmit,
  setAddress,
  setContactInformation,
  setIsAlreadyClient,
  isAlreadyClient,
}) => {
  const {
    // watch,
    getValues: getPregnantDetailsFormValues,
    // formState: pregnantDetailsFormState,
    setValue: setPregnantDetailsFormValue,
    register: consentFormRegister,
    // reset: resetPregnantDetailsFormValue,
    control: momDetailsFormControl,
  } = useForm<PregnantDetailsModel>({
    resolver: yupResolver(pregnantDetailsModelSchema),
    mode: 'onBlur',
    // defaultValues: playgroup,
    reValidateMode: 'onChange',
  });

  const { isValid } = useFormState({ control: momDetailsFormControl });

  console.log(getPregnantDetailsFormValues());
  const [userId, setUserId] = useState('');
  const mothers = useSelector(motherSelectors.getMothers);
  const handleAddExistingUser = useMemo(() => {
    const existingUser = mothers.find(
      (item) => item?.user?.id === userId.toString()
    );
    return existingUser;
  }, [userId, mothers]);

  useEffect(() => {
    if (isAlreadyClient) {
      setPregnantDetailsFormValue('name', handleAddExistingUser?.firstName!);
      setPregnantDetailsFormValue('surname', handleAddExistingUser?.surname!);
      setPregnantDetailsFormValue('age', handleAddExistingUser?.age!);
    }
  }, [isAlreadyClient, setPregnantDetailsFormValue, handleAddExistingUser]);

  return (
    <div className="h-screen h-full w-screen w-full p-4">
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
      </>
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
        {isAlreadyClient === true && (
          <div className="mt-4 w-full">
            <Dropdown
              placeholder={'Please choose the client:'}
              fillType="clear"
              // selectedValue={getMomDetailsFormValues()}
              list={
                (mothers &&
                  mothers
                    .filter((x) => x.firstName?.length! > 0)
                    .map((item) => {
                      return {
                        label: item.firstName!,
                        value: item.id,
                      };
                    })) ||
                []
              }
              onChange={(value) => setUserId(value!)}
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
              onSubmit(getPregnantDetailsFormValues());
              setAddress(handleAddExistingUser?.siteAddressId);
              setContactInformation(handleAddExistingUser?.phoneNumber);
            }}
            disabled={!isValid}
          />
        </div>
      </div>
    </div>
  );
};
