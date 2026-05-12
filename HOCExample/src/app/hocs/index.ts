// ── Barrel export ──────────────────────────────────────────────
// Import everything from ONE place:
//   import { withTheme, withLoader, withAuth, compose } from '../hocs';

export { default as withTheme }  from './withTheme';
export { default as withLoader } from './withLoader';
export { default as withAuth }   from './withAuth';
export { compose, getDisplayName } from './compose';
export type { Theme, WithThemeProps, WithLoaderProps, WithAuthProps, User } from './types';
