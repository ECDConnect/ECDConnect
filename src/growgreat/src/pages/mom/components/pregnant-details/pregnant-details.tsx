import { useState, useMemo, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useForm, useFormState } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  // Divider,
  Typography,
  ButtonGroup,
  ButtonGroupTypes,
  FormInput,
  Dropdown,
  UserAlertListDataItem,
  ActionListDataItem,
} from '@ecdlink/ui';

import { motherSelectors } from '@/store/mother';

import {
  EditPregnantDetailsProps,
  yesNoOptions,
} from '@/pages/mom/components/pregnant-details/pregnant-details.types';

import {
  pregnantDetailsModelSchema,
  PregnantDetailsModel,
} from '@/schemas/pregnant/pregnant-details';
import { format } from 'date-fns';

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
  const [getMothers, setMothersListItems] = useState(mothers);
  const handleAddExistingUser = useMemo(() => {
    const existingUser = mothers.find(
      (item) => item?.user?.id === userId.toString()
    );
    return existingUser;
  }, [userId, mothers]);

  useEffect(() => {
    if (!mothers?.length) {
      setMothersListItems(mothers);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mothers, getMothers]);

  useEffect(() => {
    if (isAlreadyClient) {
      setPregnantDetailsFormValue('name', handleAddExistingUser?.firstName!);
      setPregnantDetailsFormValue('surname', handleAddExistingUser?.surname!);
      setPregnantDetailsFormValue('age', handleAddExistingUser?.age!);
    }
  }, [isAlreadyClient, setPregnantDetailsFormValue, handleAddExistingUser]);

  return (
    <div className="h-screen h-full w-screen w-full px-4">
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
        className="z-50 w-full pt-2"
      />

      <Typography
        type="h3"
        color={'textDark'}
        text={'Is this client already on CHW Connect?'}
        className="z-50 w-full py-3"
      />

      <ButtonGroup<boolean>
        options={yesNoOptions}
        onOptionSelected={(value: boolean | boolean[]) =>
          setIsAlreadyClient(value)
        }
        color="secondary"
        type={ButtonGroupTypes.Button}
        className={'w-full'}
      />
      {isAlreadyClient === false && (
        <div className={'flex w-full flex-col py-3'}>
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
              className="z-50 mt-11 pl-4"
            />
          </div>
        </div>
      )}
      {isAlreadyClient === true && (
        <div className="my-4 w-full">
          <Dropdown
            fullWidth={true}
            placeholder={'Please choose the client:'}
            fillType="clear"
            // selectedValue={getMomDetailsFormValues()}
            list={
              (mothers?.length &&
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
      <div className={'mb-16 w-full'}>
        <Button
          text={`Next`}
          type={'filled'}
          color={'primary'}
          textColor={'white'}
          disabled={!isValid}
          iconPosition={'start'}
          icon={'ArrowCircleRightIcon'}
          className={
            'absolute left-0 right-0 bottom-10 m-auto mt-2 max-h-10 w-11/12'
          }
          onClick={() => {
            onSubmit(getPregnantDetailsFormValues());
            setAddress(handleAddExistingUser?.siteAddressId);
            setContactInformation(handleAddExistingUser?.phoneNumber);
          }}
        />
      </div>
    </div>
  );
};
