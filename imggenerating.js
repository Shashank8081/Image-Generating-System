const accessKey = "ox90vaQmHlh3NcAXj1PYExQ1Vdv9DD2Js2sf6nXJUaU";

const searchForm = document.querySelector('form');
const searchInput = document.querySelector('.search-input');
const imageContainer = document.querySelector('.image-container');
const loadMoreBtn = document.querySelector('.loadMoreBtn');

let page = 1;

// Function to fetch images using Unsplash API
const fetchImages = async (query, pageNo) => {
    try {
        if (pageNo === 1) {
            imageContainer.innerHTML = '';
        }

        const url = `https://api.unsplash.com/search/photos?query=${query}& per_page=28 &page=${pageNo}&client_id=${accessKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();

        if (data.results.length > 0) {
            data.results.forEach(photo => {
                // Create image container
                const imageElement = document.createElement('div');
                imageElement.classList.add('imageDiv');
                imageElement.innerHTML = `<img src="${photo.urls.regular}" alt="${photo.alt_description}" />`;

                // Create overlay
                const overlayElement = document.createElement('div');
                overlayElement.classList.add('overlay');

                // Create overlay text
                const overlayText = document.createElement('h3');
                overlayText.innerText = photo.alt_description || 'No description available';

                overlayElement.appendChild(overlayText);
                imageElement.appendChild(overlayElement);

                imageContainer.appendChild(imageElement);
            });

            if (data.total_pages > pageNo) {
                loadMoreBtn.style.display = "block";
            } else {
                loadMoreBtn.style.display = "none";
            }
        } else {
            imageContainer.innerHTML = '<h2>No Image Found...404</h2>';
            loadMoreBtn.style.display = "none";
        }
    } catch (error) {
        imageContainer.innerHTML = '<h2>Failed to fetch images. Please try again later...404</h2>';
        loadMoreBtn.style.display = "none";
        console.error(error);
    }
};

// Add event listener to search form
searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const inputText = searchInput.value.trim();
    if (inputText === "") {
        imageContainer.innerHTML = '<h2>Please enter a search query.</h2>';
        loadMoreBtn.style.display = "none";
        return;
    }
    page = 1;
    fetchImages(inputText, page);
});

// Add event listener to load more button to fetch more images
loadMoreBtn.addEventListener('click', () => {
    fetchImages(searchInput.value.trim(), ++page);
});
