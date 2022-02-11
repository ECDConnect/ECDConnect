import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { Message } from '../../models/messages/messages';
import { NotificationsState, Notification } from './notifications.types';

const initialState: NotificationsState = {
  notifications: [],
};

const notificationsState = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.notifications = [];
    },
    addNotifications: (state: NotificationsState, action: PayloadAction<Message[]>) => {
      const newNotifications = action.payload.map((message) => ({ isNew: true, message }));
      state.notifications.push(...newNotifications);
    },
    markAllNotificationsRead: (state) => {
      const notificationsCopy = [...state.notifications].map((x) => ({
        isNew: false,
        message: x.message,
      }));
      state.notifications = notificationsCopy;
    },
    removeNotification: (state, action: PayloadAction<Notification>) => {
      const notificationIndex = state.notifications.findIndex(
        (n) => n.message.reference === action.payload.message.reference
      );

      if (notificationIndex < 0) return;

      state.notifications.splice(notificationIndex, 1);
    },
  },
});

const { reducer: notificationReducer, actions: notificationActions } = notificationsState;

const notificationPersistConfig = {
  key: 'notifications',
  storage: localForage,
  blacklist: [],
};

export { notificationPersistConfig, notificationReducer, notificationActions };
