import { NextResponse } from 'next/server';

// In-memory store for rate limiting
const requestCounts = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const MAX_REQUESTS = 10; // Max requests per minute

/**
 * Cleanup old entries from the request count map
 */
function cleanupOldEntries() {
  const now = Date.now();
  for (const [key, value] of requestCounts.entries()) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW) {
      requestCounts.delete(key);
    }
  }
}

/**
 * Rate limiting middleware for API routes
 * @param {Request} req - The Next.js request object
 * @param {Object} options - Rate limiting options
 * @param {number} options.windowMs - Time window in milliseconds (default: 1 minute)
 * @param {number} options.maxRequests - Maximum requests per window (default: 10)
 * @returns {Object} - Rate limit response or null if allowed
 */
export function rateLimit(req, options = {}) {
  const windowMs = options.windowMs || RATE_LIMIT_WINDOW;
  const maxRequests = options.maxRequests || MAX_REQUESTS;

  // Get client identifier (IP address)
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0] ||
              req.headers.get('x-real-ip') ||
              'unknown';

  const key = `${ip}-${req.nextUrl.pathname}`;

  // Cleanup old entries periodically
  cleanupOldEntries();

  // Get current count
  const now = Date.now();
  const current = requestCounts.get(key) || { count: 0, timestamp: now };

  // Check if within time window
  if (now - current.timestamp > windowMs) {
    // Reset counter
    requestCounts.set(key, { count: 1, timestamp: now });
    return null;
  }

  // Increment counter
  current.count++;

  // Check if limit exceeded
  if (current.count > maxRequests) {
    requestCounts.set(key, current);
    return {
      success: false,
      error: 'Too many requests',
      retryAfter: Math.ceil((current.timestamp + windowMs - now) / 1000)
    };
  }

  // Update count
  requestCounts.set(key, current);
  return null;
}

/**
 * Wrapper for API routes with rate limiting
 * @param {Function} handler - The API route handler
 * @param {Object} options - Rate limiting options
 * @returns {Function} - Wrapped handler
 */
export function withRateLimit(handler, options = {}) {
  return async (req, ...args) => {
    const limitCheck = rateLimit(req, options);

    if (limitCheck) {
      return NextResponse.json(
        {
          success: false,
          error: limitCheck.error,
          retryAfter: limitCheck.retryAfter
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.maxRequests || MAX_REQUESTS.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + limitCheck.retryAfter * 1000).toISOString(),
            'Retry-After': limitCheck.retryAfter.toString()
          }
        }
      );
    }

    return handler(req, ...args);
  };
}

/**
 * Stricter rate limiting for authentication endpoints
 */
export function authRateLimit(req) {
  return rateLimit(req, {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5 // Max 5 login attempts
  });
}

/**
 * Stricter rate limiting for payment endpoints
 */
export function paymentRateLimit(req) {
  return rateLimit(req, {
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 3 // Max 3 payment attempts
  });
}