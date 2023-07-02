import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import {
  CalendarAddEventFormModel,
  CalendarAddEventProps,
  CalendarAddEventFormSchema,
  CalendarAddEventOptions,
  CalendarEditEventOptions,
} from './calendar-add-event.types';
import { useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
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
  StackedList,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { newGuid } from '@/utils/common/uuid.utils';
import DatePicker from 'react-datepicker';
import { calendarSelectors, calendarThunkActions } from '@/store/calendar';
import {
  CalendarEventModel,
  CalendarEventParticipantModel,
  UserDto,
  useDialog,
} from '@ecdlink/core';
import { useAppDispatch } from '@/store';
import { calendarConvert } from '@/store/calendar/calendar.util';
import CalendarSearchParticipant from '../calendar-search-participant/calendar-search-participant';
import * as styles from './calendar-add-event.styles';
import { practitionerSelectors } from '@/store/practitioner';
import { userSelectors } from '@/store/user';
import { ListDataItem } from '../calendar.types';
import {
  mapPractitionerToListDataItem,
  mapUserToListDataItem,
  sortListDataItems,
} from '../calendar.utils';

export const CalendarAddEvent: React.FC<CalendarAddEventProps> = ({
  event: eventProps,
  onUpdated,
  onCancel,
}) => {
  const appDispatch = useAppDispatch();
  const { isOnline } = useOnlineStatus();

  const [searchParticipantsVisible, setSearchParticipantsVisible] =
    useState<boolean>(false);

  const isNewEvent = !eventProps?.id;
  const event: CalendarEventModel = useSelector(
    calendarSelectors.getCalendarEventById(eventProps?.id || '')
  ) || {
    __changed: true,
    id: '',
    allDay: eventProps?.allDay || false,
    description: eventProps?.description || '',
    end: eventProps?.end || '',
    eventType: eventProps?.eventType || '',
    name: eventProps?.name || '',
    start: eventProps?.start || '',
    participants: (eventProps?.participantUserIds || []).map(
      (participantUserId) => ({
        id: newGuid(),
        participantUserId,
      })
    ),
    action: eventProps?.action || null,
  };

  const calendarEventTypes = useSelector(
    calendarSelectors.getCalendarEventTypes
  );

  const currentUser = useSelector(userSelectors.getUser) as UserDto;
  const practitioners = useSelector(practitionerSelectors.getPractitioners);

  const [confirmGoBackPromptVisible, setConfirmGoBackPromptVisible] =
    useState<boolean>(false);
  const [hasChangesOnEvent, setHasChangesOnEvent] = useState<boolean>(false);
  const currentDate = new Date();
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const minDate = !!eventProps?.minDate
    ? new Date(eventProps.minDate)
    : new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
  const maxDate = !!eventProps?.maxDate
    ? new Date(eventProps.maxDate)
    : undefined;
  const defaultValues: CalendarAddEventFormModel = {
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
    participants: event.participants.map((p) => p.participantUserId),
  };
  const {
    setValue: setEventFormValue,
    getValues: getEventFormValues,
    register: eventFormRegister,
    control: eventFormControl,
  } = useForm<CalendarAddEventFormModel>({
    resolver: yupResolver(CalendarAddEventFormSchema),
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

  const handleFormSubmit = async (formValues: CalendarAddEventFormModel) => {
    if (isValid) {
      const id = isNewEvent ? newGuid() : event.id;

      const participants: CalendarEventParticipantModel[] =
        formValues.participants
          .filter((participantUserId) => participantUserId !== currentUser.id)
          .map((participantUserId) => {
            return {
              id:
                event.participants.find(
                  (x) => x.participantUserId === participantUserId
                )?.id || newGuid(),
              participantUserId,
            };
          });

      const model: CalendarEventModel = {
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
        participants: participants,
        action: event.action,
      };
      appDispatch(
        calendarThunkActions.updateCalendarEvent(
          calendarConvert.CalendarEventModel.CalendarEventInput(model)
        )
      );
      if (onUpdated) {
        onUpdated(isNewEvent, model);
      }
    }
  };

  const exitUpdateEvent = () => {
    if (onCancel) {
      if (hasChangesOnEvent) {
        setConfirmGoBackPromptVisible(true);
        setHasChangesOnEvent(false);
      } else {
        onCancel();
      }
    }
  };

  const onSearchParticipantClose = useCallback(() => {
    setSearchParticipantsVisible(false);
  }, []);

  const onSearchParticipantDone = useCallback(
    (participantUserIds: string[]) => {
      setSearchParticipantsVisible(false);
      setEventFormValue('participants', participantUserIds);
    },
    []
  );

  const onAddParticipant = useCallback(() => {
    setSearchParticipantsVisible(true);
  }, []);

  const onRemoveParticipant = useCallback(
    (item: any) => {
      const id = (item as ListDataItem).id as string;
      const list = [...getEventFormValues().participants];
      const index = list.findIndex((x) => x === id);
      if (index !== -1) {
        list.splice(index, 1);
        setEventFormValue('participants', list);
      }
    },
    [getEventFormValues().participants]
  );

  const getParticipantList = useCallback(
    (participantUserIds: string[]): ListDataItem[] => {
      const list: ListDataItem[] = [];
      if (!!practitioners) {
        list.push(
          ...practitioners
            .filter((p) => participantUserIds.includes(p.userId || ''))
            .map((p) => mapPractitionerToListDataItem(p))
        );
        list.forEach((x) => (x.rightIcon = 'XIcon'));
        sortListDataItems(list);
      }
      const cu = mapUserToListDataItem(currentUser);
      cu.noClick = true;
      return [cu, ...list];
    },
    [practitioners, currentUser]
  );

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'white'}
        renderBorder={true}
        title={isNewEvent ? 'Add event' : 'Update event'}
        subTitle={format(startDate, 'EEEE, d LLLL yyyy')}
        color={'primary'}
        onBack={() => exitUpdateEvent()}
        onClose={() => exitUpdateEvent()}
        displayOffline={!isOnline}
      >
        <div className={'px-4 pt-4'}>
          <FormInput<CalendarAddEventFormModel>
            className="mb-4"
            label="Name your event"
            register={eventFormRegister}
            nameProp={'name'}
            maxLength={50}
            placeholder="Name your event"
          />
          <Dropdown
            className="mb-4"
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
          <div className="text-md text-textDark mb-4 block font-semibold">
            <Checkbox<CalendarAddEventFormModel>
              register={eventFormRegister}
              nameProp="allDay"
              className="flex-1"
              description="All day"
            />
          </div>
          <div className="mb-4">
            <label className="text-md text-textDark mb-1 block font-semibold">
              {`Start date${getEventFormValues().allDay ? '' : ' and time'}`}
            </label>
            <DatePicker
              className="bg-uiBg text-textMid mx-auto w-full rounded-md border-none"
              wrapperClassName="text-center"
              selected={getEventFormValues().start}
              onChange={(date: Date) => setEventFormValue('start', date)}
              dateFormat={
                getEventFormValues().allDay
                  ? 'EEE, dd MMM yyyy'
                  : 'EEE, dd MMM yyyy  HH:mm'
              }
              minDate={minDate}
              maxDate={getEventFormValues().end}
              showTimeInput={!getEventFormValues().allDay}
            />
          </div>
          <div className="mb-4">
            <label className="text-md text-textDark block font-semibold">
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
              maxDate={maxDate}
              showTimeInput={!getEventFormValues().allDay}
            />
          </div>
          <div className="mb-4">
            <StackedList
              className={styles.stackedList}
              listItems={getParticipantList(getEventFormValues().participants)}
              type={'UserAlertList'}
              onClickItem={onRemoveParticipant}
            />
            <Button
              size="small"
              type="filled"
              color="primary"
              className={`mx-auto w-4/12 rounded-xl`}
              onClick={onAddParticipant}
            >
              {renderIcon('PlusIcon', 'h-4 w-4 text-white mr-1')}
              <Typography
                type="buttonSmall"
                color="white"
                text={'Add participants'}
                className={'w-full whitespace-nowrap'}
              />
            </Button>
          </div>
          <FormInput<CalendarAddEventFormModel>
            label={'Describe the event'}
            subLabel="Optional"
            className={'mb-4'}
            textInputType="textarea"
            register={eventFormRegister}
            nameProp={'description'}
            placeholder={'Describe the event...'}
          />
          <div>
            <Button
              onClick={() => handleFormSubmit(getEventFormValues())}
              className="w-full"
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
      <Dialog
        visible={searchParticipantsVisible}
        position={DialogPosition.Full}
      >
        <CalendarSearchParticipant
          currentParticipantUserIds={getEventFormValues().participants}
          onBack={onSearchParticipantClose}
          onDone={onSearchParticipantDone}
        />
      </Dialog>
    </>
  );
};

export const useCalendarAddEvent = (): ((
  options: CalendarAddEventOptions
) => void) => {
  const dialog = useDialog();
  return (options: CalendarAddEventOptions) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit: () => void, onCancel: () => void) => {
        return (
          <CalendarAddEvent
            event={options.event}
            onUpdated={(isNew: boolean, event: CalendarEventModel) => {
              if (!!options.onUpdated) options.onUpdated(isNew, event);
              onSubmit();
            }}
            onCancel={() => {
              if (!!options.onCancel) options.onCancel();
              onCancel();
            }}
          />
        );
      },
    });
  };
};

export const useCalendarEditEvent = (): ((
  options: CalendarEditEventOptions
) => void) => {
  const dialog = useDialog();
  return (options: CalendarEditEventOptions) => {
    dialog({
      position: DialogPosition.Full,
      render: (onSubmit: () => void, onCancel: () => void) => {
        return (
          <CalendarAddEvent
            event={options.event}
            onUpdated={(isNew: boolean, event: CalendarEventModel) => {
              if (!!options.onUpdated) options.onUpdated(event);
              onSubmit();
            }}
            onCancel={() => {
              if (!!options.onCancel) options.onCancel();
              onCancel();
            }}
          />
        );
      },
    });
  };
};

export default CalendarAddEvent;
