import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions, TouchableOpacity, BackHandler } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import { useDrawerContext } from '../../context/DrawerContext';
import CustomDrawerContent from './CustomDrawerContent';
import { COLORS } from '@/styles/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const DRAWER_WIDTH = Math.min(SCREEN_WIDTH * 0.75, 300);

interface SlidingDrawerProps {
  children: React.ReactNode;
}

/**
 * Organism: SlidingDrawer.
 * Wraps content layout to animate screen translation and scale in response to Drawer Context state.
 * Implemented using Reanimated 3 worklets for zero-thread-blocking animations.
 */
export const SlidingDrawer: React.FC<SlidingDrawerProps> = ({ children }) => {
  const { isOpen, side, closeDrawer } = useDrawerContext();
  const progress = useSharedValue(0);

  // Synchronize Reanimated shared value when context updates
  useEffect(() => {
    progress.value = withSpring(isOpen ? 1 : 0, {
      damping: 18,
      stiffness: 120,
      mass: 0.8,
    });
  }, [isOpen, progress]);

  // Handle hardware Back button press on Android devices
  useEffect(() => {
    const handleBackButton = () => {
      if (isOpen) {
        closeDrawer();
        return true;
      }
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    return () => {
      subscription.remove();
    };
  }, [isOpen, closeDrawer]);

  // 1. Screen scale & translation animations
  const animatedContentStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [1, 0.95]);
    const borderRadius = interpolate(progress.value, [0, 1], [0, 16]);
    
    // Shift screen content in the opposite direction of the drawer opening side
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [0, side === 'left' ? DRAWER_WIDTH * 0.3 : -DRAWER_WIDTH * 0.3]
    );

    return {
      transform: [{ translateX }, { scale }],
      borderRadius,
      overflow: 'hidden',
    };
  });

  // 2. Backdrop fade and pointer events
  const animatedOverlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(progress.value, [0, 1], [0, 0.45]);
    return {
      opacity,
    };
  });

  // 3. Sliding Drawer panel translations (handles LTR/RTL dynamically)
  const animatedDrawerStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      progress.value,
      [0, 1],
      [
        side === 'left' ? -DRAWER_WIDTH - 20 : SCREEN_WIDTH + 20, // offscreen
        side === 'left' ? 0 : SCREEN_WIDTH - DRAWER_WIDTH,      // onscreen
      ]
    );

    return {
      transform: [{ translateX }],
    };
  });

  return (
    <View style={styles.container}>
      {/* Underlying Canvas Base (Drawer is exposed from behind if scaling) */}
      <View style={[styles.canvasBackground, { backgroundColor: COLORS.gray[900] }]} />

      {/* Primary Screen Content Wrapper */}
      <Animated.View style={[styles.mainContent, animatedContentStyle]}>
        {children}
        
        {/* Dynamic Tap-to-Close Backdrop Layer */}
        {isOpen && (
          <TouchableOpacity
            style={StyleSheet.absoluteFillObject}
            activeOpacity={1}
            onPress={closeDrawer}
          >
            <Animated.View style={[styles.overlay, animatedOverlayStyle]} />
          </TouchableOpacity>
        )}
      </Animated.View>

      {/* Floating Animated Drawer Panel */}
      <Animated.View
        style={[
          styles.drawerPanel,
          { width: DRAWER_WIDTH },
          animatedDrawerStyle,
          side === 'left' ? { left: 0 } : { right: 0 },
        ]}
      >
        <CustomDrawerContent onClose={closeDrawer} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  canvasBackground: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  mainContent: {
    flex: 1,
    backgroundColor: COLORS.white,
    zIndex: 1,
    elevation: 10,
    shadowColor: COLORS.black,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.black,
    zIndex: 99,
  },
  drawerPanel: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: COLORS.white,
    zIndex: 100,
    elevation: 16,
    shadowColor: COLORS.black,
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 4, height: 0 },
  },
});

export default SlidingDrawer;
