import React, { ComponentType } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useDrawerContext } from '../../context/DrawerContext';
import DrawerContent from './DrawerContent';
import { COLORS } from '../../styles/index';

export const withDrawer = <P extends object>(Component: ComponentType<P>): React.FC<P> => {
  const WithDrawer: React.FC<P> = (props) => {
    const { isOpen, closeDrawer } = useDrawerContext();
    return (
      <View style={styles.container}>
        <View style={[styles.content, isOpen && styles.contentShifted]}>
          <Component {...props} />
        </View>
        {isOpen && <TouchableOpacity style={styles.overlay} onPress={closeDrawer} activeOpacity={1} />}
        {isOpen && (
          <View style={styles.drawerPanel}>
            <DrawerContent onClose={closeDrawer} />
          </View>
        )}
      </View>
    );
  };

  WithDrawer.displayName = `withDrawer(${Component.displayName || Component.name || 'Component'})`;

  return WithDrawer;
};

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: 'row', backgroundColor: COLORS.white },
  content: { flex: 1, opacity: 1 },
  contentShifted: { opacity: 0.5 },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0, 0, 0, 0.3)', zIndex: 10 },
  drawerPanel: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '75%', maxWidth: 300, backgroundColor: COLORS.white, elevation: 5, shadowColor: COLORS.black, shadowOpacity: 0.25, shadowRadius: 3.84, shadowOffset: { width: 0, height: 2 }, zIndex: 20 },
});

export default withDrawer;