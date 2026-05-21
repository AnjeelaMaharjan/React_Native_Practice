import React, { createContext, useState, useContext } from 'react';

interface DrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  toggleSide: () => void;
  Side: 'left' | 'right';
}

const DrawerContext = createContext<DrawerContextType | undefined>(undefined);

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [side, setSide] = useState<'left' | 'right'>('left');

  const toggleSide = () => {
    setSide((prev) => (prev === 'left' ? 'right' : 'left'));
  };
  return (
    <DrawerContext.Provider value={{ isOpen, openDrawer: () => setIsOpen(true), closeDrawer: () => setIsOpen(false), toggleDrawer: () => setIsOpen(prev => !prev), Side: side, toggleSide }}>
      {children}
    </DrawerContext.Provider>
  );
};

export const useDrawerContext = (): DrawerContextType => {
  const context = useContext(DrawerContext);
  if (!context) throw new Error('useDrawerContext must be used within DrawerProvider');
  return context;
};