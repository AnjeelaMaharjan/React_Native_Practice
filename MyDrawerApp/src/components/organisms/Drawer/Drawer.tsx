import React, { useEffect } from 'react';
import {
  View,
  useWindowDimensions,
  TouchableOpacity,
  BackHandler,
  StyleProp,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { styles } from './styles/styles';

export type DrawerPosition = 'top' | 'bottom' | 'left' | 'right';

export interface DrawerProps {
  /**
   * Visibility state of the drawer panel.
   */
  isOpen: boolean;

  /**
   * Callback function triggered when the drawer is requested to close
   * (e.g. through clicking the backdrop overlay or pressing the Android hardware back button).
   */
  onClose: () => void;

  /**
   * Placement position of the drawer.
   * @default 'left'
   */
  position?: DrawerPosition;

  /**
   * Custom width of the drawer (applicable for 'left' and 'right' positions).
   * If not provided, it falls back to a responsive, screen-width-dependent value.
   */
  width?: number | string;

  /**
   * Custom height of the drawer (applicable for 'top' and 'bottom' positions).
   * If not provided, it falls back to a responsive, screen-height-dependent value.
   */
  height?: number | string;

  /**
   * Render function or node for the content inside the drawer panel.
   */
  renderContent: () => React.ReactNode;

  /**
   * Children components representing the primary screen content.
   * If provided, the drawer wraps these components and applies backdrop/zoom effects.
   */
  children?: React.ReactNode;

  /**
   * Background color of the backdrop overlay.
   * @default 'rgba(0, 0, 0, 1)' (opacity is managed via backdropOpacity)
   */
  backdropColor?: string;

  /**
   * Maximum opacity of the backdrop overlay when the drawer is fully open.
   * @default 0.5
   */
  backdropOpacity?: number;

  /**
   * Enables the 3D-like zoom & scale translation effect on the main screen content.
   * @default false
   */
  enableZoomEffect?: boolean;

  /**
   * Accessibility label for screen reader users on the drawer wrapper.
   * @default 'Side Navigation Drawer'
   */
  accessibilityLabel?: string;

  /**
   * Custom styles applied to the drawer panel.
   */
  style?: StyleProp<ViewStyle>;
}

/**
 * Organism: Drawer.
 * A premium, fully responsive, and accessible drawer component supporting all 4 positions
 * (top, bottom, left, right) with high-performance animations powered by Reanimated.
 */
export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  position = 'left',
  width,
  height,
  renderContent,
  children,
  backdropColor = '#000000',
  backdropOpacity = 0.5,
  enableZoomEffect = false,
  accessibilityLabel = 'Navigation Drawer',
  style,
}) => {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const progress = useSharedValue(0);

  // Responsive Drawer Dimension Calculations
  const isHorizontal = position === 'left' || position === 'right';
  
  // Calculate dynamic responsive size
  const getResponsiveSize = () => {
    if (isHorizontal) {
      if (width !== undefined) {
        return typeof width === 'number' ? width : parseFloat(width) * 0.01 * screenWidth;
      }
      // Defaults
      if (screenWidth < 768) return Math.min(screenWidth * 0.8, 300); // Mobile
      if (screenWidth < 1024) return 360; // Tablet
      return 400; // Desktop/Web
    } else {
      if (height !== undefined) {
        return typeof height === 'number' ? height : parseFloat(height) * 0.01 * screenHeight;
      }
      // Defaults
      if (screenHeight < 768) return Math.min(screenHeight * 0.5, 320); // Mobile
      return 360; // Tablet & Desktop
    }
  };

  const drawerSize = getResponsiveSize();

  // Sync Reanimated shared value with state
  useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, {
      damping: 22,
      stiffness: 150,
      mass: 0.9,
    });
  }, [isOpen, progress]);

  // Handle hardware Back button on Android
  useEffect(() => {
    const handleBackPress = () => {
      if (isOpen) {
        onClose();
        return true;
      }
      return false;
    };

    const backHandlerSubscription = BackHandler.addEventListener(
      'hardwareBackPress',
      handleBackPress
    );

    return () => {
      backHandlerSubscription.remove();
    };
  }, [isOpen, onClose]);

  // 1. Animated style for the backdrop overlay
  const animatedBackdropStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, backdropOpacity]);
    return {
      opacity,
      backgroundColor: backdropColor,
    };
  });

  // 2. Animated style for the drawer panel translation (off-screen -> on-screen)
  const animatedDrawerStyle = useAnimatedStyle(() => {
    let translateX = 0;
    let translateY = 0;

    if (position === 'left') {
      translateX = interpolate(progress.value, [0, 1], [-drawerSize - 30, 0]);
    } else if (position === 'right') {
      translateX = interpolate(progress.value, [0, 1], [drawerSize + 30, 0]);
    } else if (position === 'top') {
      translateY = interpolate(progress.value, [0, 1], [-drawerSize - 30, 0]);
    } else if (position === 'bottom') {
      translateY = interpolate(progress.value, [0, 1], [drawerSize + 30, 0]);
    }

    return {
      transform: isHorizontal ? [{ translateX }] : [{ translateY }],
    };
  });

  // 3. Optional Animated style for screen content (zoom, border radius, translation)
  const animatedScreenStyle = useAnimatedStyle(() => {
    if (!enableZoomEffect) {
      return {
        transform: [{ scale: 1 }, { translateX: 0 }, { translateY: 0 }],
        borderRadius: 0,
      };
    }

    const scale = interpolate(progress.value, [0, 1], [1, 0.95]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 16]);

    let translateX = 0;
    let translateY = 0;

    if (position === 'left') {
      translateX = interpolate(progress.value, [0, 1], [0, drawerSize * 0.25]);
    } else if (position === 'right') {
      translateX = interpolate(progress.value, [0, 1], [0, -drawerSize * 0.25]);
    } else if (position === 'top') {
      translateY = interpolate(progress.value, [0, 1], [0, drawerSize * 0.25]);
    } else if (position === 'bottom') {
      translateY = interpolate(progress.value, [0, 1], [0, -drawerSize * 0.25]);
    }

    return {
      transform: [{ scale }, { translateX }, { translateY }],
      borderRadius,
      overflow: 'hidden',
    };
  });

  const getPositionStyle = () => {
    switch (position) {
      case 'right':
        return styles.rightPanel;
      case 'top':
        return styles.topPanel;
      case 'bottom':
        return styles.bottomPanel;
      case 'left':
      default:
        return styles.leftPanel;
    }
  };

  const getDimensionStyle = () => {
    if (isHorizontal) {
      return { width: drawerSize };
    }
    return { height: drawerSize };
  };

  // If no children (screen content) is provided, render overlay on top of current view tree
  const renderDrawerPanel = () => (
    <Animated.View
      style={[
        styles.drawerPanel,
        getPositionStyle(),
        getDimensionStyle(),
        animatedDrawerStyle,
        style,
      ]}
      accessibilityRole="summary"
      accessibilityViewIsModal={isOpen}
      importantForAccessibility={isOpen ? 'yes' : 'no-hide-descendants'}
      accessibilityLabel={accessibilityLabel}
    >
      <View style={styles.contentContainer}>
        {renderContent()}
      </View>
    </Animated.View>
  );

  return (
    <View style={styles.container} pointerEvents={isOpen ? 'auto' : 'box-none'}>
      {/* Primary Screen Content */}
      {children && (
        <Animated.View style={[{ flex: 1 }, animatedScreenStyle]}>
          {children}
        </Animated.View>
      )}

      {/* Backdrop overlay layer */}
      {isOpen && (
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close Drawer Backdrop"
          accessibilityHint="Double tap to close the open panel"
        >
          <Animated.View style={[{ flex: 1 }, animatedBackdropStyle]} />
        </TouchableOpacity>
      )}

      {/* Floating Animated Drawer Panel */}
      {renderDrawerPanel()}
    </View>
  );
};

export default Drawer;
