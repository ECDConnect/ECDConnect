import { CalendarEventModel, useDialog } from '@ecdlink/core';
import {
  CalendarViewEventOptions,
  CalendarViewEventProps,
} from './calendar-view-event.types';
import {
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

export const CalendarViewEvent: React.FC<CalendarViewEventProps> = (props) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const calendarEditEvent = useCalendarEditEvent();

  const eventById = useSelector(
    calendarSelectors.getCalendarEventById(
      typeof props.event === 'string' ? props.event : ''
    )
  );
  const event = !!eventById ? eventById : (props.event as CalendarEventModel);
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const user = useSelector(userSelectors.getUser);
  const canEdit = !!props.canEdit ? props.canEdit : user?.id === event.userId;
  const canAction = user?.id === event.userId;

  const onEdit = () => {
    props.onClose();
    calendarEditEvent({
      event: { id: event.id },
    });
  };

  const onAction = () => {
    props.onClose();
    if (!!event.action) {
      history.push(event.action.url, event.action.state);
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
        {canAction && !!event.action && !!event.action.url && (
          <div className="px-4 pb-4">
            <Button
              onClick={() => onAction()}
              className="w-full"
              size="small"
              color="primary"
              type="filled"
            >
              {renderIcon(
                event.action.buttonIcon || 'ArrowCircleRightIcon',
                classNames('h-5 w-5 text-white')
              )}
              <Typography
                type="h6"
                className="ml-2"
                text={event.action.buttonName || 'Go'}
                color="white"
              />
            </Button>
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
            onClose={() => {
              onCancel();
            }}
          />
        );
      },
    });
  };
};
