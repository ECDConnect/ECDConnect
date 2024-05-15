import { yupResolver } from '@hookform/resolvers/yup';
import { Button, FormInput, Typography, renderIcon } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '@store/children';
import {
  ChildEnjoysFormModel,
  childEnjoysFormSchema,
} from '@schemas/classroom/child-progress-observations/child-enjoys-form';
import { ChildEnjoysProps } from './child-enjoys.types';

export const ChildEnjoys: React.FC<ChildEnjoysProps> = ({
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
  } = useForm<ChildEnjoysFormModel>({
    resolver: yupResolver(childEnjoysFormSchema),
    mode: 'onChange',
  });

  const { isValid } = useFormState({ control: formControl });

  const handleFormSubmit = (formValue: ChildEnjoysFormModel, exit: boolean) => {
    onSubmit(formValue, exit);
  };

  useEffect(() => {
    if (currentReport && currentReport.childEnjoys) {
      setFormValue('childEnjoys', currentReport.childEnjoys, {
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
        nameProp={'childEnjoys'}
        label={`${child?.user?.firstName} enjoys:`}
        placeholder={`E.g. Playing with balls. Soccer is his favourite. He is active. He likes playing with other children.`}
      />
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
