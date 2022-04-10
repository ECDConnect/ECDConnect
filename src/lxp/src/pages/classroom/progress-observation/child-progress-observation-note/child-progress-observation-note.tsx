import { yupResolver } from '@hookform/resolvers/yup';
import { BannerWrapper, Button, Divider, FormInput, Typography } from '@ecdlink/ui';
import { renderIcon } from '@ecdlink/ui';
import { useEffect } from 'react';
import { useForm, useFormState } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router';
import { useChildProgressObservation } from '@hooks/useChildProgressObservations';
import {
  childProgressObservationNoteFormSchema,
  ChildProgressObservationNoteModel,
} from '@schemas/classroom/child-progress-observations/child-progress-observation-note';
import { childrenSelectors } from '@store/children';
import { ChildProgressObservationNoteState } from './child-progress-observation-note.types';

export const ChildProgressObservationNote: React.FC = () => {
  const history = useHistory();
  const { state: routeState } = useLocation<ChildProgressObservationNoteState>();
  const currentChild = useSelector(childrenSelectors.getChildById(routeState.childId));
  const currentChildUser = useSelector(childrenSelectors.getChildUserById(currentChild?.userId));
  const { currentReport, setObservationNote } = useChildProgressObservation(routeState.childId);

  const { getValues, register, control, setValue } = useForm<ChildProgressObservationNoteModel>({
    resolver: yupResolver(childProgressObservationNoteFormSchema),
    mode: 'onChange',
    defaultValues: { note: currentReport?.observationNote },
  });

  const { isValid } = useFormState({
    control: control,
  });

  const handleSubmit = () => {
    const formValue = getValues();
    setObservationNote(formValue.note);
    history.goBack();
  };

  useEffect(() => {
    if (currentReport) {
      setValue('note', currentReport.observationNote || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentReport]);

  return (
    <BannerWrapper
      size={'small'}
      onBack={() => history.goBack()}
      title={`Add a note about ${currentChildUser?.firstName}`}
      data-testId={'child-progress-observation-banner-wrapper'}
      renderOverflow
    >
      <div className={'bg-uiBg pt-2 px-4'}>
        <Typography type={'h1'} text={`Your notes`} color={'primary'} />
        <Typography
          type={'body'}
          text={`Fill in any observations or notes about ${currentChildUser?.firstName}.`}
          color={'textMid'}
        />
        <Typography
          type={'help'}
          className={'mt-1'}
          text={`These notes will not be shared with ${currentChildUser?.firstName}’s caregiver.`}
          color={'textLight'}
        />
        <FormInput<ChildProgressObservationNoteModel>
          textInputType="textarea"
          value={currentReport?.observationNote}
          placeholder={`E.g. ${currentChildUser?.firstName}’s mother shared some information about their health.`}
          register={register}
          nameProp={'note'}
        />

        <Divider className={'my-4'} />

        <Button
          onClick={handleSubmit}
          className="w-full"
          size="small"
          color="primary"
          type="filled"
          disabled={!isValid}
        >
          {renderIcon('SaveIcon', 'h-5 w-5 text-white')}
          <Typography type="h6" className="ml-2" text="Save" color="white" />
        </Button>
      </div>
    </BannerWrapper>
  );
};
