import { useLayoutEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../store/auth';
import {
  INACTIVITY_TIMEOUT_MS,
  getLastActive,
  hasPin,
  isInactive,
  touchActivity,
} from '@/utils/security/pin-lock';

const ACTIVITY_EVENTS = [
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
] as const;

// Locks the app when a PIN is set and the practitioner has been away for
// 30 minutes. The timer does not run while the phone is asleep, so the last
// active time is checked again when the page becomes visible.
export const useInactivityLock = (pinVersion = 0) => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getAuthUser);
  const isAppLocked = useSelector(authSelectors.getIsAppLocked);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const previousUserId = useRef<string | null | undefined>(undefined);

  useLayoutEffect(() => {
    const previous = previousUserId.current;
    const current = user?.id ?? null;
    previousUserId.current = current;

    if (!current || user?.isTempUser || !hasPin(current)) return;

    const justLoggedIn = previous !== undefined && previous !== current;
    if (justLoggedIn) {
      touchActivity();
    } else if (isInactive(INACTIVITY_TIMEOUT_MS)) {
      dispatch(authActions.lockApp());
      return;
    }

    if (isAppLocked) return;

    const lockIfDue = () => {
      if (isInactive(INACTIVITY_TIMEOUT_MS)) {
        dispatch(authActions.lockApp());
      }
    };

    const armTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      const lastActive = getLastActive();
      const elapsed =
        lastActive == null ? INACTIVITY_TIMEOUT_MS : Date.now() - lastActive;
      const remaining = Math.max(INACTIVITY_TIMEOUT_MS - elapsed, 0);
      timerRef.current = setTimeout(() => {
        dispatch(authActions.lockApp());
      }, remaining);
    };

    const onActivity = () => {
      touchActivity();
      armTimer();
    };

    const onVisibility = () => {
      if (document.visibilityState !== 'visible') return;
      lockIfDue();
      if (!isInactive(INACTIVITY_TIMEOUT_MS)) armTimer();
    };

    ACTIVITY_EVENTS.forEach((eventName) =>
      window.addEventListener(eventName, onActivity, { passive: true })
    );
    document.addEventListener('visibilitychange', onVisibility);
    armTimer();

    return () => {
      ACTIVITY_EVENTS.forEach((eventName) =>
        window.removeEventListener(eventName, onActivity)
      );
      document.removeEventListener('visibilitychange', onVisibility);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user?.id, user?.isTempUser, isAppLocked, pinVersion, dispatch]);
};
