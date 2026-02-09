/**
 * Validation utilities for form inputs
 */

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

/**
 * Validate email address
 */
export function validateEmail(email: string): ValidationResult {
    if (!email || email.trim().length === 0) {
        return { isValid: false, error: 'Email is required' };
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { isValid: false, error: 'Please enter a valid email address' };
    }

    return { isValid: true };
}

/**
 * Validate phone number
 */
export function validatePhone(phone: string): ValidationResult {
    if (!phone || phone.trim().length === 0) {
        return { isValid: false, error: 'Phone number is required' };
    }

    // Allow digits, spaces, +, -, (, )
    const phoneRegex = /^[\d\s\+\-\(\)]+$/;
    if (!phoneRegex.test(phone)) {
        return { isValid: false, error: 'Please enter a valid phone number' };
    }

    if (phone.replace(/[^\d]/g, '').length < 8) {
        return { isValid: false, error: 'Phone number must be at least 8 digits' };
    }

    if (phone.length > 20) {
        return { isValid: false, error: 'Phone number is too long' };
    }

    return { isValid: true };
}

/**
 * Validate postal code
 */
export function validatePostalCode(postalCode: string): ValidationResult {
    if (!postalCode || postalCode.trim().length === 0) {
        return { isValid: false, error: 'Postal code is required' };
    }

    if (postalCode.length < 4) {
        return { isValid: false, error: 'Postal code must be at least 4 characters' };
    }

    if (postalCode.length > 10) {
        return { isValid: false, error: 'Postal code cannot exceed 10 characters' };
    }

    return { isValid: true };
}

/**
 * Validate required text field
 */
export function validateRequired(
    value: string,
    fieldName: string,
    minLength: number = 1,
    maxLength: number = 255
): ValidationResult {
    if (!value || value.trim().length === 0) {
        return { isValid: false, error: `${fieldName} is required` };
    }

    if (value.length < minLength) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${minLength} characters`,
        };
    }

    if (value.length > maxLength) {
        return {
            isValid: false,
            error: `${fieldName} cannot exceed ${maxLength} characters`,
        };
    }

    return { isValid: true };
}

/**
 * Validate password
 */
export function validatePassword(password: string): ValidationResult {
    if (!password || password.length === 0) {
        return { isValid: false, error: 'Password is required' };
    }

    if (password.length < 8) {
        return {
            isValid: false,
            error: 'Password must be at least 8 characters',
        };
    }

    if (password.length > 128) {
        return { isValid: false, error: 'Password is too long' };
    }

    // Optional: Check for complexity
    // const hasUpperCase = /[A-Z]/.test(password);
    // const hasLowerCase = /[a-z]/.test(password);
    // const hasNumber = /[0-9]/.test(password);
    // if (!hasUpperCase || !hasLowerCase || !hasNumber) {
    //     return {
    //         isValid: false,
    //         error: 'Password must contain uppercase, lowercase, and numbers'
    //     };
    // }

    return { isValid: true };
}

/**
 * Validate number
 */
export function validateNumber(
    value: any,
    fieldName: string,
    min?: number,
    max?: number
): ValidationResult {
    const num = Number(value);

    if (isNaN(num)) {
        return { isValid: false, error: `${fieldName} must be a number` };
    }

    if (min !== undefined && num < min) {
        return {
            isValid: false,
            error: `${fieldName} must be at least ${min}`,
        };
    }

    if (max !== undefined && num > max) {
        return {
            isValid: false,
            error: `${fieldName} cannot exceed ${max}`,
        };
    }

    return { isValid: true };
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): ValidationResult {
    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
        return {
            isValid: false,
            error: 'Please upload a valid image file (JPEG, PNG, WebP, or GIF)',
        };
    }

    // Check file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
        return {
            isValid: false,
            error: 'Image size must be less than 5MB',
        };
    }

    return { isValid: true };
}

/**
 * Validate URL
 */
export function validateUrl(url: string): ValidationResult {
    if (!url || url.trim().length === 0) {
        return { isValid: false, error: 'URL is required' };
    }

    try {
        new URL(url);
        return { isValid: true };
    } catch {
        return { isValid: false, error: 'Please enter a valid URL' };
    }
}

/**
 * Validate price
 */
export function validatePrice(price: any): ValidationResult {
    return validateNumber(price, 'Price', 0);
}

/**
 * Validate stock
 */
export function validateStock(stock: any): ValidationResult {
    const result = validateNumber(stock, 'Stock', 0);
    if (!result.isValid) return result;

    // Check if it's an integer
    if (!Number.isInteger(Number(stock))) {
        return { isValid: false, error: 'Stock must be a whole number' };
    }

    return { isValid: true };
}

