import {
  CalendarEventDto,
  CalendarEventModel,
  CalendarEventModelInputModel,
  CalendarEventTypeDto,
  Config,
} from '@ecdlink/core';
import { api } from '../axios.helper';
import { calendarConvert } from '@/store/calendar/calendar.util';

// 2023-07-04T08:00:00.000+02:00
// 012345678901234567890123456789
//           1         2
const changeTZto0 = (date: string | null): string => {
  if (date === null) return '';
  if (!date) return date;
  if (date.length < 23) return date + '+00:00';
  return date.slice(0, 22) + '+00:00';
};
class CalendarService {
  _accessToken: string;

  constructor(accessToken: string) {
    this._accessToken = accessToken;
  }

  async getCalendarEventTypes(locale: string): Promise<CalendarEventTypeDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
      query GetAllCalendarEventType($locale: String) {
        GetAllCalendarEventType(locale: $locale) {
          id
          name
          colour
        }
      }        
      `,
      variables: {
        locale: locale,
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get Calendar Event Types failed - Server connection error'
      );
    }
    return response.data.data.GetAllCalendarEventType;
  }

  async getCalendarEvents(start: Date): Promise<CalendarEventDto[]> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        query userCalendarEvents($start: DateTime!) {
          userCalendarEvents(start: $start) {    
            allDay
            description
            end
            eventType
            id
            name
            participants {
              id
              isActive
              participantUserId
              participantUser {
                firstName
                surname
              }
            }
            start
            action
            isActive
            userId
            user {
              firstName
              surname
            }
            visit {
              attended
            }
          }
        }
    `,
      variables: {
        start: start.toISOString(),
      },
    });

    if (response.status !== 200) {
      throw new Error(
        'Get User Calendar Events failed - Server connection error'
      );
    }

    // have to set TZ to 0, in db as GMT0 but transport layer is adding on a TZ from somewhere
    if (
      response.data.data.userCalendarEvents &&
      response.data.data.userCalendarEvents.length > 0
    ) {
      (response.data.data.userCalendarEvents as CalendarEventDto[]).forEach(
        (e) => {
          e.start = changeTZto0(e.start);
          e.end = changeTZto0(e.end);
        }
      );
    }
    return response.data.data.userCalendarEvents;
  }

  async updateCalendarEvent(
    inputModel: CalendarEventModelInputModel,
    id: string
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const input =
      calendarConvert.CalendarEventModelInputModel.CalendarEventModelInput(
        inputModel
      );
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateCalendarEvent($input: CalendarEventModelInput, $id: UUID!) {
          updateCalendarEvent(input: $input, id: $id) {
            id
          }
        }
      `,
      variables: {
        input: input,
        id: id,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Updating calendar event failed - Server connection error'
      );
    }

    return response.data.data.updateCalendarEvent;
  }

  async syncCalendarEvent(event: CalendarEventModel): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const input =
      calendarConvert.CalendarEventModel.CalendarEventModelInput(event);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateCalendarEvent($input: CalendarEventModelInput, $id: UUID!) {
          updateCalendarEvent(input: $input, id: $id) {
            id
          }
        }
      `,
      variables: {
        input: input,
        id: event.id,
      },
    });
    if (response.status !== 200) {
      throw new Error(
        'Updating calendar event failed - Server connection error'
      );
    }
    return true;
  }

  async cancelCalendarEvent(input: { id: string }): Promise<{ id: string }> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<{
      data: { cancelCalendarEvent: { id: string } };
      errors?: {};
    }>(``, {
      query: `
      mutation CancelCalendarEvent($id: UUID!) {
        cancelCalendarEvent(
          id: $id
        ) {
          id
        }
      }
      `,
      variables: {
        ...input,
      },
    });

    if (response.status !== 200 || response.data.errors) {
      throw new Error('Cancel calendar event - Server connection error');
    }

    return response.data.data.cancelCalendarEvent;
  }
}

export default CalendarService;
