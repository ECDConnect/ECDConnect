import { createContext, useContext, useMemo } from 'react';
import { useSetState } from 'react-use';
import { AppState } from './pages/classroom/attendance/components/attendance-wrapper/attendanceWrapper.types';

const appState = {
  run: false,
  stepIndex: 0,
  steps: [],
  tourActive: false,
  attendanceStatus: true,
  enableButton: true,
  childId: '',
  language: 'en-za',
};

export const AppContext = createContext({
  state: appState,
  setState: () => undefined,
});
AppContext.displayName = 'AppContext';

export function WalkthroughProvider(props: any) {
  const [state, setState] = useSetState(appState);

  const value = useMemo(
    () => ({
      state,
      setState,
    }),
    [setState, state]
  );

  return <AppContext.Provider value={value} {...props} />;
}

export function useAppContext(): {
  setState: (
    patch: Partial<AppState> | ((previousState: AppState) => Partial<AppState>)
  ) => void;
  state: AppState;
} {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within a AppProvider');
  }

  return context;
}
