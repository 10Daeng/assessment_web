/**
 * Input sanitization utilities for preventing XSS and injection attacks
 */

/**
 * Sanitize string input by removing HTML tags and special characters
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeString(input) {
  if (typeof input !== 'string') return input;

  return input
    // Remove potentially dangerous HTML tags
    .replace(/<script[^>]*>.*?<\/script>/gi, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed[^>]*>.*?<\/embed>/gi, '')
    // Remove HTML tags (except safe tags if needed)
    .replace(/<[^>]*>/g, '')
    // Remove common XSS patterns
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    // Trim whitespace
    .trim();
}

/**
 * Validate and sanitize email input
 * @param {string} email - The email to validate
 * @returns {object} - { valid: boolean, sanitized: string, error: string }
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string' || !email.trim()) {
    return { valid: false, sanitized: '', error: 'Email is required' };
  }

  const sanitized = email.toLowerCase().trim();

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(sanitized)) {
    return { valid: false, sanitized, error: 'Invalid email format' };
  }

  // Check for suspicious patterns
  if (sanitized.includes('javascript:') || sanitized.includes('<')) {
    return { valid: false, sanitized, error: 'Invalid email format' };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize phone number input
 * @param {string} phone - The phone number to sanitize
 * @returns {object} - { valid: boolean, sanitized: string, error: string }
 */
export function sanitizePhone(phone) {
  if (typeof phone !== 'string') {
    return { valid: true, sanitized: '' };
  }

  // Remove non-digit characters except + for country code
  const sanitized = phone.replace(/[^\d+]/g, '').trim();

  // Validate phone number (basic check for Indonesian numbers)
  if (sanitized.length < 10 || sanitized.length > 15) {
    return { valid: false, sanitized, error: 'Invalid phone number format' };
  }

  return { valid: true, sanitized };
}

/**
 * Sanitize numeric input (age, scores, etc.)
 * @param {string|number} input - The numeric input
 * @param {Object} options - Validation options
 * @param {number} options.min - Minimum value
 * @param {number} options.max - Maximum value
 * @returns {object} - { valid: boolean, sanitized: number, error: string }
 */
export function sanitizeNumber(input, options = {}) {
  const { min = 0, max = 150 } = options;

  const num = Number(input);

  if (isNaN(num)) {
    return { valid: false, sanitized: 0, error: 'Invalid number format' };
  }

  if (num < min || num > max) {
    return { valid: false, sanitized: num, error: `Value must be between ${min} and ${max}` };
  }

  return { valid: true, sanitized: num };
}

/**
 * Sanitize object by recursively sanitizing all string values
 * @param {Object} obj - The object to sanitize
 * @returns {Object} - Sanitized object
 */
export function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const sanitized = {};

  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

/**
 * Sanitize user data object with field-specific validation
 * @param {Object} userData - User data to sanitize
 * @returns {Object} - Sanitized user data with validation errors
 */
export function sanitizeUserData(userData) {
  const errors = {};
  const sanitized = {};

  // Validate name
  if (userData.name) {
    const sanitizedName = sanitizeString(userData.name);
    if (!sanitizedName || sanitizedName.length < 2) {
      errors.name = 'Name must be at least 2 characters';
    } else if (sanitizedName.length > 100) {
      errors.name = 'Name must be less than 100 characters';
    } else {
      sanitized.name = sanitizedName;
    }
  }

  // Validate email
  if (userData.email) {
    const emailResult = sanitizeEmail(userData.email);
    if (!emailResult.valid) {
      errors.email = emailResult.error;
    } else {
      sanitized.email = emailResult.sanitized;
    }
  }

  // Validate phone (optional)
  if (userData.phone) {
    const phoneResult = sanitizePhone(userData.phone);
    if (!phoneResult.valid) {
      errors.phone = phoneResult.error;
    } else {
      sanitized.phone = phoneResult.sanitized;
    }
  }

  // Validate age (optional)
  if (userData.age) {
    const ageResult = sanitizeNumber(userData.age, { min: 10, max: 100 });
    if (!ageResult.valid) {
      errors.age = ageResult.error;
    } else {
      sanitized.age = ageResult.sanitized;
    }
  }

  // Validate other string fields
  const stringFields = ['instansi', 'pekerjaan', 'jabatan'];
  stringFields.forEach(field => {
    if (userData[field]) {
      const sanitizedValue = sanitizeString(userData[field]);
      if (sanitizedValue.length > 200) {
        errors[field] = `${field} must be less than 200 characters`;
      } else {
        sanitized[field] = sanitizedValue;
      }
    }
  });

  return {
    sanitized,
    errors,
    isValid: Object.keys(errors).length === 0
  };
}

/**
 * Validate and sanitize assessment answers
 * @param {Object} answers - Assessment answers
 * @param {Object} schema - Answer schema for validation
 * @returns {Object} - Validation result
 */
export function sanitizeAnswers(answers, schema) {
  const errors = [];
  const sanitized = {};

  for (const [key, value] of Object.entries(answers)) {
    const fieldSchema = schema[key];

    // Check if field is expected
    if (!fieldSchema) {
      continue; // Skip unknown fields
    }

    // Validate type
    if (fieldSchema.type === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (fieldSchema.type === 'number') {
      const numResult = sanitizeNumber(value, fieldSchema.constraints);
      if (!numResult.valid) {
        errors.push(`${key}: ${numResult.error}`);
      } else {
        sanitized[key] = numResult.sanitized;
      }
    } else if (fieldSchema.type === 'choice') {
      if (!fieldSchema.options.includes(value)) {
        errors.push(`${key}: Invalid choice`);
      } else {
        sanitized[key] = value;
      }
    } else {
      sanitized[key] = value;
    }
  }

  return {
    sanitized,
    errors,
    isValid: errors.length === 0
  };
}