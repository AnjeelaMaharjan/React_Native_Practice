import { StyleSheet } from 'react-native';

/**
 * Stylesheet for the animated, responsive, multi-position Drawer component.
 * Uses vanilla React Native StyleSheet for maximum performance and native thread smoothness.
 */
export const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 10000,
  },
  drawerPanel: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    zIndex: 10001,
    // Premium shadow styling
    shadowColor: '#000000',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 24,
  },
  // Position Specific Anchor Alignments
  leftPanel: {
    left: 0,
    top: 0,
    bottom: 0,
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
  rightPanel: {
    right: 0,
    top: 0,
    bottom: 0,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  topPanel: {
    top: 0,
    left: 0,
    right: 0,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  bottomPanel: {
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  // Inner container to ensure safety padding
  contentContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default styles;
