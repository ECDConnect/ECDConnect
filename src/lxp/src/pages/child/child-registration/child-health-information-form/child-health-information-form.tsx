import {
  Button,
  classNames,
  Divider,
  FormInput,
  renderIcon,
  Typography,
} from '@ecdlink/ui';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, useFormState } from 'react-hook-form';
import {
  ChildHealthInformationFormModel,
  childHealthInformationFormSchema,
} from '@schemas/child/child-registration/child-health-information-form';
import { ChildHealthInformationFormProps } from './child-health-information-form.types';

export const ChildHealthInformationForm: React.FC<
  ChildHealthInformationFormProps
> = ({
  childHealthInformation,
  childName = 'Child',
  onSubmit,
  submitButtonText = 'Next',
  submitButtonIcon = 'ArrowCircleRightIcon',
  canEdit = false,
}) => {
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
    if (isValid && onSubmit) {
      onSubmit(getChildHealthInformationFormValues());
    }
  };

  return (
    <div className={'h-full bg-white px-4 pt-2 pb-4'}>
      <Typography type={'h1'} text={childName} color={'primary'} />
      <Typography type={'h2'} text={'Health information'} color={'textMid'} />
      <div>
        <FormInput<ChildHealthInformationFormModel>
          label={'List any allergies'}
          className={'mt-3'}
          register={childHealthInformationFormRegister}
          nameProp={'allergies'}
          placeholder={'E.g. peanuts'}
          disabled={canEdit}
        />

        <FormInput<ChildHealthInformationFormModel>
          label={'List any disabilities'}
          className={'mt-5'}
          register={childHealthInformationFormRegister}
          nameProp={'disabilities'}
          placeholder={'E.g. blind'}
          disabled={canEdit}
        />

        <FormInput<ChildHealthInformationFormModel>
          label={'List any other health conditions'}
          className={'mt-5'}
          textInputType="textarea"
          register={childHealthInformationFormRegister}
          nameProp={'healthConditions'}
          placeholder={'E.g. chronic illnesses such as diabetes or epilepsy'}
          disabled={canEdit}
        />

        <div className={'py-4'}>
          <Divider></Divider>
        </div>
        <Button
          onClick={handleFormSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
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
    </div>
  );
};
