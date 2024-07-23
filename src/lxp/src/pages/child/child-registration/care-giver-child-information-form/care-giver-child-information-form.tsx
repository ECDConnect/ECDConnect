import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
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
import { useDialog } from '@ecdlink/core';
import { PostalCodeModal } from './components/portal-code-modal/postal-code-modal';

export const CareGiverChildInformationForm: React.FC<
  CareGiverChildInformationFormProps
> = ({ careGiverInformation, onSubmit, canEdit, enableReadOnlyMode }) => {
  const [readonly, setReadonly] = useState(enableReadOnlyMode);

  const { isLoading } = useThunkFetchCall(
    'children',
    ChildrenActions.UPDATE_CHILD
  );

  const dialog = useDialog();

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

  const onHelpPostalCode = () => {
    dialog({
      color: 'bg-white',
      position: DialogPosition.Middle,
      render: (onClose) => <PostalCodeModal onClose={onClose} />,
    });
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
        type={'h2'}
        text={'Primary caregiver & child'}
        color={'primary'}
      />
      <Typography type={'h4'} text={'Address'} color={'textMid'} />
      <FormInput<CareGiverChildInformationFormModel>
        readonly={readonly}
        label={'Street address'}
        hint="Optional"
        register={careGiverChildInformationFormRegister}
        nameProp={'streetAddress'}
        textInputType={readonly ? 'input' : 'textarea'}
        error={errors['streetAddress']}
        className="my-4"
        placeholder={
          readonly
            ? 'None'
            : 'E.g. 203 Oak Apartments, 11 Green Road, Mamelodi East'
        }
      />
      {readonly && <Divider dividerType="dashed" />}
      <FormInput<CareGiverChildInformationFormModel>
        readonly={readonly}
        label={'Postal code'}
        register={careGiverChildInformationFormRegister}
        nameProp={'postalCode'}
        error={errors['postalCode']}
        placeholder={readonly ? 'None' : 'E.g. 0122'}
        className="my-4"
      />

      {readonly ? (
        <Divider dividerType="dashed" className="mb-4" />
      ) : (
        <button className="flex items-center gap-2" onClick={onHelpPostalCode}>
          {renderIcon('QuestionMarkCircleIcon', 'text-secondary h-5 w-5')}
          <Typography
            type="help"
            color="textDark"
            text="Tap here for help finding your postal code."
          />
        </button>
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
