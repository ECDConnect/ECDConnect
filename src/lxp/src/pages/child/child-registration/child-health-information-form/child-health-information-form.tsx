import { Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState } from 'react-hook-form';
import {
  ChildHealthInformationFormModel,
  childHealthInformationFormSchema,
} from '@schemas/child/child-registration/child-health-information-form';
import { ChildHealthInformationFormProps } from './child-health-information-form.types';
import { useMemo, useState } from 'react';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const ChildHealthInformationForm: React.FC<
  ChildHealthInformationFormProps
> = ({
  childHealthInformation,
  childName = 'Child',
  onSubmit,
  canEdit = false,
  enableReadOnlyMode,
}) => {
  const [readonly, setReadonly] = useState(enableReadOnlyMode);

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );

  const {
    getValues: getChildHealthInformationFormValues,
    register: childHealthInformationFormRegister,
    control: childHealthInformationFormControl,
  } = useForm<ChildHealthInformationFormModel>({
    resolver: yupResolver(childHealthInformationFormSchema),
    mode: 'onBlur',
    defaultValues: childHealthInformation,
  });

  const { isValid } = useFormState({
    control: childHealthInformationFormControl,
  });

  const handleFormSubmit = () => {
    if (readonly) {
      setReadonly(false);
      return;
    }

    if (isValid && onSubmit) {
      onSubmit(getChildHealthInformationFormValues());
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
    <div className={'flex h-full flex-col bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h2'} text={childName} color={'primary'} />
      <Typography type={'h4'} text={'Health information'} color={'textMid'} />
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any allergies'}
        hint={readonly ? undefined : 'Optional'}
        className={'mt-3 mb-4'}
        register={childHealthInformationFormRegister}
        nameProp={'allergies'}
        placeholder={readonly ? 'None' : 'E.g. peanuts'}
      />
      {readonly && <Divider dividerType="dashed" className="mb-4" />}
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any disabilities'}
        hint={readonly ? undefined : 'Optional'}
        register={childHealthInformationFormRegister}
        nameProp={'disabilities'}
        placeholder={readonly ? 'None' : 'E.g. blind'}
        className="mb-4"
      />
      {readonly && <Divider dividerType="dashed" className="mb-4-4" />}
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any other health conditions'}
        hint={readonly ? undefined : 'Optional'}
        textInputType={readonly ? 'input' : 'textarea'}
        register={childHealthInformationFormRegister}
        nameProp={'healthConditions'}
        className="mb-4"
        placeholder={
          readonly
            ? 'None'
            : 'E.g. chronic illnesses such as diabetes or epilepsy'
        }
      />
      {readonly && <Divider dividerType="dashed" className="mb-4" />}

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
