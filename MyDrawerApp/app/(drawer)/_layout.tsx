import React from 'react';
import { Slot } from 'expo-router';
import { SlidingDrawer } from '@/features/navigation/components/organisms/SlidingDrawer';

/**
 * Layout: Drawer.
 * Custom drawer routing shell wrapping pages with the animated SlidingDrawer container.
 */
export default function DrawerLayout() {
  return (
    <SlidingDrawer>
      <Slot />
    </SlidingDrawer>
  );
}
