import { createAsyncThunk } from '@reduxjs/toolkit';
import ReactGA from 'react-ga';
import { RootState, ThunkApiType } from '../types';

export const pushAnalytics = createAsyncThunk<
  boolean[],
  // eslint-disable-next-line @typescript-eslint/ban-types
  {},
  ThunkApiType<RootState>
>('pushAnalytics', async (_, { getState, rejectWithValue }) => {
  const {
    analytics: { viewTracking, eventTracking },
  } = getState();

  try {
    if (viewTracking) {
      for (const viewTrackingItem of viewTracking) {
        ReactGA.pageview(
          viewTrackingItem.pageView,
          undefined,
          viewTrackingItem.title
        );
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
});
