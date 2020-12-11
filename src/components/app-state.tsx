import React, { createContext, useReducer, useContext } from 'react';
import { IUser } from '../interfaces/user';

type AppState = {
    user: IUser | null;
};

type AppStateActions =
    | {
          type: 'setUser';
          nextUser: IUser;
      }
    | {
          type: 'resetUser';
      };

const initialState: AppState = {
    user: null,
};

const initialAppContext: {
    appState: AppState;
    setAppState: React.Dispatch<AppStateActions>;
} = {
    appState: initialState,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setAppState: (state) => {},
};
export const AppContext = createContext(initialAppContext);

const AppStateReducer = (
    state: AppState,
    action: AppStateActions,
): AppState => {
    switch (action.type) {
        case 'setUser':
            return {
                // if we had other state I would spread it here: ...state,
                user: action.nextUser,
            };
        case 'resetUser':
            return {
                user: null,
            };
        default:
            return state;
    }
};

export function AppStateProvider({
    children,
}: {
    children: React.ReactNode[] | React.ReactNode;
}) {
    const [appState, setAppState] = useReducer(AppStateReducer, initialState);

    // pass the state and reducer to the context, dont forget to wrap the children
    return (
        <AppContext.Provider value={{ appState, setAppState }}>
            {children}
        </AppContext.Provider>
    );
}

export const useAppState = () => useContext(AppContext);
