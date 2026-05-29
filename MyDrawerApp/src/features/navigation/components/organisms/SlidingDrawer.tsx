import React from 'react';
import { Drawer } from '@/components/organisms/Drawer';
import { useDrawerContext } from '../../context/DrawerContext';
import { CustomDrawerContent } from './CustomDrawerContent';

interface SlidingDrawerProps {
  children: React.ReactNode;
}

/**
 * Organism: SlidingDrawer.
 * Wraps content layout to animate screen translation and scale in response to Drawer Context state.
 * Refactored to delegate to the new unified, responsive, and robust Drawer organism.
 */
export const SlidingDrawer: React.FC<SlidingDrawerProps> = ({ children }) => {
  const { isOpen, side, closeDrawer } = useDrawerContext();

  return (
    <Drawer
      isOpen={isOpen}
      onClose={closeDrawer}
      position={side}
      enableZoomEffect={true}
      renderContent={() => <CustomDrawerContent onClose={closeDrawer} />}
    >
      {children}
    </Drawer>
  );
};

export default SlidingDrawer;

