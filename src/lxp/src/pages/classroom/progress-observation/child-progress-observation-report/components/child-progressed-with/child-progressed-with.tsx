import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Divider, FormInput, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { getYear } from 'date-fns';
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
  const { currentReport, previousReport } =
    useChildProgressObservation(childId);

  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(
    childrenSelectors.getChildUserById(child?.userId)
  );

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

  const handleFormSubmit = (formValue: ChildProgressedWithFormModel) => {
    onSubmit(formValue);
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
        type={'h1'}
        color={'primary'}
        text={'Share more detail for the caregiver report'}
      />
      <FormInput
        type={'text'}
        textInputType={'textarea'}
        register={formRegister}
        nameProp={'childProgressedWith'}
        label={`${childUser?.firstName} has made good progress with:`}
        placeholder={`E.g. Sharing their emotions. They can talk about how they are feeling.`}
      />

      {currentReport && currentReport.observationNote && (
        <Card shadowSize="lg" borderRaduis={'lg'} className={'p-4 mt-4'}>
          <Typography
            type={'body'}
            weight={'bold'}
            color={'black'}
            text={'Your observation notes'}
          />
          {previousReport && currentReport && (
            <Typography
              type={'help'}
              weight={'skinny'}
              color={'textLight'}
              text={`${currentReport.reportingPeriod} report (This report)`}
            />
          )}
          <Typography
            type={'body'}
            weight={'skinny'}
            color={'black'}
            text={currentReport?.observationNote || ''}
          />
        </Card>
      )}

      {previousReport && previousReport.observationNote && (
        <Card shadowSize="lg" borderRaduis={'lg'} className={'my-4 p-4'}>
          <Typography
            type={'body'}
            weight={'bold'}
            color={'black'}
            text={'Your previous answer'}
          />
          <Typography
            type={'help'}
            weight={'skinny'}
            color={'textLight'}
            text={`${previousReport.reportingPeriod} ${
              previousReport.reportingDate
                ? `${getYear(new Date(previousReport.reportingDate))}`
                : ''
            } report`}
          />
          <Typography
            type={'body'}
            weight={'skinny'}
            color={'black'}
            text={previousReport.observationNote || ''}
          />
        </Card>
      )}

      <Divider className={'my-4'} />

      <Button
        onClick={() => {
          handleFormSubmit(getFormValue());
        }}
        className="w-full"
        size="small"
        color="primary"
        type="filled"
        disabled={!isValid}
      >
        {renderIcon('ArrowCircleRightIcon', 'h-5 w-5 text-white')}
        <Typography type="h6" className="ml-2" text="Next" color="white" />
      </Button>
    </div>
  );
};
