export class AuthManager {
    constructor() {
        this.authLink = document.getElementById('auth-link');
        if (this.authLink) {
            this.init();
        }
    }

    init() {
        this.checkAuthStatus();
        this.authLink.addEventListener('click', (e) => {
            if (this.isLoggedIn()) {
                e.preventDefault();
                this.logout();
            }
        });
    }

    checkAuthStatus() {
        if (this.isLoggedIn()) {
            if (this.authLink) {
                this.authLink.textContent = 'Logout';
                this.authLink.href = '#';
            }
            return true;
        } else {
            if (this.authLink) {
                this.authLink.textContent = 'Login';
                this.authLink.href = 'login.html';
            }
            return false;
        }
    }

    isLoggedIn() {
        return localStorage.getItem('authToken') !== null;
    }

    async login(credentials) {
        try {
            console.log('Attempting login with credentials:', credentials);
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server responded with error:', response.status, errorData);
                throw new Error('Login failed');
            }

            const data = await response.json();
            console.log('Login successful:', data);
            localStorage.setItem('authToken', data.token);
            if (data.user) {
                localStorage.setItem('userData', JSON.stringify(data.user));
            }
            this.checkAuthStatus();
            window.location.href = 'dashboard.html';
            return true;

        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async signup(username, password) {
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            if (!response.ok) {
                throw new Error('Signup failed');
            }
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('userData', JSON.stringify(data.user));
            this.checkAuthStatus();
            return true;
        } catch (error) {
            console.error('Signup error:', error);
            return false;
        }
    }

    logout() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
        this.checkAuthStatus();
        window.location.href = 'index.html';
    }

    getUserData() {
        const userData = localStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    }
}