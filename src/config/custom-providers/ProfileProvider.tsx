import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define the types for the context state and actions
interface PopupContextType {
  isVisible: boolean;
  showPopup: () => void;
  hidePopup: () => void;
}

// Create a default context value
const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Custom hook to use the PopupContext
export const usePopup = (): PopupContextType => {
  const context = useContext(PopupContext);
  if (!context) {
    throw new Error('usePopup must be used within a PopupProvider');
  }
  return context;
};

// Define the provider props type
interface PopupProviderProps {
  children: ReactNode;
}

// PopupProvider component
export const PopupProvider: React.FC<PopupProviderProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);

  const showPopup = () => setIsVisible(true);

  const hidePopup = () => setIsVisible(false);

  return (
    <PopupContext.Provider value={{ isVisible, showPopup, hidePopup }}>
      {children}
    </PopupContext.Provider>
  );
};
