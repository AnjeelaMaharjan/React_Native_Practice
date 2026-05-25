import React, { createContext, useState, useContext } from 'react';

export type DrawerSide = 'left' | 'right';

export interface DrawerContextType {
  isOpen: boolean;
  side: DrawerSide;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  setDrawerSide: (side: DrawerSide) => void;
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

/**
 * DrawerProvider: Context manager for our custom sliding drawer layout.
 * Supports configurable left-to-right or right-to-left orientation toggles.
 */
export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [side, setSide] = useState<DrawerSide>('left');

  const openDrawer = (): void => setIsOpen(true);
  const closeDrawer = (): void => setIsOpen(false);
  const toggleDrawer = (): void => setIsOpen((prev) => !prev);
  const setDrawerSide = (newSide: DrawerSide): void => setSide(newSide);

  return (
    <DrawerContext.Provider
      value={{
        isOpen,
        side,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        setDrawerSide,
      }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) {
    throw new Error('useDrawerContext must be used within a DrawerProvider');
  }
  return context;
};
