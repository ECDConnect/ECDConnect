import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
  useState,
} from 'react';
import { CallBackProps, STATUS } from 'react-joyride';

interface State {
  isTourActive: boolean;
}

interface Action {
  type: string;
  payload: any;
}

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
    default:
      throw new Error(`Unknown action: ${action.type}`);
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

  const isWalkthroughSession = Boolean(
    window.sessionStorage.getItem('isWalkthrough')
  );
  const setIsWalkthroughSession = (value: 'true' | 'false') =>
    window.sessionStorage.setItem('isWalkthrough', value);

  const handleCallback = (data: CallBackProps) => {
    const { status, index, action, type } = data;
    // @ts-ignore
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      walkthroughDispatch?.({ type: 'SET_TOUR_ACTIVE', payload: false });
      setWalkthroughStep(0);
    }

    if (type === 'step:after' && (action === 'next' || action === 'prev')) {
      setTimeout(() => {
        setWalkthroughStep(index + (action === 'next' ? 1 : -1));
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
