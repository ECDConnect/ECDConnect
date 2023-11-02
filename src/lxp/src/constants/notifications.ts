import ROUTES from '@/routes/routes';
import { Message } from '@models/messages/messages';

interface NotificationTagConfigParams {
  [key: string]: Partial<Message>;
}
export const notificationTagConfig: NotificationTagConfigParams = {
  AcceptAgreement: {
    routeConfig: {
      route: ROUTES.PRACTITIONER.COMMUNITY.ACCEPT_CLUB_LEADER_ROLE,
    },
  },
};
