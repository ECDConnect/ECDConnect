import { ComponentBaseProps } from '@ecdlink/ui';
import * as Yup from 'yup';
import { CalendarEvent } from '../../calendar-home.types';

export interface UpdateEventProps extends ComponentBaseProps {
  event: CalendarEvent;
  onUpdated: (isNew: boolean, event: CalendarEvent) => void;
  onBack: () => void;
}

export interface UpdateEventFormModel {
  title: string;
  start: Date;
  end: Date;
  isAllday: boolean;
  body: string;
}

export const defaultUpdateEventFormSchema: UpdateEventFormModel = {
  title: '',
  start: new Date(),
  end: new Date(),
  isAllday: false,
  body: '',
};

export const updateEventFormSchema = Yup.object().shape({
  title: Yup.string().required(),
  //body: Yup.string().required(),
  start: Yup.date().required(),
  end: Yup.date().required(),
});
