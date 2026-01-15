import { logger } from './logger';

// Maximum URL length (RFC 2616 suggests 2048 for browser compatibility)
const MAX_URL_LENGTH = 2048;

// Malicious patterns to block
const MALICIOUS_PATTERNS = [
  /javascript:/i,
  /data:/i,
  /vbscript:/i,
  /file:/i,
  /<script/i,
  /onclick/i,
  /onerror/i,
];

// Allowed protocols
const ALLOWED_PROTOCOLS = ['http:', 'https:'];

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates a URL for security and format compliance
 * @param url - The URL to validate
 * @returns ValidationResult object with isValid flag and optional error message
 */
export function validateUrl(url: string): ValidationResult {
  // Check if URL is provided
  if (!url || typeof url !== 'string') {
    return { isValid: false, error: 'URL is required' };
  }

  // Trim whitespace
  const trimmedUrl = url.trim();

  // Check length
  if (trimmedUrl.length > MAX_URL_LENGTH) {
    logger.warn(`URL validation failed: exceeds max length (${trimmedUrl.length} > ${MAX_URL_LENGTH})`);
    return { isValid: false, error: `URL exceeds maximum length of ${MAX_URL_LENGTH} characters` };
  }

  // Check for malicious patterns
  for (const pattern of MALICIOUS_PATTERNS) {
    if (pattern.test(trimmedUrl)) {
      logger.warn(`URL validation failed: malicious pattern detected in ${trimmedUrl}`);
      return { isValid: false, error: 'URL contains potentially malicious content' };
    }
  }

  // Validate URL format and protocol
  try {
    const parsedUrl = new URL(trimmedUrl);

    // Check protocol
    if (!ALLOWED_PROTOCOLS.includes(parsedUrl.protocol)) {
      logger.warn(`URL validation failed: invalid protocol ${parsedUrl.protocol}`);
      return { isValid: false, error: 'Only HTTP and HTTPS protocols are allowed' };
    }

    // Check for valid hostname
    if (!parsedUrl.hostname || parsedUrl.hostname.length === 0) {
      return { isValid: false, error: 'URL must have a valid hostname' };
    }

    return { isValid: true };
  } catch (error) {
    logger.warn(`URL validation failed: invalid format for ${trimmedUrl}`);
    return { isValid: false, error: 'Invalid URL format' };
  }
}

/**
 * Sanitizes a URL by trimming and normalizing
 * @param url - The URL to sanitize
 * @returns Sanitized URL string
 */
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return '';
  }

  // Trim whitespace
  let sanitized = url.trim();

  // Ensure protocol is present
  if (!/^https?:\/\//i.test(sanitized)) {
    sanitized = 'https://' + sanitized;
  }

  return sanitized;
}
