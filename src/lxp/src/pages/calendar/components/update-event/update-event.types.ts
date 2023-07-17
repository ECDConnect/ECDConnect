import { ComponentBaseProps } from '@ecdlink/ui';
import * as Yup from 'yup';

export type UpdateEventEvent = {
  id?: string;
  start?: string;
  end?: string;
  allDay?: boolean;
};

export interface UpdateEventProps extends ComponentBaseProps {
  event?: UpdateEventEvent;
  onUpdated: (isNew: boolean, eventId: string) => void;
  onBack: () => void;
}

export interface UpdateEventFormModel {
  name: string;
  start: Date;
  end: Date;
  allDay: boolean;
  description: string;
  eventType?: string;
}

export const defaultUpdateEventFormSchema: UpdateEventFormModel = {
  name: '',
  start: new Date(),
  end: new Date(),
  allDay: false,
  description: '',
  eventType: undefined,
};

export const updateEventFormSchema = Yup.object().shape({
  name: Yup.string().required(),
  //body: Yup.string().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
});
