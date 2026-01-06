import { ThemeManager } from './themeManager.js';
import { AuthManager } from './authManager.js';

document.addEventListener('DOMContentLoaded', function() {
    const authManager = new AuthManager();

    // Check authentication
    if (!authManager.isLoggedIn()) {
        window.location.href = 'index.html';
        return;
    }

    // Load user data (in a real app, this would come from your backend API)
    loadUserData();

    // Initialize ThemeManager for theme toggle
    new ThemeManager();

    // Set up event listeners
    document.getElementById('logout-link').addEventListener('click', function(e) {
        e.preventDefault();
        authManager.logout();
    });

    document.getElementById('new-post-btn').addEventListener('click', function() {
        alert('This would open a new post form in a real implementation');
        // window.location.href = 'new-post.html';
    });

    document.getElementById('edit-profile-btn').addEventListener('click', function() {
        alert('This would open profile edit form in a real implementation');
        // window.location.href = 'edit-profile.html';
    });

    document.getElementById('change-password-btn').addEventListener('click', function() {
        alert('This would open password change form in a real implementation');
        // window.location.href = 'change-password.html';
    });

    // Profile icon button click handler
    const profileIconBtn = document.getElementById('profile-icon-btn');
    if (profileIconBtn) {
        // Update icon based on login status
        const icon = profileIconBtn.querySelector('i');
        if (authManager.isLoggedIn()) {
            if (icon) {
                icon.className = 'fas fa-user-check';
            }
        } else {
            if (icon) {
                icon.className = 'fas fa-user-alt';
            }
        }

        profileIconBtn.addEventListener('click', () => {
            if (authManager.isLoggedIn()) {
                // Redirect to dashboard if logged in
                window.location.href = 'dashboard.html';
            } else {
                // Show alert and redirect to login if not logged in
                if (confirm('You need to login to access your profile. Do you want to login now?')) {
                    window.location.href = 'login.html';
                }
            }
        });
    }
});

function loadUserData() {
    // In a real app, you would fetch this from your backend API
    // For now, we'll use mock data or data from localStorage
    
    let userData = localStorage.getItem('userData');
    
    if (userData) {
        userData = JSON.parse(userData);
    } else {
        // Mock data - in a real app, this would come from your backend
        userData = {
            username: 'TechEnthusiast',
            email: 'user@example.com',
            joinDate: 'June 24, 2023',
            postCount: 0,
            commentCount: 0
        };
        localStorage.setItem('userData', JSON.stringify(userData));
    }
    
    // Update the UI with user data
    document.getElementById('username').textContent = userData.username;
    document.getElementById('user-email').textContent = userData.email;
    document.getElementById('join-date').textContent = userData.joinDate;
    document.getElementById('post-count').textContent = userData.postCount;
    document.getElementById('comment-count').textContent = userData.commentCount;
    
    // Set avatar initial
    if (userData.username) {
        document.querySelector('.avatar').textContent = userData.username.charAt(0).toUpperCase();
    }
}