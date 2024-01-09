import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  ButtonGroup,
  Divider,
  FormInput,
  Typography,
  classNames,
  ButtonGroupOption,
  ButtonGroupTypes,
  renderIcon,
} from '@ecdlink/ui';
import { useFormState, useForm } from 'react-hook-form';
import {
  ChildEmergencyContactFormModel,
  childEmergencyContactFormSchema,
} from '@schemas/child/child-registration/child-emergency-contact-form';
import * as styles from './child-emergency-contact-form.styles';
import { useEffect, useState } from 'react';
import { ChildEmergencyContactFormProps } from './child-emergency-contact-form.types';

export const ChildEmergencyContactForm: React.FC<
  ChildEmergencyContactFormProps
> = ({
  childEmergencyContactForm,
  childName,
  submitButtonText = 'Next',
  submitButtonIcon = 'ArrowCircleRightIcon',
  onSubmit,
  variation = 'practitioner',
  canEdit = false,
}) => {
  const [contactAllowedCustody, setContactAllowedCustody] = useState<boolean>();

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
    if (isValid && onSubmit) {
      onSubmit(getChildEmergencyContactFormValues());
    }
  };

  return (
    <div className={'bg-white px-4 pt-2 pb-4'}>
      <Typography
        type={'h1'}
        text={'Person to contact in an emergency'}
        color={'primary'}
      />
      <FormInput<ChildEmergencyContactFormModel>
        label={'First name'}
        className={styles.spacer}
        register={childEmergencyContactFormRegister}
        error={errors['firstname']}
        nameProp={'firstname'}
        placeholder={'First name'}
        disabled={canEdit}
      />
      <FormInput<ChildEmergencyContactFormModel>
        label={'Surname'}
        className={styles.spacer}
        register={childEmergencyContactFormRegister}
        nameProp={'surname'}
        error={errors['surname']}
        placeholder={'Surname/family name'}
        disabled={canEdit}
      />
      <FormInput<ChildEmergencyContactFormModel>
        label={'Cellphone number'}
        className={styles.spacer}
        register={childEmergencyContactFormRegister}
        nameProp={'phoneNumber'}
        error={errors['phoneNumber']}
        placeholder={'E.g. 012 345 6789'}
        disabled={canEdit}
      />
      <label className={classNames(styles.label, styles.spacer)}>
        {`Is the emergency contact allowed to pick ${
          childName ?? 'Child'
        } up in ${
          variation === 'caregiver' ? 'your' : 'the caregiver’s'
        } place?`}
      </label>
      <div className={`mt-2 ${canEdit ? 'pointer-events-none' : ''}`}>
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
      </div>
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
            label={'First name'}
            className={styles.spacer}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianFirstname'}
            error={errors['custodianFirstname']}
            placeholder={'First name'}
            disabled={canEdit}
          />
          <FormInput<ChildEmergencyContactFormModel>
            label={'Surname'}
            className={styles.spacer}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianSurname'}
            error={errors['custodianSurname']}
            placeholder={'Surname/family name'}
            disabled={canEdit}
          />
          <FormInput<ChildEmergencyContactFormModel>
            label={'Cellphone number'}
            className={styles.spacer}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianPhoneNumber'}
            error={errors['custodianPhoneNumber']}
            placeholder={'012 345 6789'}
            disabled={canEdit}
          />
        </div>
      )}
      <div className={'py-4'}>
        <Divider></Divider>
      </div>
      <Button
        onClick={handleFormSubmit}
        className="w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon(submitButtonIcon, classNames('h-5 w-5 text-white'))}
        <Typography
          type="h6"
          className="ml-2"
          text={submitButtonText}
          color="white"
        />
      </Button>
    </div>
  );
};
