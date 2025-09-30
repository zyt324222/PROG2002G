// Authentication Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    initializeAuthPage();
});

function initializeAuthPage() {
    setupFormSwitching();
    setupPasswordStrength();
    setupFormValidation();
    setupSocialLogin();
}

// Form Switching Between Login and Register
function setupFormSwitching() {
    const showRegisterBtn = document.getElementById('show-register');
    const showLoginBtn = document.getElementById('show-login');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegister();
    });

    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLogin();
    });

    function switchToRegister() {
        loginForm.classList.add('hidden');
        registerForm.classList.remove('hidden');
        
        // Add animation
        registerForm.style.opacity = '0';
        registerForm.style.transform = 'translateX(20px)';
        
        setTimeout(() => {
            registerForm.style.transition = 'all 0.3s ease';
            registerForm.style.opacity = '1';
            registerForm.style.transform = 'translateX(0)';
        }, 50);
    }

    function switchToLogin() {
        registerForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
        
        // Add animation
        loginForm.style.opacity = '0';
        loginForm.style.transform = 'translateX(-20px)';
        
        setTimeout(() => {
            loginForm.style.transition = 'all 0.3s ease';
            loginForm.style.opacity = '1';
            loginForm.style.transform = 'translateX(0)';
        }, 50);
    }
}

// Password Strength Indicator
function setupPasswordStrength() {
    const passwordInput = document.getElementById('register-password');
    const strengthBar = document.querySelector('.strength-fill');
    const strengthText = document.querySelector('.strength-text');

    if (passwordInput && strengthBar && strengthText) {
        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = calculatePasswordStrength(password);
            updatePasswordStrength(strength, strengthBar, strengthText);
        });
    }
}

function calculatePasswordStrength(password) {
    let score = 0;
    let feedback = [];

    // Length check
    if (password.length >= 8) score += 1;
    else feedback.push('at least 8 characters');

    // Lowercase check
    if (/[a-z]/.test(password)) score += 1;
    else feedback.push('lowercase letters');

    // Uppercase check
    if (/[A-Z]/.test(password)) score += 1;
    else feedback.push('uppercase letters');

    // Number check
    if (/\d/.test(password)) score += 1;
    else feedback.push('numbers');

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('special characters');

    return {
        score: score,
        feedback: feedback,
        level: getStrengthLevel(score)
    };
}

function getStrengthLevel(score) {
    if (score <= 1) return 'weak';
    if (score <= 2) return 'fair';
    if (score <= 3) return 'good';
    return 'strong';
}

function updatePasswordStrength(strength, strengthBar, strengthText) {
    // Remove existing classes
    strengthBar.className = 'strength-fill';
    
    // Add new class based on strength
    strengthBar.classList.add(strength.level);
    
    // Update text
    const strengthLabels = {
        weak: 'Weak password',
        fair: 'Fair password',
        good: 'Good password',
        strong: 'Strong password'
    };
    
    strengthText.textContent = strengthLabels[strength.level];
    
    if (strength.feedback.length > 0 && strength.score < 4) {
        strengthText.textContent += ` - Add: ${strength.feedback.slice(0, 2).join(', ')}`;
    }
}

// Form Validation
function setupFormValidation() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Real-time validation
    setupRealTimeValidation();
}

function setupRealTimeValidation() {
    const emailInputs = document.querySelectorAll('input[type="email"]');
    const passwordInputs = document.querySelectorAll('input[type="password"]');

    emailInputs.forEach(input => {
        input.addEventListener('blur', validateEmail);
        input.addEventListener('input', clearValidationError);
    });

    passwordInputs.forEach(input => {
        input.addEventListener('blur', validatePassword);
        input.addEventListener('input', clearValidationError);
    });

    // Confirm password validation
    const confirmPasswordInput = document.getElementById('register-confirm-password');
    const passwordInput = document.getElementById('register-password');
    
    if (confirmPasswordInput && passwordInput) {
        confirmPasswordInput.addEventListener('blur', function() {
            validatePasswordMatch(passwordInput.value, this.value, this);
        });
    }
}

function validateEmail(event) {
    const email = event.target.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (email && !emailRegex.test(email)) {
        showFieldError(event.target, 'Please enter a valid email address');
        return false;
    }
    
    clearFieldError(event.target);
    return true;
}

function validatePassword(event) {
    const password = event.target.value;
    
    if (password && password.length < 6) {
        showFieldError(event.target, 'Password must be at least 6 characters long');
        return false;
    }
    
    clearFieldError(event.target);
    return true;
}

function validatePasswordMatch(password, confirmPassword, confirmInput) {
    if (confirmPassword && password !== confirmPassword) {
        showFieldError(confirmInput, 'Passwords do not match');
        return false;
    }
    
    clearFieldError(confirmInput);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    field.style.borderColor = '#e74c3c';
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '0.25rem';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
}

function clearFieldError(field) {
    field.style.borderColor = '';
    const existingError = field.parentNode.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }
}

function clearValidationError(event) {
    clearFieldError(event.target);
}

// Handle Login Form Submission
async function handleLogin(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const loginData = {
        email: formData.get('email'),
        password: formData.get('password'),
        remember: formData.get('remember') === 'on'
    };

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Signing In...';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await simulateApiCall(1500);
        
        // Store user session
        const userData = {
            id: 1,
            email: loginData.email,
            firstName: loginData.email.split('@')[0],
            lastName: 'User',
            loginTime: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${loginData.email.split('@')[0]}&background=667eea&color=fff`
        };
        
        // Save to localStorage
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        showSuccessModal('Welcome back! You have been successfully signed in.');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        showError('Login failed. Please check your credentials and try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Handle Register Form Submission
async function handleRegister(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const registerData = {
        firstname: formData.get('firstname'),
        lastname: formData.get('lastname'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        password: formData.get('password'),
        confirmPassword: formData.get('confirmPassword'),
        terms: formData.get('terms') === 'on',
        newsletter: formData.get('newsletter') === 'on'
    };

    // Validate form
    if (!validateRegisterForm(registerData)) {
        return;
    }

    // Show loading state
    const submitBtn = event.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Creating Account...';
    submitBtn.disabled = true;

    try {
        // Simulate API call
        await simulateApiCall(2000);
        
        // Store user session
        const userData = {
            id: Date.now(), // Simple ID generation
            email: registerData.email,
            firstName: registerData.firstname,
            lastName: registerData.lastname,
            phone: registerData.phone,
            loginTime: new Date().toISOString(),
            avatar: `https://ui-avatars.com/api/?name=${registerData.firstname}+${registerData.lastname}&background=667eea&color=fff`
        };
        
        // Save to localStorage
        localStorage.setItem('userSession', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        showSuccessModal('Account created successfully! Welcome to CharityHeart.');
        
        // Redirect to home page
        setTimeout(() => {
            window.location.href = '/';
        }, 2000);
        
    } catch (error) {
        showError('Registration failed. Please try again.');
    } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

function validateRegisterForm(data) {
    let isValid = true;

    // Check required fields
    if (!data.firstname.trim()) {
        showError('First name is required');
        isValid = false;
    }

    if (!data.lastname.trim()) {
        showError('Last name is required');
        isValid = false;
    }

    if (!data.email.trim()) {
        showError('Email is required');
        isValid = false;
    }

    if (!data.password) {
        showError('Password is required');
        isValid = false;
    }

    if (data.password !== data.confirmPassword) {
        showError('Passwords do not match');
        isValid = false;
    }

    if (!data.terms) {
        showError('You must agree to the Terms of Service');
        isValid = false;
    }

    return isValid;
}

// Social Login Handlers
function setupSocialLogin() {
    const googleBtns = document.querySelectorAll('.btn-google');
    const facebookBtns = document.querySelectorAll('.btn-facebook');

    googleBtns.forEach(btn => {
        btn.addEventListener('click', handleGoogleLogin);
    });

    facebookBtns.forEach(btn => {
        btn.addEventListener('click', handleFacebookLogin);
    });
}

async function handleGoogleLogin() {
    showMessage('Google login integration coming soon!', 'info');
    // In a real app, you would integrate with Google OAuth
}

async function handleFacebookLogin() {
    showMessage('Facebook login integration coming soon!', 'info');
    // In a real app, you would integrate with Facebook Login
}

// Utility Functions
function simulateApiCall(delay = 1000) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // Simulate 90% success rate
            if (Math.random() > 0.1) {
                resolve();
            } else {
                reject(new Error('Simulated API error'));
            }
        }, delay);
    });
}

function showSuccessModal(message) {
    const modal = document.getElementById('success-modal');
    const messageElement = document.getElementById('success-message');
    
    messageElement.textContent = message;
    modal.style.display = 'block';
    
    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeSuccessModal();
        }
    });
    
    // Close modal with close button
    const closeBtn = modal.querySelector('.close');
    closeBtn.addEventListener('click', closeSuccessModal);
}

function closeSuccessModal() {
    const modal = document.getElementById('success-modal');
    modal.style.display = 'none';
}

function showError(message) {
    showMessage(message, 'error');
}

function showMessage(message, type = 'info') {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.temp-message');
    existingMessages.forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `temp-message ${type}-message`;
    messageDiv.textContent = message;
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.zIndex = '9999';
    messageDiv.style.padding = '1rem 1.5rem';
    messageDiv.style.borderRadius = '8px';
    messageDiv.style.color = 'white';
    messageDiv.style.fontWeight = 'bold';
    messageDiv.style.maxWidth = '400px';
    messageDiv.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    
    if (type === 'error') {
        messageDiv.style.background = '#e74c3c';
    } else if (type === 'success') {
        messageDiv.style.background = '#27ae60';
    } else {
        messageDiv.style.background = '#3498db';
    }
    
    document.body.appendChild(messageDiv);
    
    // Animate in
    messageDiv.style.transform = 'translateX(100%)';
    setTimeout(() => {
        messageDiv.style.transition = 'transform 0.3s ease';
        messageDiv.style.transform = 'translateX(0)';
    }, 10);
    
    // Remove after 5 seconds
    setTimeout(() => {
        messageDiv.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (messageDiv.parentNode) {
                messageDiv.parentNode.removeChild(messageDiv);
            }
        }, 300);
    }, 5000);
}

// Enhanced form interactions
document.addEventListener('DOMContentLoaded', function() {
    // Add focus effects to form controls
    const formControls = document.querySelectorAll('.form-control');
    
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        control.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            if (!this.value) {
                this.parentNode.classList.remove('filled');
            } else {
                this.parentNode.classList.add('filled');
            }
        });
    });
});