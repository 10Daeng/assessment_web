/**
 * Development-only logger utility
 * Prevents console statements from being output in production
 */
const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  log: (...args) => {
    if (isDevelopment) console.log(...args);
  },
  warn: (...args) => {
    if (isDevelopment) console.warn(...args);
  },
  error: (...args) => {
    // Always log errors, even in production, for debugging issues
    console.error(...args);
  },
  info: (...args) => {
    if (isDevelopment) console.info(...args);
  },
  debug: (...args) => {
    if (isDevelopment) console.debug(...args);
  },
};
