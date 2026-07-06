# NASA Space Explorer

An interactive gallery that pulls from NASA's Astronomy Picture of the Day (APOD) API, letting users browse space imagery across a custom date range.

**[Live demo](https://sanaadnan25.github.io/07-nasa-space-explorer/)**

## What it does

- Select a start and end date to fetch that range's APOD entries
- Displays each entry's title, image, and date in a responsive card grid
- Surfaces a rotating space fact banner for extra context while browsing

## How it works

Vanilla JS frontend that calls the NASA APOD API directly, parses the returned JSON array, and renders it into dynamically generated cards. Handles date range validation and image loading states.

**Stack:** HTML/CSS/JS, NASA APOD API
