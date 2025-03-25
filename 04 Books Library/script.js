let books = [];
let currentPage = 1;
let pageLimit = 20;
let totalBooks = 0; // Total books from the API (needed for pagination calculation)
let totalPages = 1;
let visiblePages = 5;

const main = document.querySelector('main');
const gridViewBtn = document.querySelector('.grid-view');
const listViewBtn = document.querySelector('.list-view');
const searchInput = document.querySelector('#search');
const searchBtn = document.querySelector('#search-btn');
const sortSelect = document.querySelector('#sort');

async function fetchData() {
    const url = `https://api.freeapi.app/api/v1/public/books?page=${currentPage}&limit=${pageLimit}`;
    const options = { method: 'GET', headers: { accept: 'application/json' } };

    try {
        const response = await fetch(url, options);
        const data = await response.json();
        if (data.success && data.data) {
            totalBooks = data.data.totalItems;
            totalPages = Math.ceil(totalBooks / pageLimit);
            books = data.data.data;
            renderBooks(books, 'grid'); // Default to grid view
            renderPagination();
        }
    } catch (error) {
        console.log('Error fetching data:', error);
    }
}

function truncateDescription(description) {
    if (!description) return '';
    const words = description.split(' ');
    if (words.length > 15) {
        return words.slice(0, 15).join(' ') + '...';
    }
    return description;
}

function renderBooks(books, viewType) {
    main.innerHTML = '';

    books.forEach((book) => {
        const { imageLinks, title, authors, description, publishedDate, previewLink } = book.volumeInfo || {};
        const thumbnail = imageLinks?.thumbnail || 'https://via.placeholder.com/150x200?text=No+Image';
        const authorText = authors?.join(', ') || 'Unknown Author';
        const dateText = publishedDate || 'Unknown Date';
        const descText = description ? truncateDescription(description) : 'No description available';

        const card = document.createElement('div');
        card.classList.add(viewType === 'grid' ? 'card-grid' : 'card-list');

        card.innerHTML = `
            <img class="img" src="${thumbnail}" alt="${title}">
            <div class="card-content">
              <h3 class="title">${title || 'Untitled'}</h3>
              <p class="author">By ${authorText}</p>
              <p class="description">${descText}</p>
              ${description && description.length > 15 ? `<span><a href="${previewLink || '#'}" target="_blank" class="show-more">Show More</a></span>` : ''}
              <p class="date">${dateText}</p>
            </div>
        `;

        main.appendChild(card);
    });
}

function renderPagination() {
    const pageNumbers = document.getElementById('page-numbers');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;

    pageNumbers.innerHTML = '';

    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage + 1 < visiblePages) {
        startPage = Math.max(1, endPage - visiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        if (i === currentPage) {
            pageBtn.classList.add('active');
        }
        pageBtn.addEventListener('click', () => {
            currentPage = i;
            fetchData(); // Fetch data for the clicked page
        });
        pageNumbers.appendChild(pageBtn);
    }
}

function handlePrevPage() {
    if (currentPage > 1) {
        currentPage--;
        fetchData();
    }
}

function handleNextPage() {
    if (currentPage < totalPages) {
        currentPage++;
        fetchData(); // Fetch data for the next page
        console.log(fetchData())
    }
}

gridViewBtn.addEventListener('click', () => {
    gridViewBtn.classList.add('active');
    listViewBtn.classList.remove('active');
    renderBooks(books, 'grid');
});

listViewBtn.addEventListener('click', () => {
    listViewBtn.classList.add('active');
    gridViewBtn.classList.remove('active');
    renderBooks(books, 'list');
});

searchInput.addEventListener('input', () => {
    currentPage = 1;
    searchBooks();
});

searchBtn.addEventListener('click', searchBooks);
sortSelect.addEventListener('change', () => {
    currentPage = 1;
    sortBooks();
});

document.getElementById('prev-btn').addEventListener('click', handlePrevPage);
document.getElementById('next-btn').addEventListener('click', handleNextPage);

// Initialize with grid view
gridViewBtn.classList.add('active');
fetchData();

function searchBooks() {
    const search = searchInput.value.toLowerCase();
    const filteredBooks = books.filter((book) => {
        const title = book.volumeInfo?.title?.toLowerCase();
        const author = book.volumeInfo?.authors?.join(' ')?.toLowerCase();
        return title.includes(search) || author.includes(search);
    });

    renderBooks(filteredBooks, gridViewBtn.classList.contains('active') ? 'grid' : 'list');
}

function sortBooks() {
    const sortValue = sortSelect.value;
    let sortedBooks = [...books];
    if (sortValue === 'title-asc') {
        sortedBooks.sort((a, b) => a.volumeInfo?.title.localeCompare(b.volumeInfo?.title));
    } else if (sortValue === 'title-desc') {
        sortedBooks.sort((a, b) => b.volumeInfo?.title.localeCompare(a.volumeInfo?.title));
    } else if (sortValue === 'date-asc') {
        sortedBooks.sort((a, b) => a.volumeInfo?.publishedDate.localeCompare(b.volumeInfo?.publishedDate));
    } else if (sortValue === 'date-desc') {
        sortedBooks.sort((a, b) => b.volumeInfo?.publishedDate.localeCompare(a.volumeInfo?.publishedDate));
    }

    renderBooks(sortedBooks, gridViewBtn.classList.contains('active') ? 'grid' : 'list');
    renderPagination();
}
