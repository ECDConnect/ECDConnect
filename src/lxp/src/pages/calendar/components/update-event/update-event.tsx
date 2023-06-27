import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  UpdateEventFormModel,
  UpdateEventProps,
  defaultUpdateEventFormSchema,
  updateEventFormSchema,
} from './update-event.types';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useForm, useFormState, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ActionModal,
  BannerWrapper,
  Button,
  Checkbox,
  Dialog,
  DialogPosition,
  Dropdown,
  FormInput,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { newGuid } from '@/utils/common/uuid.utils';
import DatePicker from 'react-datepicker';
import {
  calendarActions,
  calendarSelectors,
  calendarThunkActions,
} from '@/store/calendar';
import { CalendarEventModel } from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { calendarConvert } from '@/store/calendar/calendar.util';

export const UpdateEvent: React.FC<UpdateEventProps> = ({
  event: eventProps,
  onUpdated,
  onBack,
}) => {
  //const user = useSelector(authSelectors.getAuthUser);
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const isNewEvent = !eventProps?.id;
  const event: CalendarEventModel = useSelector(
    calendarSelectors.getCalendarEventById(eventProps?.id || '')
  ) || {
    __changed: true,
    id: '',
    allDay: eventProps?.allDay || false,
    description: '',
    end: eventProps?.end || '',
    eventType: '',
    name: '',
    start: eventProps?.start || '',
    participants: [],
  };

  //const appDispatch = useAppDispatch();

  const calendarEventTypes = useSelector(
    calendarSelectors.getCalendarEventTypes
  );

  const [confirmGoBackPromptVisible, setConfirmGoBackPromptVisible] =
    useState<boolean>(false);
  const [hasChangesOnEvent, setHasChangesOnEvent] = useState<boolean>(false);
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const defaultValues: UpdateEventFormModel = {
    name: event.name || '',
    start: event.allDay
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
    end: event.allDay
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
    allDay: event.allDay,
    description: event.description || '',
    eventType: !event.eventType ? undefined : event.eventType,
  };
  const {
    setValue: setEventFormValue,
    getValues: getEventFormValues,
    register: eventFormRegister,
    control: eventFormControl,
  } = useForm<UpdateEventFormModel>({
    resolver: yupResolver(updateEventFormSchema),
    mode: 'onChange',
    defaultValues: defaultValues,
  });

  const { isValid } = useFormState({
    control: eventFormControl,
  });

  const watchValues = useWatch({
    control: eventFormControl,
    defaultValue: defaultValues,
  });

  useEffect(() => {
    if (JSON.stringify(defaultValues) !== JSON.stringify(watchValues)) {
      setHasChangesOnEvent(true);
    } else {
      setHasChangesOnEvent(false);
    }
  }, [watchValues]);

  const handleFormSubmit = async (formValues: UpdateEventFormModel) => {
    if (isValid) {
      const id = isNewEvent ? newGuid() : event.id;
      appDispatch(
        calendarThunkActions.updateCalendarEvent(
          calendarConvert.CalendarEventModel.CalendarEventInput({
            __changed: true,
            id: id,
            allDay: formValues.allDay,
            description: formValues.description,
            end: formValues.allDay
              ? new Date(formValues.end.setHours(12, 0, 0, 0)).toISOString()
              : formValues.end.toISOString(),
            eventType: formValues.eventType || '',
            name: formValues.name,
            start: formValues.allDay
              ? new Date(formValues.start.setHours(12, 0, 0, 0)).toISOString()
              : formValues.start.toISOString(),
            participants: [],
          })
        )
      );
      if (onUpdated) {
        onUpdated(!isNewEvent, id);
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
            nameProp={'name'}
            maxLength={50}
            placeholder="Name your event"
          />
          <Dropdown
            placeholder={'Tap to choose event type'}
            list={calendarEventTypes.map((et) => ({
              label: et.name,
              value: et.name,
            }))}
            fillType="clear"
            fullWidth={true}
            label={'Choose event type'}
            selectedValue={getEventFormValues().eventType}
            onChange={(item: string) => {
              setEventFormValue('eventType', item);
            }}
          />
          <div className="text-md text-textDark mt-4 mb-1 block font-semibold">
            <Checkbox<UpdateEventFormModel>
              register={eventFormRegister}
              nameProp="allDay"
              className="flex-1"
              description="All day"
            />
          </div>
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            {`Start date${getEventFormValues().allDay ? '' : ' and time'}`}
          </label>
          <DatePicker
            wrapperClassName="text-center"
            className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
            selected={getEventFormValues().start}
            onChange={(date: Date) => setEventFormValue('start', date)}
            dateFormat={
              getEventFormValues().allDay
                ? 'EEE, dd MMM yyyy'
                : 'EEE, dd MMM yyyy  HH:mm'
            }
            maxDate={getEventFormValues().end}
            showTimeInput={!getEventFormValues().allDay}
          />
          <label className="text-md text-textDark mt-2 mb-1 block font-semibold">
            {`End date${getEventFormValues().allDay ? '' : ' and time'}`}
          </label>
          <DatePicker
            wrapperClassName="text-center"
            className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
            selected={getEventFormValues().end}
            onChange={(date: Date) => setEventFormValue('end', date)}
            dateFormat={
              getEventFormValues().allDay
                ? 'EEE, dd MMM yyyy'
                : 'EEE, dd MMM yyyy  HH:mm'
            }
            minDate={getEventFormValues().start}
            showTimeInput={!getEventFormValues().allDay}
          />
          <Button
            size="small"
            type="filled"
            color="primary"
            className={`mx-auto mt-4 w-4/12 rounded-xl`}
            onClick={() => {}}
            disabled
          >
            {renderIcon('PlusIcon', 'h-4 w-4 text-white mr-1')}
            <Typography
              type="buttonSmall"
              color="white"
              text={'Add participants'}
              className={'w-full whitespace-nowrap'}
            ></Typography>
          </Button>
          <FormInput<UpdateEventFormModel>
            label={'Describe the event'}
            subLabel="Optional"
            className={'mt-3'}
            textInputType="textarea"
            register={eventFormRegister}
            nameProp={'description'}
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
