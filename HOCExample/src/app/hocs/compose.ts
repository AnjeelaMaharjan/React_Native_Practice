/**
 * Utility: compose
 *
 * WHAT IT DOES:
 *   Combines multiple HOCs into one. Applies them right-to-left
 *   (innermost wraps first, just like nested function calls).
 *
 * WHY WE NEED IT:
 *   Nesting HOCs by hand becomes unreadable fast:
 *     withAuth(withTheme(withLoader(MyScreen)))   ← hard to read
 *
 *   With compose:
 *     const enhance = compose(withAuth, withTheme, withLoader);
 *     const MyScreen = enhance(BaseScreen);        ← clean & scalable
 *
 * USAGE:
 *   import { compose } from './compose';
 *   import withAuth   from './withAuth';
 *   import withTheme  from './withTheme';
 *   import withLoader from './withLoader';
 *
 *   const enhance      = compose(withAuth, withTheme, withLoader);
 *   const EnhancedPage = enhance(BasePage);
 *   //  EnhancedPage = withAuth(withTheme(withLoader(BasePage)))
 *
 * ORDER MATTERS:
 *   The first HOC in the array is the OUTERMOST wrapper.
 *   So compose(withAuth, withTheme) means:
 *     - withAuth wraps first  → checks login
 *     - withTheme wraps next  → adds theme
 */

import { ComponentType } from 'react';

// Generic "HOC" type: takes a component, returns a (possibly different) component
type HOC<TIn, TOut = TIn> = (component: ComponentType<TIn>) => ComponentType<TOut>;

/**
 * compose(...hocs)(Component)
 *
 * Uses reduceRight so the last HOC in the list is the innermost wrapper.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function compose(...hocs: Array<HOC<any, any>>) {
  return function <T>(Component: ComponentType<T>): ComponentType<any> {
    return hocs.reduceRight(
      (acc, hoc) => hoc(acc),
      Component as ComponentType<any>,
    );
  };
}

/**
 * getDisplayName
 *
 * Helper used by HOCs to produce readable names in React DevTools.
 * "WithTheme(WithLoader(MyScreen))"
 */
export function getDisplayName(component: ComponentType<unknown>): string {
  return component.displayName ?? component.name ?? 'Component';
}

export default compose;
