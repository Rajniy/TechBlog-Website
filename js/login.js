import { AuthManager } from './authManager.js';

document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const passwordInput = document.getElementById('password');
  const togglePasswordBtn = document.querySelector('.toggle-password');
  const loginBtn = document.querySelector('.login-btn');
  const btnText = document.querySelector('.btn-text');
  const btnLoader = document.querySelector('.btn-loader');

  // Password visibility toggle
  togglePasswordBtn.addEventListener('click', function() {
    const icon = this.querySelector('i');
    
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.classList.replace('fa-eye', 'fa-eye-slash');
      this.setAttribute('aria-label', 'Hide password');
    } else {
      passwordInput.type = 'password';
      icon.classList.replace('fa-eye-slash', 'fa-eye');
      this.setAttribute('aria-label', 'Show password');
    }
  });

  // Form submission
  loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Clear previous error message if any
    let errorMessage = document.getElementById('errorMessage');
    if (errorMessage) {
      errorMessage.textContent = '';
      errorMessage.style.display = 'none';
    }

    // Show loading state
    loginBtn.classList.add('loading');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    const authManager = new AuthManager();
    const email = this.email.value;
    const password = this.password.value;

    console.log('Attempting login with:', email, password);

    try {
      const success = await authManager.login({ email, password });
      console.log('Login success:', success);

      // Reset loading state
      loginBtn.classList.remove('loading');
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');

      if (!success) {
        if (errorMessage) {
          errorMessage.textContent = 'Invalid username or password.';
          errorMessage.style.display = 'block';
        }
      }
      // On success, AuthManager.login redirects to dashboard.html
    } catch (error) {
      console.error('Login error caught:', error);
      if (errorMessage) {
        errorMessage.textContent = 'An error occurred during login.';
        errorMessage.style.display = 'block';
      }
      loginBtn.classList.remove('loading');
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
    }
  });
});