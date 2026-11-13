import { createAsyncThunk } from '@reduxjs/toolkit';
import ReactGA from 'react-ga4';
import { RootState, ThunkApiType } from '../types';

export const pushAnalytics = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>(
  'pushAnalytics',
  // eslint-disable-next-line no-empty-pattern
  async ({}, { getState, rejectWithValue }) => {
    const {
      analytics: { viewTracking, eventTracking },
    } = getState();

    try {
      if (viewTracking) {
        for (const viewTrackingItem of viewTracking) {
          ReactGA.send({
            hitType: 'pageview',
            page: undefined,
            title: viewTrackingItem.title,
          });
        }
      }

      if (eventTracking) {
        for (const eventTrackingItem of eventTracking) {
          if (eventTrackingItem.params) {
            // The object form of ReactGA.event drops custom params, so use the
            // name + params form to send them through to GA4
            ReactGA.event(eventTrackingItem.action, {
              event_category: eventTrackingItem.category,
              event_label: eventTrackingItem.label,
              value: eventTrackingItem.value
                ? Number(eventTrackingItem.value)
                : undefined,
              ...eventTrackingItem.params,
            });
            continue;
          }

          ReactGA.event({
            action: eventTrackingItem.action,
            category: eventTrackingItem.category,
            label: eventTrackingItem.label,
            value: eventTrackingItem.value
              ? Number(eventTrackingItem.value)
              : undefined,
          });
        }
      }
      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
