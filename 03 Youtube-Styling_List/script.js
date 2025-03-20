// Define the API URL and options
const url = 'https://api.freeapi.app/api/v1/public/youtube/videos?page=1&limit=10&query=javascript&sortBy=keep%2520one%253A%2520mostLiked%2520%257C%2520mostViewed%2520%257C%2520latest%2520%257C%2520oldest';
const options = { method: 'GET', headers: { accept: 'application/json' } };

// Store the videos fetched from the API
let allVideos = [];

// Function to fetch data from the API
async function fetchVideos() {
    try {
        const response = await fetch(url, options);
        const data = await response.json();

        // Check if data is successfully fetched
        if (data.success) {
            allVideos = data.data.data; // Store the videos in the allVideos array
            renderVideoCards(allVideos); // Render the video cards initially
        } else {
            console.error("Error fetching videos:", data.message);
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// Function to render video cards dynamically
function renderVideoCards(videos) {
    const videoGrid = document.getElementById('videoGrid');
    videoGrid.innerHTML = ''; // Clear existing videos

    // Loop through each video and create a video card
    videos.map((video) => {
        const data = video.items.snippet; // Accessing video data

        // Create a video card
        const videoCard = document.createElement('div');
        videoCard.classList.add('video-card');

        // Create a thumbnail section
        const thumbnail = document.createElement('div');
        thumbnail.classList.add('video-thumbnail');
        const thumbnailImage = document.createElement('img');
        thumbnailImage.src = data.thumbnails.high.url;
        thumbnailImage.alt = data.title;
        thumbnail.appendChild(thumbnailImage);

        // Create a video info section
        const videoInfo = document.createElement('div');
        videoInfo.classList.add('video-info');

        // Video title
        const title = document.createElement('h3');
        title.classList.add('video-title');
        title.textContent = data.title;

        // Video description
        const description = document.createElement('p');
        description.classList.add('video-description');
        description.textContent = data.channelTitle;

        // Video details (views, likes, etc.)
        const details = document.createElement('div');
        details.classList.add('video-details');
        details.innerHTML = ` 
            <span>${video.items.statistics.viewCount} views</span> | 
            <span>${video.items.statistics.commentCount} comments</span>
        `;

        // Append everything to the video card
        videoInfo.appendChild(title);
        videoInfo.appendChild(description);
        videoInfo.appendChild(details);
        videoCard.appendChild(thumbnail);
        videoCard.appendChild(videoInfo);

        // Append the video card to the grid
        videoGrid.appendChild(videoCard);
    });
}

// Function to filter videos based on the search query
function filterVideos() {
    const searchQuery = document.getElementById('searchBar').value.toLowerCase();

    // Filter the videos based on the title or channel name
    const filteredVideos = allVideos.filter(video => {
        const title = video.items.snippet.title.toLowerCase();
        const channelTitle = video.items.snippet.channelTitle.toLowerCase();
        return title.includes(searchQuery) || channelTitle.includes(searchQuery);
    });

    // Render the filtered videos
    renderVideoCards(filteredVideos);
}

// Call the function to fetch videos when the page loads
fetchVideos();
