export class ThemeManager {
    constructor() {
        this.themeToggle = document.querySelector('.theme-toggle');
        if (this.themeToggle) {
            this.init();
        }
    }

    init() {
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        this.updateToggleIcon(savedTheme);

        this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateToggleIcon(newTheme);
    }

    updateToggleIcon(theme) {
        const icon = this.themeToggle.querySelector('i');
        if (icon) {
            icon.className = theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}