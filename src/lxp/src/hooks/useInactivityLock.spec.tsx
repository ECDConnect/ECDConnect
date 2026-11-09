import '@/utils/security/test-webcrypto';
import { act, cleanup, render } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import type { ReactNode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { authActions, authReducer } from '../store/auth';

vi.mock('@services/AuthService', () => ({
  AuthService: class AuthService {},
}));
import { useInactivityLock } from './useInactivityLock';
import {
  INACTIVITY_TIMEOUT_MS,
  savePin,
  touchActivity,
} from '@/utils/security/pin-lock';
import { LxpLoginReturnModel } from '@/store/auth/auth.selectors';

const user: LxpLoginReturnModel = {
  auth_token: 'token',
  expires_in: '3600',
  id: 'user-1',
  resetData: false,
  userMustConfirmAuthCode: false,
  loginType: 'username',
  userName: '2580',
};

const Probe = () => {
  useInactivityLock();
  return null;
};

const renderLock = (signedIn = false) => {
  const store = configureStore({
    reducer: { auth: authReducer },
    preloadedState: signedIn
      ? { auth: { userAuth: user, userExpired: false, isAppLocked: false } }
      : undefined,
  });
  const wrapper = ({ children }: { children: ReactNode }) => (
    <Provider store={store}>{children}</Provider>
  );
  return {
    store,
    ...render(<Probe />, { wrapper }),
  };
};

describe('useInactivityLock', () => {
  afterEach(() => {
    cleanup();
  });

  beforeEach(() => {
    localStorage.clear();
  });

  it('locks on open when the saved PIN has been idle', async () => {
    await savePin(user.id, '2580', { iterations: 1000 });
    touchActivity(Date.now() - INACTIVITY_TIMEOUT_MS - 1000);

    const view = renderLock(true);

    expect(view.store.getState().auth.isAppLocked).toBe(true);
    view.unmount();
  });

  it('does not lock a fresh login', async () => {
    await savePin(user.id, '2580', { iterations: 1000 });
    touchActivity(Date.now() - INACTIVITY_TIMEOUT_MS - 1000);
    const view = renderLock(false);

    act(() => {
      view.store.dispatch(authActions.setAuthUser(user));
    });

    expect(view.store.getState().auth.isAppLocked).toBeFalsy();
    view.unmount();
  });

  it('locks when the page becomes visible after the idle time', async () => {
    await savePin(user.id, '2580', { iterations: 1000 });
    const view = renderLock(false);
    act(() => {
      view.store.dispatch(authActions.setAuthUser(user));
    });

    touchActivity(Date.now() - INACTIVITY_TIMEOUT_MS - 1000);
    act(() => {
      document.dispatchEvent(new Event('visibilitychange'));
    });

    expect(view.store.getState().auth.isAppLocked).toBe(true);
    view.unmount();
  });
});
