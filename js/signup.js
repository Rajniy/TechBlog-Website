document.addEventListener('DOMContentLoaded', function() {
  const signupForm = document.getElementById('signupForm');
  const passwordInput = document.getElementById('password');
  const confirmPasswordInput = document.getElementById('confirm-password');
  const togglePasswordBtns = document.querySelectorAll('.toggle-password');
  const strengthBars = document.querySelectorAll('.strength-bar');
  const strengthText = document.querySelector('.strength-text span');
  const signupBtn = document.querySelector('.signup-btn');
  const btnText = document.querySelector('.btn-text');
  const btnLoader = document.querySelector('.btn-loader');

  // Password visibility toggle
  togglePasswordBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      const input = this.parentElement.querySelector('input');
      const icon = this.querySelector('i');
      
      if (input.type === 'password') {
        input.type = 'text';
        icon.classList.replace('fa-eye', 'fa-eye-slash');
        this.setAttribute('aria-label', 'Hide password');
      } else {
        input.type = 'password';
        icon.classList.replace('fa-eye-slash', 'fa-eye');
        this.setAttribute('aria-label', 'Show password');
      }
    });
  });

  // Password strength checker
  passwordInput.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Check password length
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // Check for numbers
    if (/\d/.test(password)) strength += 1;
    
    // Check for special characters
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength += 1;
    
    // Check for uppercase and lowercase letters
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // Update UI
    updateStrengthIndicator(strength);
  });

  function updateStrengthIndicator(strength) {
    // Reset all bars
    strengthBars.forEach(bar => {
      bar.style.backgroundColor = '';
    });
    
    // Set colors based on strength
    let color, text;
    
    if (strength <= 1) {
      color = '#e74c3c'; // Red
      text = 'Weak';
    } else if (strength <= 3) {
      color = '#f39c12'; // Orange
      text = 'Medium';
    } else {
      color = '#2ecc71'; // Green
      text = 'Strong';
    }
    
    // Update bars
    for (let i = 0; i < strength; i++) {
      if (i < strengthBars.length) {
        strengthBars[i].style.backgroundColor = color;
      }
    }
    
    // Update text
    strengthText.textContent = text;
    strengthText.style.color = color;
  }

  // Form validation and submission
  signupForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Email format validation
    const email = this.email.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }
    
    // Validate passwords match
    if (passwordInput.value !== confirmPasswordInput.value) {
      confirmPasswordInput.classList.add('error');
      const existingError = confirmPasswordInput.nextElementSibling;
      
      if (!existingError || !existingError.classList.contains('error-message')) {
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = 'Passwords do not match';
        confirmPasswordInput.parentNode.insertBefore(errorMsg, confirmPasswordInput.nextSibling);
      }
      
      return;
    } else {
      confirmPasswordInput.classList.remove('error');
      const errorMsg = confirmPasswordInput.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    }
    
    // Show loading state
    signupBtn.classList.add('loading');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');

    const username = this.username.value;
    const password = this.password.value;

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });

      if (!response.ok) {
        const errorData = await response.json();
        alert('Signup failed: ' + (errorData.error || 'Unknown error'));
        signupBtn.classList.remove('loading');
        btnText.classList.remove('hidden');
        btnLoader.classList.add('hidden');
        return;
      }

      const data = await response.json();
      localStorage.setItem('authToken', data.token);
      alert('Account created successfully! Redirecting to login page...');
      window.location.href = 'login.html';

    } catch (error) {
      alert('An error occurred during signup.');
      signupBtn.classList.remove('loading');
      btnText.classList.remove('hidden');
      btnLoader.classList.add('hidden');
    }
  });

  // Real-time password match validation
  confirmPasswordInput.addEventListener('input', function() {
    if (this.value !== passwordInput.value) {
      this.classList.add('error');
    } else {
      this.classList.remove('error');
      const errorMsg = this.nextElementSibling;
      if (errorMsg && errorMsg.classList.contains('error-message')) {
        errorMsg.remove();
      }
    }
  });
});
