export class ArticleManager {
  constructor() {
    this.articles = [];
    this.loadArticles();
  }

  async loadArticles() {
    const articleContainer = document.getElementById("articleContainer");
    if (!articleContainer) return;

    const spinner = document.getElementById("loadingSpinner");
    if (spinner) spinner.style.display = "block";

    try {
      const response = await fetch("/api/articles");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      this.articles = await response.json();
      this.renderArticles(this.articles);
    } catch (error) {
      console.error("Error loading articles from API:", error);
      console.log("Falling back to sample articles...");
      this.articles = this.getSampleArticles();
      this.renderArticles(this.articles);
    } finally {
      if (spinner) spinner.style.display = "none";
    }
  }

  renderArticles(articles) {
    const articleContainer = document.getElementById("articleContainer");
    if (!articleContainer) return;

    articleContainer.innerHTML = "";

    articles.forEach((article) => {
      const articleCard = document.createElement("div");
      articleCard.className = "article-card";
      articleCard.innerHTML = `
                <div class="article-image" style="background-image: url(images/${
                  article.image
                })"></div>
                <div class="article-content">
                    <span class="category-tag">${article.category}</span>
                    <h3>${article.title}</h3>
                    <p>${article.excerpt}</p>
                    <div class="article-meta">
                        <small>By ${article.author}</small><br/>
                        <small>${new Date(
                          article.date
                        ).toLocaleDateString()}</small>
                        <button onclick="window.location.href='article.html?id=${
                          article.id
                        }'" class="read-more">Read Full Article</button>
                    </div>
                </div>
            `;
      articleContainer.appendChild(articleCard);
    });
  }

  getSampleArticles() {
    return [
      {
        id: 1,
        title: "Introduction to Web Development",
        excerpt: "Learn the fundamentals of modern web development...",
        category: "Web Development",
        image: "web-development.jpg",
        date: "2024-03-15",
        author: "John Doe",
        content: `
                    <div class="article-image" style="background-image: url(images/web-development.jpg)"></div>
                    <p>Full article content here about web development...</p>
                `,
      },
      {
        id: 2,
        title: "The Future of AI",
        excerpt: "Exploring the potential of artificial intelligence...",
        category: "Artificial Intelligence",
        image: "ai.jpg",
        date: "2024-03-10",
        author: "Jane Smith",
        content: `
                    <div class="article-image" style="background-image: url(images/ai.jpg)"></div>
                    <p>Full article content here about AI and its future...</p>
                `,
      },
      {
        id: 3,
        title: "Graphic Design Trends 2024",
        excerpt: "Discover the latest trends in graphic design...",
        category: "Graphic Design",
        image: "graphic-design.jpg",
        date: "2024-03-20",
        author: "Alice Johnson",
        content: `
                    <div class="article-image" style="background-image: url(images/graphic-design.jpg)"></div>
                    <p>Full article content here about graphic design trends...</p>
                `,
      },
    ];
  }
}
