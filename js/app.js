import { ArticleManager } from './articleManager.js';
import { ThemeManager } from './themeManager.js';
import { AuthManager } from './authManager.js';

document.addEventListener('DOMContentLoaded', () => {
    const authManager = new AuthManager();

    new ArticleManager();
    new ThemeManager();

    // Dynamically inject modal HTML into body so that each page can have its own modal and har jagah individually add na karna pade
    const modalHTML = `
    <div id="userModal" class="modal" aria-hidden="true" role="dialog" aria-labelledby="modalTitle" aria-describedby="modalDesc" style="display:none;">
      <div class="modal-content" role="document">
        <button class="modal-close" aria-label="Close modal">&times;</button>
        <h2 id="modalTitle">Welcome to TechBlog</h2>
        <p id="modalDesc">Please <a href="login.html">log in</a> or <a href="signup.html">sign up</a> to access your dashboard.</p>
      </div>
    </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Profile icon button click handler
    const profileIconBtn = document.getElementById('profile-icon-btn');
    const userModal = document.getElementById('userModal');
    const modalCloseBtn = userModal ? userModal.querySelector('.modal-close') : null;

    function openModal() {
        if (userModal) {
            userModal.style.display = 'flex';
            userModal.setAttribute('aria-hidden', 'false');
        }
    }

    function closeModal() {
        if (userModal) {
            userModal.style.display = 'none';
            userModal.setAttribute('aria-hidden', 'true');
        }
    }

    if (profileIconBtn) {
        profileIconBtn.addEventListener('click', () => {
            if (authManager.isLoggedIn()) {
                // Redirect to dashboard if logged in
                window.location.href = 'dashboard.html';
            } else {
                // Show modal if not logged in
                openModal();
            }
        });
    }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', () => {
            closeModal();
        });
    }

    // Close modal when clicking outside modal content
    if (userModal) {
        userModal.addEventListener('click', (event) => {
            if (event.target === userModal) {
                closeModal();
            }
        });
    }

    // Remove Logout link from all pages except dashboard
    // Commented out to always show login link on all pages
    // const navLinks = document.querySelectorAll('.nav-links li');
    // navLinks.forEach(li => {
    //     const link = li.querySelector('a');
    //     if (link && link.id === 'auth-link' && window.location.pathname.split('/').pop() !== 'dashboard.html') {
    //         li.remove();
    //     }
    // });

    // Set active class on navbar links based on current page
    const currentPage = window.location.pathname.split('/').pop();
    const navLinksAnchors = document.querySelectorAll('.nav-links a');
    navLinksAnchors.forEach(anchor => {
        if (anchor.getAttribute('href') === currentPage) {
            anchor.classList.add('active');
            anchor.setAttribute('aria-current', 'page');
        } else {
            anchor.classList.remove('active');
            anchor.removeAttribute('aria-current');
        }
    });

    // Smooth active state switching on navbar links on click
    navLinksAnchors.forEach(anchor => {
        anchor.addEventListener('click', () => {
            navLinksAnchors.forEach(a => {
                a.classList.remove('active');
                a.removeAttribute('aria-current');
            });
            anchor.classList.add('active');
            anchor.setAttribute('aria-current', 'page');
        });
    });

    console.log('All modules loaded successfully');
});
