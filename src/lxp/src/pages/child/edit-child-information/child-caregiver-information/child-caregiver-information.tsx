import { Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  ChildCaregiverInformationModel,
  childCareGiverInformationSchema,
} from '@schemas/child/edit-child-information/care-giver-information-form';
import * as styles from './child-caregiver-information.styles';
import { ChildCaregiverInformationProps } from './child-caregiver-information.types';
import { useMemo, useState } from 'react';
import { useThunkFetchCall } from '@/hooks/useThunkFetchCall';
import { ChildrenActions } from '@/store/children/children.actions';

export const ChildCaregiverInformation: React.FC<
  ChildCaregiverInformationProps
> = ({
  childCareGiverInformation,
  childName,
  onSubmit,
  canEdit,
  enableReadOnlyMode,
}) => {
  const [readonly, setReadonly] = useState(enableReadOnlyMode);

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );

  const {
    getValues: getCareGiverInformationFormValues,
    register: careGiverInformationFormRegister,
    formState: careGiverInformationFormState,
  } = useForm<ChildCaregiverInformationModel>({
    resolver: yupResolver(childCareGiverInformationSchema),
    mode: 'onChange',
    defaultValues: childCareGiverInformation,
  });

  const { isValid, errors } = careGiverInformationFormState;

  const handleFormSubmit = () => {
    if (readonly) {
      setReadonly(false);
      return;
    }

    if (isValid && onSubmit) {
      onSubmit(getCareGiverInformationFormValues());
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
        text={`${childCareGiverInformation?.firstname} ${childCareGiverInformation?.surname}`}
        color={'primary'}
      />
      <Typography
        type={'body'}
        text={'Primary Caregiver'}
        color={'textMid'}
        weight={'bold'}
      />

      <Typography
        className="mt-8"
        type={'h4'}
        text={`Relationship to ${childName || ''}?`}
        color={'textDark'}
      />
      <Typography
        type={'body'}
        text={`${childCareGiverInformation?.relation}`}
        color={'textDark'}
      />
      <Divider dividerType="dashed" className="py-4" />
      <FormInput<ChildCaregiverInformationModel>
        label={'Cellphone number'}
        className={'mt-2'}
        readonly={readonly}
        register={careGiverInformationFormRegister}
        nameProp={'phoneNumber'}
        placeholder={readonly ? 'None' : 'E.g. 082 345 6789'}
        error={errors['phoneNumber']}
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
