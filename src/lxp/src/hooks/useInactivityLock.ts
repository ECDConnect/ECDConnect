import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { authActions, authSelectors } from '../store/auth';

const INACTIVITY_TIMEOUT_MS = 30 * 60 * 1000;
const EVENTS: string[] = [
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
  'wheel',
];

export const useInactivityLock = () => {
  const dispatch = useDispatch();
  const user = useSelector(authSelectors.getAuthUser);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!user) return;

    const resetTimer = () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        dispatch(authActions.lockApp());
      }, INACTIVITY_TIMEOUT_MS);
    };

    EVENTS.forEach((e) =>
      window.addEventListener(e, resetTimer, { passive: true })
    );
    resetTimer();

    return () => {
      EVENTS.forEach((e) => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [user, dispatch]);
};
