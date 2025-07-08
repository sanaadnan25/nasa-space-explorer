// NOTE: You do not need to edit this file.

// NASA's APOD API only has images from June 16, 1995 onwards
const earliestDate = '1995-06-16';

// Get today's date in YYYY-MM-DD format (required by date inputs)
const today = new Date().toISOString().split('T')[0];

// The default date format is: YYYY-MM-DD
// Example: 2024-07-01

function setupDateInputs(startInput, endInput) {
  // Restrict date selection range from NASA's first image to today
  startInput.min = earliestDate;
  startInput.max = today;
  endInput.min = earliestDate; 
  endInput.max = today;

  // Default: Show the most recent 9 days of space images
  // startInput.value and endInput.value will be in the format YYYY-MM-DD
  // Example: startInput.value = "2024-06-23", endInput.value = "2024-07-01"
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 8); // minus 8 because it includes today
  startInput.value = lastWeek.toISOString().split('T')[0];
  endInput.value = today;

  // No automatic adjustment of end date.
  // The user can freely select both start and end dates.
}
