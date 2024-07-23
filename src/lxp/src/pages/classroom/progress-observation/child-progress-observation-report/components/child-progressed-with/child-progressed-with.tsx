import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Divider,
  FormInput,
  Typography,
  renderIcon,
} from '@ecdlink/ui';
import { useForm, useFormState } from 'react-hook-form';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import {
  ChildProgressedWithFormModel,
  childProgressedWithFormSchema,
} from '@schemas/classroom/child-progress-observations/child-progressed-with-form';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ChildProgressedWithProps } from './child-progressed-with.types';

export const ChildProgressedWith: React.FC<ChildProgressedWithProps> = ({
  childId,
  onSubmit,
}) => {
  const { currentReport } = useChildProgressObservation(childId);

  const child = useSelector(childrenSelectors.getChildById(childId));

  const {
    getValues: getFormValue,
    setValue: setFormValue,
    register: formRegister,
    control: formControl,
  } = useForm<ChildProgressedWithFormModel>({
    resolver: yupResolver(childProgressedWithFormSchema),
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: formControl });

  const handleFormSubmit = (
    formValue: ChildProgressedWithFormModel,
    exit: boolean
  ) => {
    onSubmit(formValue, exit);
  };

  useEffect(() => {
    if (currentReport && currentReport.childProgressedWith) {
      setFormValue('childProgressedWith', currentReport.childProgressedWith, {
        shouldValidate: true,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  return (
    <div className={'flex h-full w-full flex-col px-4'}>
      <Typography
        type={'h2'}
        color={'textDark'}
        text={'Share more detail for the caregiver report'}
        className="mb-4"
      />
      <FormInput
        type={'text'}
        textInputType={'textarea'}
        register={formRegister}
        nameProp={'childProgressedWith'}
        label={`${child?.user?.firstName} has made good progress with:`}
        placeholder={`E.g. Sharing his emotions. He can talk about how he is feeling.`}
      />
      {currentReport && currentReport.observationNote && (
        <div className="mt-4">
          <Divider dividerType="dashed" className="mb-4" />
          <Typography
            type={'h4'}
            weight={'semibold'}
            color={'textDark'}
            text={'Your observation notes'}
            className="mb-2"
          />
          <Typography
            type={'body'}
            color={'textMid'}
            text={currentReport?.observationNote || ''}
          />
        </div>
      )}
      <Button
        onClick={() => {
          handleFormSubmit(getFormValue(), false);
        }}
        className="mt-4 w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', 'h-5 w-5 text-white')}
        <Typography type="h6" className="ml-2" text="Next" color="white" />
      </Button>
      <Button
        onClick={() => {
          handleFormSubmit(getFormValue(), true);
        }}
        className="mt-4 w-full"
        size="small"
        color="primary"
        type="outlined"
        disabled={false}
      >
        {renderIcon('XIcon', 'h-5 w-5 text-primary')}
        <Typography
          type="h6"
          className="ml-2"
          text="Save & exit"
          color="primary"
        />
      </Button>
    </div>
  );
};
