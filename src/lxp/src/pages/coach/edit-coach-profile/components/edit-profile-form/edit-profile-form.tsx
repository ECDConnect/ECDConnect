import { Button, FormInput, Typography, renderIcon } from '@ecdlink/ui';

import { useForm, useFormState, useWatch } from 'react-hook-form';
import { EditProfileFormProps } from './edit-profile-form.types';
import * as styles from '../../edit-coach-profile.styles';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  EditProfileInformationModel,
  editCoachProfileSchema,
} from '@schemas/coach/edit-profile';

export const EditProfileForm: React.FC<EditProfileFormProps> = ({
  coachProfileInformation,
  onSubmit,
}) => {
  const {
    getValues: getCoachProfileFormValues,
    setValue: setCoachProfileFormValue,
    register: coachProfileFormRegister,
    control: coachProfileFormControl,
  } = useForm<EditProfileInformationModel>({
    resolver: yupResolver(editCoachProfileSchema),
    defaultValues: {
      email: coachProfileInformation?.email || '',
    },
    mode: 'onChange',
  });

  const { errors } = useFormState({
    control: coachProfileFormControl,
  });

  const { email } = useWatch({
    control: coachProfileFormControl,
  });

  const disabledButton = !email;

  const handleFormSubmit = (): void => {
    const profileFormValues = getCoachProfileFormValues();

    const newCoachProfileInformation = Object.assign(
      {},
      coachProfileInformation
    );

    newCoachProfileInformation.email = profileFormValues.email;
    onSubmit(newCoachProfileInformation);
  };

  return (
    <div>
      <Typography
        type={'h1'}
        text={'Complete your Profile'}
        color={'primary'}
        className={'my-3'}
      />
      <div className="space-y-4 pb-16">
        <FormInput<EditProfileInformationModel>
          label={'Email address?'}
          register={coachProfileFormRegister}
          nameProp={'email'}
          error={errors['email']}
          placeholder={'E.g. example@example.com'}
          type={'text'}
        ></FormInput>

        <Button
          size="small"
          type="filled"
          color="primary"
          className={styles.button}
          disabled={disabledButton}
          onClick={handleFormSubmit}
        >
          {renderIcon('ArrowCircleRightIcon', styles.icon)}
          <Typography
            type={'h6'}
            text={'Next'}
            color={'white'}
            className="ml-2"
          />
        </Button>
      </div>
    </div>
  );
};
