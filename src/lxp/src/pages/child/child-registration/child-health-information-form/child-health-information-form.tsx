import { Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState } from 'react-hook-form';
import {
  ChildHealthInformationFormModel,
  childHealthInformationFormSchema,
} from '@schemas/child/child-registration/child-health-information-form';
import { ChildHealthInformationFormProps } from './child-health-information-form.types';
import { useState } from 'react';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const ChildHealthInformationForm: React.FC<
  ChildHealthInformationFormProps
> = ({
  childHealthInformation,
  childName = 'Child',
  onSubmit,
  canEdit = false,
}) => {
  const [readonly, setReadonly] = useState(true);

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

  return (
    <div className={'flex h-full flex-col bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h1'} text={childName} color={'primary'} />
      <Typography type={'h2'} text={'Health information'} color={'textMid'} />
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any allergies'}
        className={'mt-3'}
        register={childHealthInformationFormRegister}
        nameProp={'allergies'}
        placeholder={'E.g. peanuts'}
      />
      <Divider dividerType="dashed" className="py-4" />
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any disabilities'}
        register={childHealthInformationFormRegister}
        nameProp={'disabilities'}
        placeholder={'E.g. blind'}
      />
      <Divider dividerType="dashed" className="py-4" />
      <FormInput<ChildHealthInformationFormModel>
        readonly={readonly}
        label={'List any other health conditions'}
        textInputType={readonly ? 'input' : 'textarea'}
        register={childHealthInformationFormRegister}
        nameProp={'healthConditions'}
        placeholder={'E.g. chronic illnesses such as diabetes or epilepsy'}
      />
      <Divider dividerType="dashed" className="py-4" />
      {canEdit && (
        <Button
          isLoading={isLoading}
          onClick={handleFormSubmit}
          className="mt-auto w-full"
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
