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
          ReactGA.event({
            action: eventTrackingItem.action,
            category: eventTrackingItem.category,
          });
        }
      }
      return [true];
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
