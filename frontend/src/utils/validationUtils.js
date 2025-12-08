// Email validation - only allow gmail, hotmail, yahoo
export const validateEmail = (email) => {
    const allowedDomains = ['@gmail.com', '@hotmail.com', '@yahoo.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email) {
        return { isValid: false, message: '' };
    }

    if (!emailRegex.test(email)) {
        return {
            isValid: false,
            message: '❌ Invalid email format!'
        };
    }

    const hasAllowedDomain = allowedDomains.some(domain => email.toLowerCase().endsWith(domain));

    if (!hasAllowedDomain) {
        return {
            isValid: false,
            message: '❌ Invalid Email Format! Please use @gmail.com, @hotmail.com, or @yahoo.com'
        };
    }

    return {
        isValid: true,
        message: '✅ Perfect! Email looks valid.'
    };
};

// Password strength validation
export const validatePassword = (password) => {
    if (!password) {
        return { isValid: false, message: '', strength: 0 };
    }

    const minLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%]/.test(password);

    const checks = [minLength, hasUppercase, hasNumber, hasSpecial];
    const strength = checks.filter(Boolean).length;

    if (!minLength) {
        return {
            isValid: false,
            message: '❌ Password must be at least 8 characters long',
            strength
        };
    }

    if (!hasUppercase || !hasNumber || !hasSpecial) {
        return {
            isValid: false,
            message: '❌ Weak Password! Must include A-Z, number and special symbol (!@#$%)',
            strength
        };
    }

    return {
        isValid: true,
        message: '✅ Strong Password ✔',
        strength: 4
    };
};

// Username validation
export const validateUsername = (username) => {
    if (!username) {
        return { isValid: false, message: '' };
    }

    if (username.length < 3) {
        return {
            isValid: false,
            message: '❌ Username must be at least 3 characters'
        };
    }

    if (username.length > 50) {
        return {
            isValid: false,
            message: '❌ Username must be less than 50 characters'
        };
    }

    return {
        isValid: true,
        message: '✅ Username looks good!'
    };
};
