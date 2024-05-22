import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { useEffect, useMemo, useState } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import * as styles from './care-giver-child-information-form.styles';
import {
  CareGiverChildInformationFormModel,
  careGiverChildInformationFormSchema,
} from '@schemas/child/child-registration/care-giver-child-information-form';
import { CareGiverChildInformationFormProps } from './care-giver-child-information-form.types';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const CareGiverChildInformationForm: React.FC<
  CareGiverChildInformationFormProps
> = ({ careGiverInformation, onSubmit, canEdit, enableReadOnlyMode }) => {
  const [readonly, setReadonly] = useState(enableReadOnlyMode);

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );

  useEffect(() => {
    document
      .querySelector('.min-h-full')
      ?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  const {
    getValues: getCareGiverChildInformationFormValues,
    register: careGiverChildInformationFormRegister,
    control: careGiverInformationFormControl,
  } = useForm<CareGiverChildInformationFormModel>({
    resolver: yupResolver(careGiverChildInformationFormSchema),
    mode: 'onBlur',
    defaultValues: careGiverInformation,
  });

  const { isValid, errors } = useFormState({
    control: careGiverInformationFormControl,
  });

  const handleFormSubmit = () => {
    if (readonly) {
      setReadonly(false);
      return;
    }

    if (isValid && onSubmit) {
      onSubmit(getCareGiverChildInformationFormValues());
    }
  };

  const submitButtonProps = useMemo(() => {
    if (!enableReadOnlyMode) {
      return { text: 'Next', icon: 'ArrowCircleRightIcon' };
    }
    if (readonly) {
      return { text: 'Edit', icon: 'PencilIcon' };
    }

    return { text: 'Save', icon: 'SaveIcon' };
  }, [enableReadOnlyMode, readonly]);

  return (
    <div className={styles.wrapper}>
      <Typography
        type={'h1'}
        text={'Primary caregiver & child'}
        color={'primary'}
      />
      <Typography type={'h2'} text={'Address'} color={'textMid'} />
      <FormInput<CareGiverChildInformationFormModel>
        readonly={readonly}
        label={'Street address'}
        hint="Optional"
        register={careGiverChildInformationFormRegister}
        nameProp={'streetAddress'}
        textInputType={readonly ? 'input' : 'textarea'}
        error={errors['streetAddress']}
        className={styles.spacer}
        placeholder={
          readonly
            ? 'None'
            : 'E.g. 203 Oak Apartments, 11 Green Road, Mamelodi East'
        }
      />
      <Divider dividerType="dashed" className="py-4" />
      <FormInput<CareGiverChildInformationFormModel>
        readonly={readonly}
        label={'Postal code'}
        register={careGiverChildInformationFormRegister}
        nameProp={'postalCode'}
        error={errors['postalCode']}
        placeholder={readonly ? 'None' : 'E.g. 0122'}
      />
      <Divider dividerType="dashed" className="py-4" />
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
