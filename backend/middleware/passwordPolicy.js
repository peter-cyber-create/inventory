const bcrypt = require('bcrypt');

/**
 * Password Policy Enforcement
 * Validates passwords against government security standards
 */

// Password requirements
const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  maxLength: 128,
  preventCommonPasswords: true,
  preventUsernameInPassword: true
};

// Common weak passwords to prevent
const COMMON_PASSWORDS = [
  'password', 'password123', 'admin', 'admin123', '12345678',
  'qwerty', 'letmein', 'welcome', 'monkey', '1234567890',
  'password1', 'Password1', 'P@ssw0rd', 'P@ssw0rd1'
];

/**
 * Validate password against policy
 * @param {string} password - Password to validate
 * @param {string} username - Username (to check if password contains username)
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
const validatePassword = (password, username = '') => {
  const errors = [];

  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Password is required'] };
  }

  // Check minimum length
  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(`Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`);
  }

  // Check maximum length
  if (password.length > PASSWORD_REQUIREMENTS.maxLength) {
    errors.push(`Password must be no more than ${PASSWORD_REQUIREMENTS.maxLength} characters long`);
  }

  // Check for uppercase
  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  // Check for lowercase
  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  // Check for numbers
  if (PASSWORD_REQUIREMENTS.requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  // Check for special characters
  if (PASSWORD_REQUIREMENTS.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*()_+-=[]{}|;:,.<>?)');
  }

  // Check if password contains username
  if (PASSWORD_REQUIREMENTS.preventUsernameInPassword && username && password.toLowerCase().includes(username.toLowerCase())) {
    errors.push('Password cannot contain your username');
  }

  // Check for common passwords
  if (PASSWORD_REQUIREMENTS.preventCommonPasswords) {
    const lowerPassword = password.toLowerCase();
    if (COMMON_PASSWORDS.some(common => lowerPassword === common.toLowerCase())) {
      errors.push('Password is too common. Please choose a more secure password');
    }
  }

  // Check for repeated characters (e.g., "aaaaaa")
  if (/(.)\1{3,}/.test(password)) {
    errors.push('Password cannot contain the same character repeated more than 3 times');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

/**
 * Check if password has been used recently
 * @param {string} hashedPassword - New hashed password
 * @param {Array} passwordHistory - Array of previous password hashes
 * @returns {boolean} - True if password was recently used
 */
const checkPasswordHistory = async (hashedPassword, passwordHistory = []) => {
  for (const oldHash of passwordHistory) {
    const isMatch = await bcrypt.compare(hashedPassword, oldHash);
    if (isMatch) {
      return true; // Password was used before
    }
  }
  return false; // Password is new
};

/**
 * Calculate password strength score (0-100)
 * @param {string} password - Password to score
 * @returns {Object} - { score: number, strength: string, feedback: string[] }
 */
const calculatePasswordStrength = (password) => {
  let score = 0;
  const feedback = [];

  if (!password) {
    return { score: 0, strength: 'Very Weak', feedback: ['Password is required'] };
  }

  // Length scoring
  if (password.length >= 12) score += 20;
  else if (password.length >= 8) score += 10;
  else feedback.push('Use at least 12 characters for better security');

  if (password.length >= 16) score += 10;
  if (password.length >= 20) score += 5;

  // Character variety scoring
  if (/[a-z]/.test(password)) score += 5;
  if (/[A-Z]/.test(password)) score += 5;
  if (/[0-9]/.test(password)) score += 5;
  if (/[^a-zA-Z0-9]/.test(password)) score += 10;

  // Pattern detection (penalties)
  if (/(.)\1{2,}/.test(password)) {
    score -= 10;
    feedback.push('Avoid repeating characters');
  }

  if (/12345|abcde|qwerty/i.test(password)) {
    score -= 15;
    feedback.push('Avoid common sequences');
  }

  // Determine strength level
  let strength;
  if (score >= 80) strength = 'Very Strong';
  else if (score >= 60) strength = 'Strong';
  else if (score >= 40) strength = 'Moderate';
  else if (score >= 20) strength = 'Weak';
  else strength = 'Very Weak';

  return { score: Math.max(0, Math.min(100, score)), strength, feedback };
};

/**
 * Middleware to validate password in request body
 */
const validatePasswordMiddleware = (req, res, next) => {
  const password = req.body.password || req.body.newPassword;
  const username = req.body.username || req.user?.username || '';

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is required'
    });
  }

  const validation = validatePassword(password, username);

  if (!validation.valid) {
    return res.status(400).json({
      status: 'error',
      message: 'Password does not meet security requirements',
      errors: validation.errors
    });
  }

  // Add password strength to request for logging
  req.passwordStrength = calculatePasswordStrength(password);

  next();
};

/**
 * Check if user needs to change password
 * @param {Date} lastPasswordChange - Date of last password change
 * @param {number} maxAgeDays - Maximum age in days (default 90)
 * @returns {boolean} - True if password needs to be changed
 */
const needsPasswordChange = (lastPasswordChange, maxAgeDays = 90) => {
  if (!lastPasswordChange) return true; // Never changed, must change
  
  const daysSinceChange = Math.floor(
    (Date.now() - new Date(lastPasswordChange).getTime()) / (1000 * 60 * 60 * 24)
  );
  
  return daysSinceChange >= maxAgeDays;
};

module.exports = {
  PASSWORD_REQUIREMENTS,
  validatePassword,
  checkPasswordHistory,
  calculatePasswordStrength,
  validatePasswordMiddleware,
  needsPasswordChange
};



