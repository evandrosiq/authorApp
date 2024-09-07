import { useContext } from "react";
import { ApplicationContext } from "../context/ContextManager";

export const useApplicationContext = () => {
  const context = useContext(ApplicationContext);

  if (!context) {
    throw new Error(
      "useApplicationContext deve ser usado dentro de um ApplicationContextProvider"
    );
  }

  return context;
};
