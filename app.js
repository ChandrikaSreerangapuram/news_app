const API_KEY = 'ca28359d6a764d50beb23258eaa03b63';
const BASE_URL = 'https://newsapi.org/v2/top-headlines';

let currentPage = 1;
let query = '';
let country = '';
let category = '';
const pageSize = 10;

const searchBar = document.getElementById('search-bar');
const countryFilter = document.getElementById('country-filter');
const categoryFilter = document.getElementById('category-filter');
const searchBtn = document.getElementById('search-btn');
const newsContainer = document.getElementById('news-container');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageNumber = document.getElementById('page-number');
const loader = document.getElementById('loader');
const darkModeToggle = document.getElementById('dark-mode-toggle');

darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
});

async function fetchNews() {
    const url = new URL(BASE_URL);
    url.searchParams.append('apiKey', API_KEY);
    url.searchParams.append('q', query);
    url.searchParams.append('country', country);
    url.searchParams.append('category', category);
    url.searchParams.append('page', currentPage);
    url.searchParams.append('pageSize', pageSize);

    showLoader(true);
    try {
        const response = await fetch(url);
        const data = await response.json();
        renderNews(data.articles);
        togglePaginationButtons(data.totalResults);
    } catch (error) {
        console.error('Error fetching news:', error);
    } finally {
        showLoader(false);
    }
}

function showLoader(show) {
    loader.classList.toggle('hidden', !show);
}

function renderNews(articles) {
    newsContainer.innerHTML = articles.map(article => `
        <div class="news-card">
            <img src="${article.urlToImage || 'placeholder.jpg'}" alt="News Image">
            <h2>${article.title}</h2>
            <p>${article.description || 'No description available.'}</p>
            <a href="${article.url}" target="_blank">Read more</a>
        </div>
    `).join('');
}

function togglePaginationButtons(totalResults) {
    prevPageBtn.disabled = currentPage === 1;
    nextPageBtn.disabled = currentPage * pageSize >= totalResults;
}

searchBtn.addEventListener('click', () => {
    query = searchBar.value;
    country = countryFilter.value;
    category = categoryFilter.value;
    currentPage = 1;
    fetchNews();
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        fetchNews();
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    fetchNews();
});

// Initial fetch
fetchNews();
