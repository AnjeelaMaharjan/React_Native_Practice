import React from 'react';
import { Redirect } from 'expo-router';

/**
 * Route: Root Redirect.
 * Redirects the app root routing directly to the tabs main screen.
 */
export default function Index() {
  return (
    <>
    <Redirect href={"/(drawer)/(tabs)" as any} />
    </>
  );
}
