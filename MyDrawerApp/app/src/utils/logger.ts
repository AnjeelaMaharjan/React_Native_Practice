/**
 * Safe logging utility
 * Prevents sensitive data from being logged in production
 */

enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

const currentLogLevel = __DEV__ ? LogLevel.DEBUG : LogLevel.WARN;

export const logger = {
  debug: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  },
  info: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.INFO) {
      console.log('[INFO]', ...args);
    }
  },
  warn: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.WARN) {
      console.warn('[WARN]', ...args);
    }
  },
  error: (...args: any[]) => {
    if (currentLogLevel <= LogLevel.ERROR) {
      console.error('[ERROR]', ...args);
    }
  },
};

// Sanitize sensitive data
export const sanitizeData = (data: any): any => {
  if (typeof data !== 'object' || data === null) {
    return data;
  }
  
  const sanitized = { ...data };
  const sensitiveKeys = ['password', 'token', 'secret', 'apiKey', 'ssn'];
  
  sensitiveKeys.forEach(key => {
    if (key in sanitized) {
      sanitized[key] = '***REDACTED***';
    }
  });
  
  return sanitized;
};