/**
 * HOC: withLoader
 *
 * WHAT IT DOES:
 *   Intercepts the `isLoading` prop.
 *   → If true  : shows a full-screen spinner instead of the component.
 *   → If false : renders the wrapped component normally.
 *
 * WHY WE NEED IT:
 *   Every data-fetching screen needs the same "show spinner while loading"
 *   pattern. Instead of adding an if-block to every component, the HOC
 *   handles it once and is reused everywhere.
 *
 * USAGE:
 *   const UserListWithLoader = withLoader(UserList);
 *   <UserListWithLoader isLoading={isFetching} data={users} />
 *
 * FLOW:
 *   withLoader(UserList)
 *     └─ returns <WithLoaderWrapper isLoading={...} ...rest>
 *           ├─ isLoading=true  → <ActivityIndicator />
 *           └─ isLoading=false → <UserList data={...} />
 */

import React, { ComponentType } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WithLoaderProps } from './types';

// T = all other props the wrapped component needs
function withLoader<T extends object>(
  WrappedComponent: ComponentType<T>,
): ComponentType<T & WithLoaderProps> {

  const WithLoaderWrapper = ({ isLoading = false, ...rest }: T & WithLoaderProps) => {

    // ── Decision point ──────────────────────────────────────────
    if (isLoading) {
      return (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200ee" />
        </View>
      );
    }

    // `rest` contains all props except `isLoading` — pass them straight through
    return <WrappedComponent {...(rest as T)} />;
  };

  WithLoaderWrapper.displayName = `WithLoader(${
    WrappedComponent.displayName ?? WrappedComponent.name ?? 'Component'
  })`;

  return WithLoaderWrapper;
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
});

export default withLoader;
