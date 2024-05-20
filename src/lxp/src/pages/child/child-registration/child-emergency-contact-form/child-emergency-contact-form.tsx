import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Divider,
  FormInput,
  Typography,
  ButtonGroupOption,
  ButtonGroupTypes,
} from '@ecdlink/ui';
import { useFormState, useForm } from 'react-hook-form';
import {
  ChildEmergencyContactFormModel,
  childEmergencyContactFormSchema,
} from '@schemas/child/child-registration/child-emergency-contact-form';
import * as styles from './child-emergency-contact-form.styles';
import { useState } from 'react';
import { ChildEmergencyContactFormProps } from './child-emergency-contact-form.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { CaregiverActions } from '@/store/caregiver/caregiver.actions';

export const ChildEmergencyContactForm: React.FC<
  ChildEmergencyContactFormProps
> = ({
  childEmergencyContactForm,
  childName,
  onSubmit,
  variation = 'practitioner',
  canEdit = false,
}) => {
  const [readonly, setReadonly] = useState(true);
  const [contactAllowedCustody, setContactAllowedCustody] = useState<
    boolean | undefined
  >(childEmergencyContactForm?.isAllowedCustody ?? undefined);

  const { isLoading } = useThunkFetchCall(
    'caregivers',
    CaregiverActions.UPDATE_CAREGIVER
  );

  const {
    getValues: getChildEmergencyContactFormValues,
    setValue: setChildEmergencyContactFormValue,
    register: childEmergencyContactFormRegister,
    trigger: triggerChildEmergencyContactForm,
    control: childEmergencyContactFormControl,
  } = useForm<ChildEmergencyContactFormModel>({
    resolver: yupResolver(childEmergencyContactFormSchema),
    mode: 'onChange',
    defaultValues: childEmergencyContactForm,
  });

  const { isValid, errors } = useFormState({
    control: childEmergencyContactFormControl,
  });

  const custodyAllowedOptions: ButtonGroupOption<boolean>[] = [
    { text: 'Yes', value: true },
    { text: 'No', value: false },
  ];

  const handleFormSubmit = () => {
    if (readonly) {
      setReadonly(false);
      return;
    }

    if (isValid && onSubmit) {
      onSubmit(getChildEmergencyContactFormValues());
    }
  };

  return (
    <div className="mb-4 flex h-full flex-col bg-white px-4 pt-2 pb-4">
      <Typography
        type={'h1'}
        text={'Person to contact in an emergency'}
        color={'primary'}
      />
      <FormInput<ChildEmergencyContactFormModel>
        readonly={readonly}
        label={'First name'}
        className={styles.spacer}
        register={childEmergencyContactFormRegister}
        error={errors['firstname']}
        nameProp={'firstname'}
        placeholder={'First name'}
      />
      <Divider dividerType="dashed" className="my-4" />
      <FormInput<ChildEmergencyContactFormModel>
        readonly={readonly}
        label={'Surname'}
        register={childEmergencyContactFormRegister}
        nameProp={'surname'}
        error={errors['surname']}
        placeholder={'Surname/family name'}
      />
      <Divider dividerType="dashed" className="my-4" />
      <FormInput<ChildEmergencyContactFormModel>
        readonly={readonly}
        label={'Cellphone number'}
        register={childEmergencyContactFormRegister}
        nameProp={'phoneNumber'}
        error={errors['phoneNumber']}
        placeholder={'E.g. 012 345 6789'}
      />
      <Divider dividerType="dashed" className="my-4" />
      <label className={styles.label}>
        {`Is the emergency contact allowed to pick ${
          childName ?? 'Child'
        } up in ${
          variation === 'caregiver' ? 'your' : 'the caregiver’s'
        } place?`}
      </label>
      <div className="mt-2">
        {readonly ? (
          <Typography
            type={'body'}
            text={contactAllowedCustody ? 'Yes' : 'No'}
            color={'textDark'}
          />
        ) : (
          <ButtonGroup
            options={custodyAllowedOptions}
            onOptionSelected={(value: boolean | boolean[]) => {
              setChildEmergencyContactFormValue(
                'isAllowedCustody',
                value as boolean
              );
              setContactAllowedCustody(value as boolean);
              triggerChildEmergencyContactForm();
            }}
            selectedOptions={contactAllowedCustody}
            color="secondary"
            type={ButtonGroupTypes.Button}
            className={'w-full'}
            multiple={false}
          />
        )}
      </div>
      <Divider dividerType="dashed" className="my-4" />
      {!contactAllowedCustody && (
        <div className={'mt-4'}>
          <Typography
            type={'h1'}
            text={`Who can pick ${childName} up if ${
              variation === 'caregiver'
                ? 'you are unable to come'
                : 'the caregiver cannot'
            }?`}
            color={'primary'}
          />
          <FormInput<ChildEmergencyContactFormModel>
            readonly={readonly}
            label={'First name'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianFirstname'}
            error={errors['custodianFirstname']}
            placeholder={'First name'}
          />
          <Divider dividerType="dashed" className="my-4" />
          <FormInput<ChildEmergencyContactFormModel>
            readonly={readonly}
            label={'Surname'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianSurname'}
            error={errors['custodianSurname']}
            placeholder={'Surname/family name'}
          />
          <Divider dividerType="dashed" className="my-4" />
          <FormInput<ChildEmergencyContactFormModel>
            readonly={readonly}
            label={'Cellphone number'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianPhoneNumber'}
            error={errors['custodianPhoneNumber']}
            placeholder={'012 345 6789'}
          />
          <Divider dividerType="dashed" className="my-4" />
        </div>
      )}
      {canEdit && (
        <Button
          isLoading={isLoading}
          onClick={handleFormSubmit}
          className="mt-auto mb-4 w-full"
          size="small"
          color="quatenary"
          type="filled"
          disabled={(!readonly && !isValid) || isLoading}
          icon={readonly ? 'PencilIcon' : 'SaveIcon'}
          text={readonly ? 'Edit' : 'Save'}
          textColor="white"
        />
      )}
    </div>
  );
};
