import {
  CalendarEventModel,
  CalendarEventParticipantModel,
  useDialog,
} from '@ecdlink/core';
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
import { EventType } from '../calendar.types';
import { useMemo, useState } from 'react';
import { motherSelectors } from '@/store/mother';
import { infantSelectors } from '@/store/infant';
import { mapIdsToCalendarEventParticipants } from '../calendar.utils';
import { startVisit } from '@/pages/client/visits-tab/start-visit/start-visit.utils';
import { StartVisitClientType } from '@/pages/client/visits-tab/start-visit/start-visit.types';
import { useAppDispatch } from '@/store';
import { HomeVisitPrompt } from './popups/home-visit-prompt';
import { HomeVisitMultipleClientsPrompt } from './popups/home-visit-multiple-clients-prompt';
import { AddBreastFeedingClubRouteState } from '@/pages/community/breastfeeding-clubs-tab/add-breastfeeding-club/types';
import ROUTES from '@/routes/routes';

export const CalendarViewEvent: React.FC<CalendarViewEventProps> = (props) => {
  const { isOnline } = useOnlineStatus();
  const history = useHistory();
  const appDispatch = useAppDispatch();
  const calendarEditEvent = useCalendarEditEvent();

  const eventById = useSelector(
    calendarSelectors.getCalendarEventById(
      typeof props.event === 'string' ? props.event : ''
    )
  );
  const event = !!eventById ? eventById : (props.event as CalendarEventModel);
  const eventType = event.eventType as EventType;
  const startDate = new Date(event.start);
  const endDate = new Date(event.end);
  const user = useSelector(userSelectors.getUser);
  const eventOwner = user?.id === event.userId;
  const canEdit = !!props.canEdit ? props.canEdit : eventOwner;
  const mothers = useSelector(motherSelectors.getMothers);
  const infants = useSelector(infantSelectors.getInfants);

  const title = 'View event';
  const subTitle = ''; // format(startDate, 'EEEE, d LLLL yyyy');

  const [showHomeVisitPrompt, setShowHomeVisitPrompt] =
    useState<boolean>(false);
  const [
    showHomeVisitMultipleClientsPrompt,
    setShowHomeVisitMultipleClientsPrompt,
  ] = useState<boolean>(false);
  const [selectedParticipant, setSelectedParticipant] =
    useState<CalendarEventParticipantModel | null>(null);
  const [participants, setParticipants] = useState<
    CalendarEventParticipantModel[]
  >([]);

  useMemo(() => {
    const ids = event.participants.map((p) => p.participantUserId);
    const p = mapIdsToCalendarEventParticipants(ids, infants, mothers);
    setParticipants(p);
  }, [event, mothers, infants]);

  const clientParticipants = participants.filter(
    (p) =>
      p.participantUser.type === 'infant' || p.participantUser.type === 'mother'
  );

  const canDisplayStartButton = (): boolean => {
    if (!eventOwner) return false;
    if (eventType === 'Home visit') {
      if (clientParticipants.length > 0) {
        return true;
      }
    }
    if (eventType === 'Breastfeeding club') {
      return true;
    }
    if (eventType === 'Other') {
      return false;
    }
    return false;
  };

  const onEdit = () => {
    props.onClose();
    calendarEditEvent({
      event: { id: event.id },
    });
  };

  const onAction = () => {
    if (eventType === 'Home visit') {
      onActionHomeVisit();
      return;
    }
    if (eventType === 'Breastfeeding club') {
      onActionBreastfeedingClub();
      return;
    }
    props.onClose();
  };

  const onActionHomeVisit = () => {
    if (clientParticipants.length === 1) {
      setSelectedParticipant(clientParticipants[0]);
      setShowHomeVisitPrompt(true);
    } else {
      // more than one participants
      setSelectedParticipant(null);
      setShowHomeVisitMultipleClientsPrompt(true);
      //props.onClose();
    }
  };

  const startVisitHome = async (type: '2month' | 'other') => {
    setShowHomeVisitPrompt(false);
    setShowHomeVisitMultipleClientsPrompt(false);
    props.onClose();
    await startVisit(
      {
        id: selectedParticipant?.participantUserId,
        type: selectedParticipant?.participantUser.type as StartVisitClientType,
      },
      appDispatch,
      history
    );
  };

  const onHomeVisitMultipleClientsPromptCancel = () => {
    setShowHomeVisitMultipleClientsPrompt(false);
  };

  const onHomeVisitMultipleClientsPromptSelected = (id: string) => {
    const client = participants.find((x) => x.participantUserId === id);
    if (!!client) {
      setSelectedParticipant(client);
      setShowHomeVisitPrompt(true);
    } else {
      setShowHomeVisitMultipleClientsPrompt(false);
    }
  };

  const onActionBreastfeedingClub = () => {
    history.push(ROUTES.COMMUNITY.BREASTFEEDING_CLUBS.ADD, {
      isFromPointsScreen: false,
    } as AddBreastFeedingClubRouteState);
    props.onClose();
  };

  return (
    <>
      <BannerWrapper
        size={'small'}
        backgroundColour={'white'}
        renderBorder={true}
        title={title}
        subTitle={subTitle}
        color={'primary'}
        onBack={() => {
          props.onClose();
        }}
        onClose={() => {
          props.onClose();
        }}
        displayOffline={!isOnline}
      >
        <div className={'flex flex-col'}>
          <div className="flex flex-row">
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
                  textColor="secondary"
                  color="secondaryAccent2"
                  type="filled"
                >
                  <Typography
                    type="h6"
                    className="ml-2"
                    text={'Edit'}
                    color="secondary"
                  />
                  {renderIcon(
                    'PencilIcon',
                    classNames('h-4 w-4 text-secondary')
                  )}
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
            <div
              key={`participant-${index}`}
              className="flex flex-row px-4 pb-2"
            >
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
              {renderIcon(
                'ClipboardListIcon',
                'mt-1 h-5 w-5 text-textDark mr-4'
              )}
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
          {canDisplayStartButton() /*&& !!eventAction && !!eventAction.url*/ && (
            <div className="px-4 pb-4">
              <Button
                onClick={() => onAction()}
                className="w-full"
                size="small"
                color="primary"
                type="filled"
              >
                {renderIcon(
                  'ArrowCircleRightIcon',
                  classNames('h-5 w-5 text-white')
                )}
                <Typography
                  type="h6"
                  className="ml-2"
                  text="Start"
                  color="white"
                />
              </Button>
            </div>
          )}
        </div>
      </BannerWrapper>
      <HomeVisitPrompt
        client={{
          id: selectedParticipant?.participantUserId,
          type: selectedParticipant?.participantUser.type,
        }}
        visible={showHomeVisitPrompt}
        startVisit={startVisitHome}
      />
      <HomeVisitMultipleClientsPrompt
        clients={clientParticipants}
        onCancel={onHomeVisitMultipleClientsPromptCancel}
        onSelected={onHomeVisitMultipleClientsPromptSelected}
        subTitle={subTitle}
        title={title}
        visible={showHomeVisitMultipleClientsPrompt}
      />
    </>
  );
};

export const useCalendarViewEvent = (): ((
  options: CalendarViewEventOptions
) => void) => {
  const dialog = useDialog();
  return (options: CalendarViewEventOptions) => {
    dialog({
      position: DialogPosition.Full,
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
