import { FC, useReducer } from "react";
import { UiContext, uiReducer } from "./";

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};

interface Props {
  children: React.ReactNode;
}

export const UiProvider: FC<Props> = ({ children }) => {
  const [state, dispath] = useReducer(uiReducer, UI_INITIAL_STATE);

  const toogleSideMenu = () => {
    dispath({ type: "[UI] - ToogleMenu" });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,

        //Methods
        toogleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
