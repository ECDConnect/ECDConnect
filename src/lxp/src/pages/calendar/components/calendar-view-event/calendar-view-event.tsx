import { CalendarEventModel, useDialog } from '@ecdlink/core';
import {
  CalendarViewEventOptions,
  CalendarViewEventProps,
} from './calendar-view-event.types';
import {
  ActionModal,
  BannerWrapper,
  Button,
  DialogPosition,
  Typography,
  classNames,
  renderIcon,
} from '@ecdlink/ui';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';
import { calendarSelectors } from '@/store/calendar';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { userSelectors } from '@/store/user';
import { useHistory } from 'react-router-dom';
import { useCalendarEditEvent } from '../calendar-add-event/calendar-add-event';
import { getEventAction } from '../calendar.utils';

export const CalendarViewEvent: React.FC<CalendarViewEventProps> = (props) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const dialog = useDialog();
  const calendarEditEvent = useCalendarEditEvent();

  const eventById = useSelector(
    calendarSelectors.getCalendarEventById(
      typeof props.event === 'string' ? props.event : ''
    )
  );
  const event = !!eventById ? eventById : (props.event as CalendarEventModel);
  const eventAction = getEventAction(event);
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const user = useSelector(userSelectors.getUser);
  const canEdit = !!props.canEdit ? props.canEdit : user?.id === event.userId;
  const canAction = user?.id === event.userId;
  const isVisitDone = event?.visit?.attended;

  const displayCannotStartVisit = () => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: any, onCancel: any) => (
        <ActionModal
          icon="ExclamationCircleIcon"
          importantText={`You cannot start this visit`}
          detailText={`This visit has been completed or the start date has not arrived yet. Please go to the SmartStarter's journey to see which visit to complete next.`}
          actionButtons={[
            {
              text: 'Close',
              textColour: 'primary',
              colour: 'white',
              type: 'outlined',
              onClick: () => {
                onSubmit();
              },
              leadingIcon: 'XIcon',
            },
          ]}
        />
      ),
    });
  };

  const onEdit = () => {
    props.onClose();
    calendarEditEvent({
      hideAddParticipantsButton: props.hideAddParticipantsButton,
      eventTypeDisabled: props.eventTypeDisabled,
      event: { id: event.id },
    });
  };

  const onAction = () => {
    props.onClose();
    if (isVisitDone) {
      displayCannotStartVisit();
      return;
    }
    if (!!eventAction) {
      history.push(eventAction.url, eventAction.state);
    }
  };

  return (
    <BannerWrapper
      size={'small'}
      backgroundColour={'white'}
      renderBorder={true}
      title={'View event'}
      subTitle={format(startDate, 'EEEE, d LLLL yyyy')}
      color={'primary'}
      onClose={() => {
        props.onClose();
      }}
      displayOffline={!isOnline}
    >
      <div className={'flex flex-col'}>
        <div className="bg-uiBg flex flex-row">
          <div className="w-8/12">
            <Typography
              type="h3"
              color="textDark"
              text={event.name}
              weight="bold"
              className="px-4 pt-4 pb-4"
            />
          </div>
          {!!canEdit && (
            <div className="mt-2 w-4/12 text-right">
              <Button
                onClick={() => onEdit()}
                className="mr-4 w-20"
                size="small"
                color="primary"
                type="outlined"
              >
                {renderIcon('PencilIcon', classNames('h-4 w-4 text-primary'))}
                <Typography
                  type="h6"
                  className="ml-2"
                  text={'Edit'}
                  color="primary"
                />
              </Button>
            </div>
          )}
        </div>
        <div className="flex flex-row px-4 pt-4 pb-4">
          <div className="w-10">
            {renderIcon('CalendarIcon', 'mt-1 h-5 w-5 text-textDark mr-4')}
          </div>
          <div>
            <Typography
              type="body"
              color="textDark"
              text={format(startDate, 'EEEE, d LLLL yyyy')}
              className=""
            />
          </div>
        </div>
        {!event.allDay && (
          <div className="flex flex-row px-4 pb-4">
            <div className="w-10">
              {renderIcon('ClockIcon', 'mt-1 h-5 w-5 text-textDark mr-4')}
            </div>
            <div>
              <Typography
                type="body"
                color="textDark"
                text={`${format(startDate, 'h:mm')} - ${format(
                  endDate,
                  'h:mm aa'
                )}`}
                className=""
              />
            </div>
          </div>
        )}
        {!!event.eventType && (
          <div className="flex flex-row px-4 pb-4">
            <div className="w-10">
              {renderIcon('TagIcon', 'mt-1 h-5 w-5 text-textDark mr-4')}
            </div>
            <div>
              <Typography
                type="body"
                color="textDark"
                text={event.eventType}
                className=""
              />
            </div>
          </div>
        )}
        <div className="flex flex-row px-4 pb-4">
          <div className="w-10">
            {renderIcon('UserGroupIcon', 'mt-1 h-5 w-5 text-textDark mr-4')}
          </div>
          <div>
            <Typography
              type="body"
              color="textDark"
              text={`${event.participants.length + 1} participants`}
              className=""
            />
          </div>
        </div>
        <div className="flex flex-row px-4 pb-2">
          <div className="w-10">
            {renderIcon('UserIcon', 'mt-1 h-4 w-4 text-textDark mr-4')}
          </div>
          <div>
            <Typography
              type="small"
              color="textDark"
              text={`${event.user.firstName} ${event.user.surname} ${
                event.userId !== user?.id ? '(Organiser)' : '(You, Organiser)'
              }`}
              className=""
            />
          </div>
        </div>
        {event.participants.map((p, index) => (
          <div key={`participant-${index}`} className="flex flex-row px-4 pb-2">
            <div className="w-10">
              {renderIcon('UserIcon', 'mt-1 h-4 w-4 text-textDark mr-4')}
            </div>
            <div>
              <Typography
                type="small"
                color="textDark"
                text={`${p.participantUser.firstName} ${
                  p.participantUser.surname
                } ${p.participantUserId === user?.id ? '(You)' : ''}`}
                className=""
              />
            </div>
          </div>
        ))}
        <div className="flex flex-row px-4 pt-2 pb-4">
          <div className="w-10">
            {renderIcon('ClipboardListIcon', 'mt-1 h-5 w-5 text-textDark mr-4')}
          </div>
          <div>
            <Typography
              type="body"
              color="textDark"
              text={event.description}
              className=""
            />
          </div>
        </div>
        {canAction && !!eventAction && !!eventAction.url && (
          <div className="px-4 pb-4">
            <Button
              onClick={() => onAction()}
              className="w-full"
              size="small"
              color="primary"
              type="filled"
            >
              {renderIcon(
                eventAction.buttonIcon || 'ArrowCircleRightIcon',
                classNames('h-5 w-5 text-white')
              )}
              <Typography
                type="h6"
                className="ml-2"
                text={eventAction.buttonName || 'Go'}
                color="white"
              />
            </Button>
          </div>
        )}
        {props.actionButton?.name && (
          <div className="mx-4 border-t py-4">
            <Button
              onClick={() => {
                props?.actionButton?.onClick();
                props.onClose();
              }}
              className="w-full"
              size="small"
              textColor="white"
              icon={props.actionButton.icon}
              color="primary"
              type="filled"
              text={props.actionButton.name}
            />
          </div>
        )}
      </div>
    </BannerWrapper>
  );
};

export const useCalendarViewEvent = (): ((
  options: CalendarViewEventOptions
) => void) => {
  const dialog = useDialog();
  return (options: CalendarViewEventOptions) => {
    dialog({
      position: DialogPosition.Middle,
      render: (onSubmit: () => void, onCancel: () => void) => {
        return (
          <CalendarViewEvent
            canEdit={options.canEdit}
            event={options.event}
            actionButton={options.actionButton}
            eventTypeDisabled={options.eventTypeDisabled}
            hideAddParticipantsButton={options.hideAddParticipantsButton}
            onClose={() => {
              onCancel();
            }}
          />
        );
      },
    });
  };
};
