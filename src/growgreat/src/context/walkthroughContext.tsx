import React, {
  createContext,
  useReducer,
  useContext,
  Dispatch,
  ReactNode,
} from 'react';

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
