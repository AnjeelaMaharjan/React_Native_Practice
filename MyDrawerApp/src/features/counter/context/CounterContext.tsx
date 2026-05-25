import React, { createContext, useReducer, useContext, Dispatch } from 'react';
import { logger } from '@/utils/logger';

// ==========================================
// 1. Define Counter State and Action Types
// ==========================================

export interface CounterState {
  count: number;
  message: string;
  lastAction: string;
  timestamp: string;
}

export type CounterAction =
  | { type: 'INCREMENT' }
  | { type: 'DECREMENT' }
  | { type: 'RESET' }
  | { type: 'SET_COUNT'; payload: number };

// ==========================================
// 2. Define Initial State
// ==========================================

const initialState: CounterState = {
  count: 0,
  message: 'Counter initialized. Ready to count!',
  lastAction: 'INIT',
  timestamp: new Date().toISOString(),
};

// ==========================================
// 3. Implements the Reducer with logs
// ==========================================

/**
 * Reducer function managing Counter state transitions.
 * Evaluates state updates and logs transition parameters for production transparency.
 */
const counterReducer = (state: CounterState, action: CounterAction): CounterState => {
  const timestamp = new Date().toLocaleTimeString();
  let newState: CounterState;

  switch (action.type) {
    case 'INCREMENT':
      newState = {
        count: state.count + 1,
        message: `Incremented count to ${state.count + 1}`,
        lastAction: 'INCREMENT',
        timestamp,
      };
      break;
    case 'DECREMENT':
      newState = {
        count: state.count - 1,
        message: `Decremented count to ${state.count - 1}`,
        lastAction: 'DECREMENT',
        timestamp,
      };
      break;
    case 'RESET':
      newState = {
        count: 0,
        message: 'Counter reset to zero',
        lastAction: 'RESET',
        timestamp,
      };
      break;
    case 'SET_COUNT':
      newState = {
        count: action.payload,
        message: `Count set manually to ${action.payload}`,
        lastAction: 'SET_COUNT',
        timestamp,
      };
      break;
    default:
      return state;
  }

  // Developer transition logs demonstrating centralized logging practices
  logger.info(`[CounterReducer] Action: ${action.type} | Transition: ${state.count} -> ${newState.count} at ${timestamp}`);
  return newState;
};

// ==========================================
// 4. Define Context & Provider
// ==========================================

interface CounterContextType {
  state: CounterState;
  dispatch: Dispatch<CounterAction>;
}

const CounterContext = createContext<CounterContextType | undefined>(undefined);

/**
 * Provider component wrapping Counter context.
 * Utilizes useReducer to centralize modification rules.
 */
export const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(counterReducer, initialState);

  return (
    <CounterContext.Provider value={{ state, dispatch }}>
      {children}
    </CounterContext.Provider>
  );
};

export { CounterContext };
