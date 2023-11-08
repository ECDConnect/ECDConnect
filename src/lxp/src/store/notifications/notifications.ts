import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import localForage from 'localforage';
import { Message } from '@models/messages/messages';
import { NotificationsState, Notification } from './notifications.types';
import { setFulfilledThunkActionStatus, setThunkActionStatus } from '../utils';
import { disableBackendNotification } from './notifications.actions';

const initialState: NotificationsState = {
  notifications: [],
  notificationReferences: [],
};

const notificationsState = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetFrontendNotificationState: (state) => {
      const backendNotifications = state.notifications.filter(
        (item) => item.message.isFromBackend
      );

      const backendReferences = backendNotifications.map(
        (item) => item.message.reference
      );

      state.notifications = backendNotifications || [];
      state.notificationReferences = backendReferences || [];
    },
    addNotifications: (
      state: NotificationsState,
      action: PayloadAction<Message[]>
    ) => {
      const newNotifications = action.payload.map((message) => ({
        isNew: true,
        message,
      }));
      state.notifications.push(...newNotifications);
      state.notificationReferences.push(
        ...newNotifications.map((n) => n.message.reference)
      );
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
  extraReducers: (builder) => {
    setThunkActionStatus(builder, disableBackendNotification);
    builder.addCase(disableBackendNotification.fulfilled, (state, action) => {
      const notificationId = action.meta.arg.notificationId;

      state.notifications = state.notifications.filter(
        (n) => n.message.reference !== notificationId
      );

      setFulfilledThunkActionStatus(state, action);
    });
  },
});

const { reducer: notificationReducer, actions: notificationActions } =
  notificationsState;

const notificationPersistConfig = {
  key: 'notifications',
  storage: localForage,
  blacklist: [],
};

export { notificationPersistConfig, notificationReducer, notificationActions };
