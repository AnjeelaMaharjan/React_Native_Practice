import { useContext } from 'react';
import { CounterContext, CounterState } from '../context/CounterContext';

/**
 * Custom hook interfacing with CounterContext.
 * Isolates component UI from direct dispatch operations and enforces hook context presence.
 */
export const useCounter = () => {
  const context = useContext(CounterContext);

  if (!context) {
    throw new Error('useCounter must be used within a CounterProvider');
  }

  const { state, dispatch } = context;

  const increment = (): void => {
    dispatch({ type: 'INCREMENT' });
  };

  const decrement = (): void => {
    dispatch({ type: 'DECREMENT' });
  };

  const reset = (): void => {
    dispatch({ type: 'RESET' });
  };

  const setCount = (val: number): void => {
    dispatch({ type: 'SET_COUNT', payload: val });
  };

  return {
    count: state.count,
    message: state.message,
    lastAction: state.lastAction,
    timestamp: state.timestamp,
    increment,
    decrement,
    reset,
    setCount,
  };
};
