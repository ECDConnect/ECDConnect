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
import { useMemo, useState } from 'react';
import { ChildEmergencyContactFormProps } from './child-emergency-contact-form.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const ChildEmergencyContactForm: React.FC<
  ChildEmergencyContactFormProps
> = ({
  enableReadOnlyMode,
  childEmergencyContactForm,
  childName,
  onSubmit,
  variation = 'practitioner',
  canEdit = false,
}) => {
  const [readonly, setReadonly] = useState(enableReadOnlyMode);
  const [contactAllowedCustody, setContactAllowedCustody] = useState<
    boolean | undefined
  >(childEmergencyContactForm?.isAllowedCustody ?? undefined);

  const { isLoading: updatingChild } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );
  const { isLoading: isLoadingOpenAccess } = useThunkFetchCall(
    'children',
    ChildrenActions.OPEN_ACCESS_ADD_CHILD
  );

  const isLoading = updatingChild || isLoadingOpenAccess;

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

  const submitButtonProps = useMemo(() => {
    if (readonly) {
      return { text: 'Edit', icon: 'PencilIcon' };
    }

    return { text: 'Save', icon: 'SaveIcon' };
  }, [readonly]);

  return (
    <div className="mb-4 flex h-full flex-col bg-white px-4 pt-2 pb-4">
      <Typography
        type={'h2'}
        text={'Additional person to contact in an emergency'}
        color={'primary'}
      />
      {!readonly && (
        <Typography
          type={'h4'}
          text={
            'Provide contact details of someone who can be contacted if the caregiver is not available.'
          }
          color={'textMid'}
          className="mb-5"
        />
      )}
      <FormInput<ChildEmergencyContactFormModel>
        readonly={readonly}
        label={'First name'}
        className={styles.spacer}
        register={childEmergencyContactFormRegister}
        error={errors['firstname']}
        nameProp={'firstname'}
        placeholder={readonly ? 'None' : 'First name'}
      />
      {readonly && <Divider dividerType="dashed" className={styles.spacer} />}
      <FormInput<ChildEmergencyContactFormModel>
        className={styles.spacer}
        readonly={readonly}
        label={'Surname'}
        register={childEmergencyContactFormRegister}
        nameProp={'surname'}
        error={errors['surname']}
        placeholder={readonly ? 'None' : 'Surname/family name'}
      />
      {readonly && <Divider dividerType="dashed" className={styles.spacer} />}
      <FormInput<ChildEmergencyContactFormModel>
        className={styles.spacer}
        readonly={readonly}
        label={'Cellphone number'}
        register={childEmergencyContactFormRegister}
        nameProp={'phoneNumber'}
        error={errors['phoneNumber']}
        placeholder={readonly ? 'None' : 'E.g. 012 345 6789'}
      />
      {readonly && <Divider dividerType="dashed" className={styles.spacer} />}
      <Typography
        type="h4"
        color="textDark"
        text={`Is the emergency contact allowed to pick ${
          childName ?? 'Child'
        } up in ${
          variation === 'caregiver' ? 'your' : 'the caregiver’s'
        } place?`}
      />
      <div className="mt-2 mb-4">
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
      {readonly && <Divider dividerType="dashed" className={styles.spacer} />}
      {contactAllowedCustody === false && (
        <>
          <Typography
            type={'h1'}
            text={`Who can pick ${childName} up if ${
              variation === 'caregiver'
                ? 'you are unable to come'
                : 'the caregiver cannot'
            }?`}
            color={'primary'}
            className={styles.spacer}
          />
          <FormInput<ChildEmergencyContactFormModel>
            readonly={readonly}
            label={'First name'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianFirstname'}
            error={errors['custodianFirstname']}
            placeholder={readonly ? 'None' : 'First name'}
            className={styles.spacer}
          />
          {readonly && (
            <Divider dividerType="dashed" className={styles.spacer} />
          )}
          <FormInput<ChildEmergencyContactFormModel>
            className={styles.spacer}
            readonly={readonly}
            label={'Surname'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianSurname'}
            error={errors['custodianSurname']}
            placeholder={readonly ? 'None' : 'Surname/family name'}
          />
          {readonly && (
            <Divider dividerType="dashed" className={styles.spacer} />
          )}
          <FormInput<ChildEmergencyContactFormModel>
            readonly={readonly}
            label={'Cellphone number'}
            register={childEmergencyContactFormRegister}
            nameProp={'custodianPhoneNumber'}
            error={errors['custodianPhoneNumber']}
            placeholder={readonly ? 'None' : '012 345 6789'}
            className={styles.spacer}
          />
          {readonly && (
            <Divider dividerType="dashed" className={styles.spacer} />
          )}
        </>
      )}
      {(canEdit || !enableReadOnlyMode) && (
        <Button
          isLoading={isLoading}
          onClick={handleFormSubmit}
          className="mt-auto w-full"
          size="small"
          color="quatenary"
          type="filled"
          disabled={(!readonly && !isValid) || isLoading}
          icon={submitButtonProps.icon}
          text={submitButtonProps.text}
          textColor="white"
        />
      )}
    </div>
  );
};
