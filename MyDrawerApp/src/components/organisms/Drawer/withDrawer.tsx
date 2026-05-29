import React, { useState, useCallback, useMemo } from 'react';
import { Drawer, DrawerProps } from './Drawer';

/**
 * Props injected into the component wrapped by the withDrawer HOC.
 */
export interface WithDrawerProps {
  drawer: {
    /**
     * Whether the drawer is currently visible.
     */
    isOpen: boolean;
    /**
     * Opens the drawer.
     */
    open: () => void;
    /**
     * Closes the drawer.
     */
    close: () => void;
    /**
     * Toggles the drawer visibility state.
     */
    toggle: () => void;
  };
}

/**
 * Higher-Order Component (HOC) that injects drawer controls into a component
 * and automatically manages the state and layout structure of the Drawer component.
 *
 * Useful for screen wrappers, layout containers, or persistent components that
 * require modular side-panels.
 *
 * @param WrappedComponent - The component to inject the drawer helper props into.
 * @param drawerConfig - Static configuration parameters for the Drawer component (e.g. position, renderContent).
 */
export function withDrawer<P extends WithDrawerProps>(
  WrappedComponent: React.ComponentType<P>,
  drawerConfig: Omit<DrawerProps, 'isOpen' | 'onClose'>
) {
  const ComponentWithDrawer = (props: Omit<P, keyof WithDrawerProps>) => {
    const [isOpen, setIsOpen] = useState(false);

    const open = useCallback(() => setIsOpen(true), []);
    const close = useCallback(() => setIsOpen(false), []);
    const toggle = useCallback(() => setIsOpen((prev) => !prev), []);

    // Memoize the injected props to avoid unnecessary re-renders of the wrapped component
    const drawerActions = useMemo(
      () => ({
        isOpen,
        open,
        close,
        toggle,
      }),
      [isOpen, open, close, toggle]
    );

    return (
      <Drawer
        isOpen={isOpen}
        onClose={close}
        position={drawerConfig.position}
        width={drawerConfig.width}
        height={drawerConfig.height}
        backdropColor={drawerConfig.backdropColor}
        backdropOpacity={drawerConfig.backdropOpacity}
        enableZoomEffect={drawerConfig.enableZoomEffect}
        accessibilityLabel={drawerConfig.accessibilityLabel}
        renderContent={drawerConfig.renderContent}
        style={drawerConfig.style}
      >
        <WrappedComponent
          {...(props as P)}
          drawer={drawerActions}
        />
      </Drawer>
    );
  };

  // Set displayName for easier React DevTools debugging
  const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
  ComponentWithDrawer.displayName = `withDrawer(${wrappedComponentName})`;

  return ComponentWithDrawer;
}

export default withDrawer;
