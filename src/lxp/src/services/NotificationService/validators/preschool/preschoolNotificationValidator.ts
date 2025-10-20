import { EnhancedStore } from '@reduxjs/toolkit';
import { Message } from '@models/messages/messages';
import { RootState } from '@store/types';
import {
  NotificationIntervals,
  NotificationValidator,
} from '../../NotificationService.types';
import ROUTES from '@/routes/routes';

export class PreschoolNotificationValidator implements NotificationValidator {
  interval: NotificationIntervals;
  lastCheckTimestamp: number;
  store: EnhancedStore<RootState, any>;
  currentDate: Date;

  constructor(store: EnhancedStore<RootState, any>, currentDate: Date) {
    this.store = store;
    this.interval = NotificationIntervals.hour;
    this.lastCheckTimestamp = 0;
    this.currentDate = currentDate;
  }

  getNotifications = (): Message[] => {
    const { classroomData: classroomState } = this.store.getState();

    if (!classroomState) return [];

    const checkDate = new Date(this.currentDate.getFullYear(), 0, 15);

    //only run on Jan 15
    if (
      checkDate.getDate() === this.currentDate.getDate() &&
      checkDate.getMonth() === this.currentDate.getMonth() &&
      checkDate.getFullYear() === this.currentDate.getFullYear()
    ) {
      if (classroomState.classroom) {
        if (!classroomState.classroom.classroomImageUrl) {
          return [
            {
              reference: `preschool-image`,
              title: `Add your preschool logo`,
              message:
                'Your preschool logo will be added to your PDF downloads (for example: attendance and income statements). Add your logo now!',
              dateCreated: new Date().toISOString(),
              priority: 99,
              viewOnDashboard: true,
              isFromBackend: false,
              area: 'preschool',
              icon: 'SwitchVerticalIcon',
              color: 'primary',
              actionText: 'Add logo',
              viewType: 'Both',
              routeConfig: {
                route: ROUTES.PRACTITIONER.PROGRAMME_INFORMATION,
              },
            },
          ];
        }
      }
    }
    return [];
  };
}
