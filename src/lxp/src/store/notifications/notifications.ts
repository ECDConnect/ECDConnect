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
    resetNotificationState: (state) => {
      state.notifications = initialState.notifications;
      state.notificationReferences = initialState.notificationReferences;
    },
    resetFrontendNotificationState: (state) => {
      // const backendNotifications = state.notifications.filter(
      //   (item) => item.message.isFromBackend
      // );
      // const backendReferences = backendNotifications.map(
      //   (item) => item.message.reference
      // );

      const frontendNotifications = state.notifications.filter(
        (item) => !item.message.isFromBackend
      );
      const frontendReferences = frontendNotifications.map(
        (item) => item.message.reference
      );

      state.notifications = frontendNotifications || [];
      state.notificationReferences = frontendReferences || [];
    },
    addNotifications: (
      state: NotificationsState,
      action: PayloadAction<Message[]>
    ) => {
      const seenReferences = new Set(state.notificationReferences); // Track existing references
      const newNotifications = action.payload
        .filter((message) => {
          if (seenReferences.has(message.reference)) {
            return false; // Skip if reference already exists in state
          }
          seenReferences.add(message.reference); // Add to seen references
          return true; // Include this message
        })
        .map((message) => ({
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
    markNotificationRead: (
      state,
      action: PayloadAction<{ reference: string }>
    ) => {
      const notification = state.notifications.find(
        (n) => n.message.reference === action.payload.reference
      );
      if (notification) {
        notification.isNew = false;
      }
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
