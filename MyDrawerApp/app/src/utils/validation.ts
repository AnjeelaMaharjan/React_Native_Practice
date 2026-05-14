/**
 * Validation utilities
 * Type-safe validation functions
 */

export const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export const isValidPassword = (password: string): boolean => {
    // Password must be at least 8 characters, contain at least one uppercase letter, one lowercase letter, and one number
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

export const isValidPhoneNumber = (phone: string): boolean => {
    // Simple regex for validating phone numbers (can be improved for specific formats)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    return phoneRegex.test(phone);
}

export const isEmptyObject = (obj: Record<string, unknown>): boolean => {
    return Object.keys(obj).length === 0;// Check if the object has no own properties
};

export const isValidUrl = (url: string): boolean => {
    try{
        new URL(url);
        return true;}
    catch{
        return false;
    }
};

/**
 * Validation types
 */
export type ValidationResult = {
  isValid: boolean;
  errors: Record<string, string>;
};

export const createValidationError = (field: string, message: string): ValidationResult => ({
  isValid: false,
  errors: { [field]: message },
});