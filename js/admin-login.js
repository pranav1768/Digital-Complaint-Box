/* ============================================
   ADMIN LOGIN SCRIPT
   Digital Complaint Management System
   ============================================ */

// ============================================
// CHECK IF ALREADY LOGGED IN
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in, redirect to dashboard
            window.location.href = 'dashboard.html';
        }
    });
    
    // Setup login form
    setupLoginForm();
});

// ============================================
// SETUP LOGIN FORM
// ============================================
function setupLoginForm() {
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form values
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showError('Please enter both email and password');
            return;
        }
        
        // Show loading state
        const loginBtn = document.getElementById('loginBtn');
        loginBtn.classList.add('loading');
        loginBtn.disabled = true;
        
        // Hide any previous errors
        hideError();
        
        try {
            // Sign in with Firebase Authentication
            await auth.signInWithEmailAndPassword(email, password);
            
            console.log('Login successful');
            
            // Redirect to dashboard
            window.location.href = 'dashboard.html';
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Show user-friendly error message
            let errorMessage = 'Login failed. Please try again.';
            
            switch (error.code) {
                case 'auth/invalid-email':
                    errorMessage = 'Invalid email address format';
                    break;
                case 'auth/user-disabled':
                    errorMessage = 'This account has been disabled';
                    break;
                case 'auth/user-not-found':
                    errorMessage = 'No account found with this email';
                    break;
                case 'auth/wrong-password':
                    errorMessage = 'Incorrect password';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Too many failed attempts. Please try again later';
                    break;
                case 'auth/network-request-failed':
                    errorMessage = 'Network error. Please check your connection';
                    break;
                default:
                    errorMessage = error.message;
            }
            
            showError(errorMessage);
            
            // Reset loading state
            loginBtn.classList.remove('loading');
            loginBtn.disabled = false;
        }
    });
}

// ============================================
// TOGGLE PASSWORD VISIBILITY
// ============================================
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.getElementById('toggleIcon');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

// ============================================
// SHOW ERROR MESSAGE
// ============================================
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const errorText = document.getElementById('errorText');
    
    errorText.textContent = message;
    errorDiv.style.display = 'flex';
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// ============================================
// HIDE ERROR MESSAGE
// ============================================
function hideError() {
    const errorDiv = document.getElementById('errorMessage');
    errorDiv.style.display = 'none';
}

// ============================================
// UTILITY: VALIDATE EMAIL FORMAT
// ============================================
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}