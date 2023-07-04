import { CalendarEventDto, CalendarEventTypeDto, Config } from '@ecdlink/core';
import { CalendarEventInput } from '@ecdlink/graphql';
import { api } from '../axios.helper';

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
            }
            start
            action
            isActive
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

    return response.data.data.userCalendarEvents;
  }

  async updateCalendarEvent(
    input: CalendarEventInput,
    id: string
  ): Promise<any> {
    const apiInstance = api(Config.graphQlApi, this._accessToken);
    const response = await apiInstance.post<any>(``, {
      query: `
        mutation updateCalendarEvent($input: CalendarEventInput, $id: UUID!) {
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
}

export default CalendarService;
