import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  UpdateEventFormModel,
  UpdateEventProps,
  defaultUpdateEventFormSchema,
  updateEventFormSchema,
} from './update-event.types';
import { useSelector } from 'react-redux';
import { authSelectors } from '@/store/auth';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Dialog,
  DialogPosition,
  Divider,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { newGuid } from '@/utils/common/uuid.utils';
import DatePicker from 'react-datepicker';

export const UpdateEvent: React.FC<UpdateEventProps> = ({
  event,
  onUpdated,
  onBack,
}) => {
  const user = useSelector(authSelectors.getAuthUser);
  const { isOnline } = useOnlineStatus();

  const isNewEvent = !event.id;

  //const appDispatch = useAppDispatch();

  const [confirmGoBackPromptVisible, setConfirmGoBackPromptVisible] =
    useState<boolean>(false);
  const [hasChangesOnEvent, setHasChangesOnEvent] = useState<boolean>(false);
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const {
    setValue: setEventFormValue,
    getValues: getEventFormValues,
    register: eventFormRegister,
    control: eventFormControl,
  } = useForm<UpdateEventFormModel>({
    resolver: yupResolver(updateEventFormSchema),
    mode: 'onChange',
    defaultValues: {
      title: event.title || '',
      start: event.isAllday
        ? new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            12,
            0,
            0,
            0
          )
        : startDate,
      end: event.isAllday
        ? new Date(
            endDate.getFullYear(),
            endDate.getMonth(),
            endDate.getDate(),
            12,
            0,
            0,
            0
          )
        : endDate,
      isAllday: event.isAllday,
      body: event.body || '',
    },
  });

  const { isValid } = useFormState({
    control: eventFormControl,
  });

  const watchValues = useWatch({
    control: eventFormControl,
    defaultValue: defaultUpdateEventFormSchema,
  });

  useEffect(() => {
    if (watchValues.title && watchValues.title.length > 0) {
      setHasChangesOnEvent(true);
    } else {
      setHasChangesOnEvent(false);
    }
  }, [watchValues.title]);

  const handleFormSubmit = async (formValues: UpdateEventFormModel) => {
    if (isValid) {
      // const typeId = await getNoteTypeIdByEnum(noteType);
      // const newNoteToSave: NoteDto = {
      //   id: newGuid(),
      //   isActive: true,
      //   name: formValues.title,
      //   bodyText: formValues.body,
      //   userId: userId,
      //   noteTypeId: typeId ?? '',
      //   createdUserId: user?.id ?? '',
      //   insertedDate: new Date().toISOString(),
      // };

      // appDispatch(notesActions.createNote(newNoteToSave));

      if (onUpdated) {
        onUpdated(!isNewEvent, {
          id: isNewEvent ? newGuid() : event.id,
          start: formValues.isAllday
            ? new Date(formValues.start.setHours(12, 0, 0, 0)).toISOString()
            : formValues.start.toISOString(),
          end: formValues.isAllday
            ? new Date(formValues.end.setHours(12, 0, 0, 0)).toISOString()
            : formValues.end.toISOString(),
          isAllday: formValues.isAllday,
          category: formValues.isAllday ? 'allday' : 'time',
          title: formValues.title,
          body: formValues.body,
          calendarId: '1',
          backgroundColor: '#1a80b7',
          color: '#ffffff',
        });
      }
    }
  };

  const exitUpdateEvent = () => {
    if (onBack) {
      if (hasChangesOnEvent) {
        setConfirmGoBackPromptVisible(true);
        setHasChangesOnEvent(false);
      } else {
        onBack();
      }
    }
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'white'}
        renderBorder={true}
        title={'Add Event'}
        subTitle={format(startDate, 'EEEE, d LLLL yyyy')}
        color={'primary'}
        onBack={() => exitUpdateEvent()}
        onClose={() => exitUpdateEvent()}
        displayOffline={!isOnline}
      >
        <Typography
          type={'h2'}
          text={isNewEvent ? 'New event' : 'Update event'}
          color={'textDark'}
          className={'px-4 pt-1'}
        />
        <div className={'px-4 pt-4'}>
          <FormInput<UpdateEventFormModel>
            label="Name your event"
            register={eventFormRegister}
            nameProp={'title'}
            maxLength={50}
            placeholder="Name your event"
          />
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            Start date
          </label>
          <DatePicker
            wrapperClassName="text-center"
            className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
            selected={watchValues.start}
            onChange={(date: Date) => setEventFormValue('start', date)}
            dateFormat="EEE, dd MMM yyyy"
            maxDate={watchValues.end}
          />
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            End date
          </label>
          <DatePicker
            wrapperClassName="text-center"
            className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
            selected={watchValues.end}
            onChange={(date: Date) => setEventFormValue('end', date)}
            dateFormat="EEE, dd MMM yyyy"
            minDate={watchValues.start}
          />
          <FormInput<UpdateEventFormModel>
            label={'Describe the event'}
            className={'mt-3'}
            textInputType="textarea"
            register={eventFormRegister}
            nameProp={'body'}
            placeholder={'Describe the event...'}
          />
          <Button
            onClick={() => handleFormSubmit(getEventFormValues())}
            className="mt-4 w-full"
            size="small"
            color="primary"
            type="filled"
            disabled={!isValid}
          >
            {renderIcon('CheckCircleIcon', classNames('h-5 w-5 text-white'))}
            <Typography
              type="h6"
              className="ml-2"
              text={isNewEvent ? 'Create event' : 'Update event'}
              color="white"
            />
          </Button>
        </div>
      </BannerWrapper>

      <Dialog
        className={'mb-16 px-4'}
        stretch={true}
        visible={confirmGoBackPromptVisible}
        position={DialogPosition.Middle}
      >
        <ActionModal
          icon={'InformationCircleIcon'}
          iconColor="alertMain"
          iconBorderColor="alertBg"
          importantText={`You have unsaved changes?`}
          detailText={'If you exit now your changes will not be saved.'}
          actionButtons={[
            {
              text: 'Save event',
              textColour: 'white',
              colour: 'primary',
              type: 'filled',
              onClick: () => handleFormSubmit(getEventFormValues()),
              leadingIcon: 'SaveIcon',
            },
            {
              text: 'Exit',
              textColour: 'primary',
              colour: 'primary',
              type: 'outlined',
              onClick: () => exitUpdateEvent(),
              leadingIcon: 'LogoutIcon',
            },
          ]}
        />
      </Dialog>
    </>
  );
};

export default UpdateEvent;
