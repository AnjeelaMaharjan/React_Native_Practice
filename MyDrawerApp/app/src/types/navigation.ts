import { DrawerNavigationProp } from '@react-navigation/drawer';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Define your drawer screens here
export type DrawerParamList = {
  index: undefined;
  profile: { userId?: string };
  settings: undefined;
};

// Define navigation types
export type DrawerNavigationType = DrawerNavigationProp<DrawerParamList>;

// Route props type
export type DrawerRouteProps<T extends keyof DrawerParamList> = RouteProp<
  DrawerParamList,
  T
>;

// Safe area insets type
export interface SafeAreaInsets {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

// Drawer state type
export interface DrawerState {
  isOpen: boolean;
  orientation: 'portrait' | 'landscape';
}