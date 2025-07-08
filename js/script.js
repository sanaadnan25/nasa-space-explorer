// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// NASA API key for this project
const apiKey = 'Hq8g4ajjfedaZ6Od7drt7pyEb422ly8fNKF0xhQH';

// Find the gallery container and the "Get Space Images" button
const gallery = document.getElementById('gallery');
const getImagesBtn = document.getElementById('getImages');

// Get modal elements
const imageModal = document.getElementById('imageModal');
const closeModal = document.getElementById('closeModal');
const modalImage = document.getElementById('modalImage');
const modalTitle = document.getElementById('modalTitle');
const modalDate = document.getElementById('modalDate');
const modalExplanation = document.getElementById('modalExplanation');

// Array of fun "Did You Know?" space facts
const spaceFacts = [
  "Did you know? One million Earths could fit inside the Sun!",
  "Did you know? A day on Venus is longer than a year on Venus.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? There are more trees on Earth than stars in the Milky Way.",
  "Did you know? The footprints on the Moon will be there for millions of years.",
  "Did you know? Jupiter has 95 known moons as of 2023.",
  "Did you know? Space is completely silent—there’s no air to carry sound.",
  "Did you know? The hottest planet in our solar system is Venus.",
  "Did you know? Saturn could float in water because it’s mostly gas.",
  "Did you know? The largest volcano in the solar system is on Mars."
];

// Function to pick and display a random space fact
function showRandomFact() {
  const factSection = document.getElementById('spaceFact');
  // Pick a random fact from the array
  const randomFact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  // Display the fact in the section
  factSection.textContent = randomFact;
}

// Function to fetch images from NASA's APOD API
async function fetchSpaceImages(startDate, endDate) {
  // Build the API URL with the selected date range and API key
  const url = `https://api.nasa.gov/planetary/apod?api_key=${apiKey}&start_date=${startDate}&end_date=${endDate}`;
  try {
    // Fetch data from the API
    const response = await fetch(url);
    // Convert the response to JSON
    const data = await response.json();
    // Return the data (an array of image info)
    return data;
  } catch (error) {
    // If there's an error, log it and return an empty array
    console.error('Error fetching images:', error);
    return [];
  }
}

// Function to display the images and videos in the gallery
function displayGallery(items) {
  // Clear any existing gallery content, including the placeholder
  gallery.innerHTML = '';

  // If there are no items, show a friendly message
  if (!items || items.length === 0) {
    gallery.innerHTML = `
      <div class="placeholder">
        <div class="placeholder-icon">🔭</div>
        <p>No space images or videos found for this date range. Try different dates!</p>
      </div>
    `;
    return;
  }

  // Loop through each item and create HTML elements for it
  items.forEach(item => {
    // Create a div for each gallery item
    const div = document.createElement('div');
    div.className = 'gallery-item';

    // If the item is an image
    if (item.media_type === 'image') {
      div.innerHTML = `
        <img src="${item.url}" alt="${item.title}" class="space-image">
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      // Add click event to open modal with details
      div.addEventListener('click', () => {
        // Show the modal
        imageModal.style.display = 'block';
        // Set modal content
        modalImage.src = item.hdurl || item.url;
        modalImage.alt = item.title;
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;
        modalExplanation.textContent = item.explanation;
        // Show image, hide video if present
        modalImage.style.display = 'block';
        if (document.getElementById('modalVideo')) {
          document.getElementById('modalVideo').remove();
        }
      });
    }
    // If the item is a video (e.g., YouTube)
    else if (item.media_type === 'video') {
      // Try to embed YouTube videos, otherwise show a link
      let videoEmbed = '';
      if (item.url.includes('youtube.com') || item.url.includes('youtu.be')) {
        // Extract YouTube video ID
        let videoId = '';
        if (item.url.includes('youtube.com')) {
          const urlParams = new URL(item.url).searchParams;
          videoId = urlParams.get('v');
        } else if (item.url.includes('youtu.be')) {
          videoId = item.url.split('/').pop();
        }
        if (videoId) {
          videoEmbed = `
            <div class="video-wrapper">
              <iframe width="100%" height="200" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
            </div>
          `;
        }
      }
      div.innerHTML = `
        ${videoEmbed ? videoEmbed : `<a href="${item.url}" target="_blank" class="video-link">Watch Video</a>`}
        <h3>${item.title}</h3>
        <p>${item.date}</p>
      `;
      // Add click event to open modal with details (show video in modal)
      div.addEventListener('click', () => {
        imageModal.style.display = 'block';
        modalTitle.textContent = item.title;
        modalDate.textContent = item.date;
        modalExplanation.textContent = item.explanation;
        // Hide image, show video
        modalImage.style.display = 'none';
        // Remove previous video if present
        if (document.getElementById('modalVideo')) {
          document.getElementById('modalVideo').remove();
        }
        // Embed video in modal if YouTube, else show link
        if (videoEmbed) {
          const videoDiv = document.createElement('div');
          videoDiv.id = 'modalVideo';
          videoDiv.innerHTML = `
            <iframe width="100%" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>
          `;
          modalTitle.parentNode.insertBefore(videoDiv, modalTitle);
        } else {
          const linkDiv = document.createElement('div');
          linkDiv.id = 'modalVideo';
          linkDiv.innerHTML = `<a href="${item.url}" target="_blank" class="video-link">Watch Video</a>`;
          modalTitle.parentNode.insertBefore(linkDiv, modalTitle);
        }
      });
    }
    // Add the item to the gallery
    gallery.appendChild(div);
  });
}

// Function to display a loading message in the gallery
function showLoadingMessage() {
  gallery.innerHTML = `
    <div class="placeholder">
      <div class="placeholder-icon">🔄</div>
      <p>Loading space photos…</p>
    </div>
  `;
}

// Function to handle getting and showing images
async function updateGallery() {
  // Show loading message before fetching images
  showLoadingMessage();
  // Get the selected start and end dates from the inputs
  const startDate = startInput.value;
  const endDate = endInput.value;
  // Fetch images from the API
  const images = await fetchSpaceImages(startDate, endDate);
  // Display the images in the gallery
  displayGallery(images);
}

// When the user clicks "Get Space Images", update the gallery
getImagesBtn.addEventListener('click', updateGallery);

// Also update the gallery when the user changes either date input
startInput.addEventListener('change', updateGallery);
endInput.addEventListener('change', updateGallery);

// Close the modal when the close button is clicked
closeModal.addEventListener('click', () => {
  imageModal.style.display = 'none';
});

// Also close the modal when clicking outside the modal content
window.addEventListener('click', (event) => {
  if (event.target === imageModal) {
    imageModal.style.display = 'none';
  }
});

// Show a random fact when the page loads
showRandomFact();
