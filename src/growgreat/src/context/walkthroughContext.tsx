import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
  useState,
} from 'react';
import { CallBackProps, STATUS, status, valueof } from 'react-joyride';

interface State {
  isTourActive: boolean;
  stepIndex: number;
}

interface ActionSetTourActive {
  type: 'SET_TOUR_ACTIVE';
  payload: boolean;
}

interface ActionSetStep {
  type: 'SET_STEP';
  payload: number;
}

type Action = ActionSetTourActive | ActionSetStep;

const WalkthroughStateContext = createContext<State | undefined>(undefined);
const WalkthroughDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'SET_TOUR_ACTIVE':
      return {
        ...state,
        isTourActive: action.payload,
      };
    case 'SET_STEP':
      return {
        ...state,
        stepIndex: action.payload,
      };
    default:
      throw new Error('Unknown action');
  }
};

interface WalkthroughProviderProps {
  children: ReactNode;
}

export const WalkthroughProvider: React.FC<WalkthroughProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, {
    isTourActive: false,
    stepIndex: 0,
  });

  return (
    <WalkthroughStateContext.Provider value={state}>
      <WalkthroughDispatchContext.Provider value={dispatch}>
        {children}
      </WalkthroughDispatchContext.Provider>
    </WalkthroughStateContext.Provider>
  );
};

export const useWalkthroughState = (): State | undefined =>
  useContext(WalkthroughStateContext);
export const useWalkthroughDispatch = (): Dispatch<Action> | undefined =>
  useContext(WalkthroughDispatchContext);

export const useWalkthrough = () => {
  const walkthroughState = useWalkthroughState();
  const walkthroughDispatch = useWalkthroughDispatch();

  const [walkthroughStepIndex, setWalkthroughStep] = useState(0);

  const isWalkthroughSession =
    window.sessionStorage.getItem('isWalkthrough') === 'true';

  const setIsWalkthroughSession = (value: 'true' | 'false') =>
    window.sessionStorage.setItem('isWalkthrough', value);

  const handleCallback = (data: CallBackProps) => {
    const { status, index, action, type } = data;

    if (
      ([STATUS.FINISHED, STATUS.SKIPPED] as valueof<status>[]).includes(status)
    ) {
      window.sessionStorage.setItem('isWalkthrough', 'false');
      walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: false });
      walkthroughDispatch?.({ type: 'SET_STEP', payload: 0 });
      setWalkthroughStep(0);
    }

    if (type === 'step:after' && (action === 'next' || action === 'prev')) {
      setTimeout(() => {
        const step = index + (action === 'next' ? 1 : -1);
        setWalkthroughStep(step);
        walkthroughDispatch?.({ type: 'SET_STEP', payload: step });
      }, 100);
    }
  };

  return {
    isWalkthroughSession,
    walkthroughState,
    walkthroughStepIndex,
    handleCallback,
    walkthroughDispatch,
    setIsWalkthroughSession,
  };
};
