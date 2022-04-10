import { yupResolver } from '@hookform/resolvers/yup';
import { Button, Card, Divider, FormInput, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { getYear } from 'date-fns';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import { childrenSelectors } from '../../../../../../store/children';
import {
  ChildEnjoysFormModel,
  childEnjoysFormSchema,
} from '@schemas/classroom/child-progress-observations/child-enjoys-form';
import { ChildEnjoysProps } from './child-enjoys.types';

export const ChildEnjoys: React.FC<ChildEnjoysProps> = ({ childId, onSubmit }) => {
  const { currentReport, previousReport } = useChildProgressObservation(childId);
  const child = useSelector(childrenSelectors.getChildById(childId));
  const childUser = useSelector(childrenSelectors.getChildUserById(child?.userId));

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

  const handleFormSubmit = (formValue: ChildEnjoysFormModel) => {
    onSubmit(formValue);
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
        type={'h1'}
        color={'primary'}
        text={'Share more detail for the caregiver report'}
      />
      <FormInput
        type={'text'}
        textInputType={'textarea'}
        register={formRegister}
        nameProp={'childEnjoys'}
        label={`${childUser?.firstName} enjoys:`}
        placeholder={`E.g. Playing with balls. Soccer is their favourite. They are active. They like playing with other children.`}
      />

      {currentReport && currentReport.observationNote && (
        <Card shadowSize="lg" borderRaduis={'lg'} className={'p-4 mt-4'}>
          <Typography
            type={'body'}
            weight={'bolder'}
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
            weight={'bolder'}
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
