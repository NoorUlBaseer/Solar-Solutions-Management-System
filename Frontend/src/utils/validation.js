export const passwordValidation = {
  minLength: 8,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
};

export const validatePassword = (password) => {
  const errors = [];

  if (password.length < passwordValidation.minLength) {
    errors.push(`Password must be at least ${passwordValidation.minLength} characters`);
  }

  if (passwordValidation.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (passwordValidation.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (passwordValidation.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (passwordValidation.requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return errors;
};