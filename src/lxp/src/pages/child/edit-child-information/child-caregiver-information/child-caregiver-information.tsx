import {
  Button,
  classNames,
  Divider,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import {
  ChildCaregiverInformationModel,
  childCareGiverInformationSchema,
} from '@schemas/child/edit-child-information/care-giver-information-form';
import * as styles from './child-caregiver-information.styles';
import { ChildCaregiverInformationProps } from './child-caregiver-information.types';

export const ChildCaregiverInformation: React.FC<
  ChildCaregiverInformationProps
> = ({
  childCareGiverInformation,
  childName,
  submitButtonIcon = 'SaveIcon',
  submitButtonText = 'Save',
  onSubmit,
  canEdit = false,
}) => {
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
    if (isValid && onSubmit) {
      onSubmit(getCareGiverInformationFormValues());
    }
  };

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

      <div className={'pt-4'}>
        <Typography
          type={'h3'}
          text={`Relationship to ${childName || ''}?`}
          color={'textMid'}
        />
        <Typography
          type={'body'}
          text={`${childCareGiverInformation?.relation}`}
          color={'textMid'}
        />
      </div>
      <FormInput<ChildCaregiverInformationModel>
        label={'Cellphone number'}
        className={'mt-2'}
        register={careGiverInformationFormRegister}
        nameProp={'phoneNumber'}
        placeholder={'E.g. 082 345 6789'}
        disabled={canEdit}
        error={errors['phoneNumber']}
      />
      <div className={'py-2'}>
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
