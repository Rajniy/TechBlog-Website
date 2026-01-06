document.addEventListener('DOMContentLoaded', () => {
    const articles = [
        {
            id: 1,
            title: "Introduction to Web Development",
            excerpt: "Learn the fundamentals of modern web development...",
            category: "Web Development",
            image: "web-development.jpg",
            date: "March 15, 2024",
            content: "<p>Full article content here about web development...</p>"
        },
        {
            id: 2,
            title: "The Future of AI",
            excerpt: "Exploring the potential of artificial intelligence...",
            category: "Artificial Intelligence",
            image: "ai.jpg",
            date: "March 10, 2024",
            content: "<p>Full article content here about AI and its future...</p>"
        },
        {
            id: 3,
            title: "Graphic Design Trends 2024",
            excerpt: "Discover the latest trends in graphic design...",
            category: "Graphic Design",
            image: "graphic-design.jpg",
            date: "March 20, 2024",
            content: "<p>Full article content here about graphic design trends...</p>"
        }
    ];

    const categories = [
        { name: "Web Development", image: "web-development.jpg" },
        { name: "Artificial Intelligence", image: "ai.jpg" },
        { name: "Graphic Design", image: "graphic-design.jpg" },
        { name: "Cybersecurity", image: "cybersecurity.jpg" },
        { name: "Cloud Computing", image: "cloud-computing.jpg" }
    ];

    const articleContainer = document.getElementById('articleContainer');
    
    if (articleContainer) {
        articles.forEach(article => {
            const articleCard = document.createElement('div');
            articleCard.className = 'article-card';
            articleCard.innerHTML = `
                <div class="article-image" style="background-image: url(images/${article.image})"></div>
                <div class="article-content">
                    <span class="category-tag">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="article-meta">
                        <small>${article.date}</small>
                        <button onclick="viewArticle(${article.id})" class="read-more">Read More</button>
                    </div>
                </div>
            `;
            articleContainer.appendChild(articleCard);
        });
    }

    // Sticky navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Load article content
    if (document.getElementById('articleContent')) {
        loadArticle();
    }

    // Comment functionality
    const commentForm = document.getElementById('commentForm');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value.trim();
            const comment = document.getElementById('comment').value.trim();

            if (!name || !comment) {
                alert('Please enter both your name and comment.');
                return;
            }
            
            const comments = JSON.parse(localStorage.getItem('comments') || '[]');
            comments.push({ name, comment });
            localStorage.setItem('comments', JSON.stringify(comments));
            
            commentForm.reset();
            displayComments();
        });
    }

    displayComments();
});

function viewArticle(articleId) {
    window.location.href = `article.html?id=${articleId}`;
}

function loadArticle() {
    const urlParams = new URLSearchParams(window.location.search);
    const articleId = urlParams.get('id');
    
    if (articleId) {
        const article = articles.find(a => a.id == articleId);
        const articleContent = document.getElementById('articleContent');
        
        if (article) {
            articleContent.innerHTML = `
                <header class="article-header">
                    <h1>${article.title}</h1>
                    <div class="article-meta">
                        <span class="category-tag">${article.category}</span>
                        <span class="date">${article.date}</span>
                    </div>
                </header>
                <div class="article-body">
                    <img src="images/${article.image}" alt="${article.title}" class="featured-image">
                    ${article.content}
                </div>
            `;
        }
    }
}

function displayComments() {
    const commentsSection = document.getElementById('comments');
    if (commentsSection) {
        commentsSection.innerHTML = '';
        const comments = JSON.parse(localStorage.getItem('comments') || '[]');
        comments.forEach(comment => {
            const div = document.createElement('div');
            div.className = 'comment';
            div.innerHTML = `
                <h4>${comment.name}</h4>
                <p>${comment.comment}</p>
            `;
            commentsSection.appendChild(div);
        });
    }
}
