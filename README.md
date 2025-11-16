<!-- GitAds-Verify: WBSRH26RS33MFZHKP3H9ZYH6UFSEW5LS -->

<p align="center">
  <img src="https://avatars.githubusercontent.com/u/68459009?v=4" alt="Komiku logo" width="120" />
  <br />
  <strong>Komiku Rest API</strong>
</p>

## Overview

Komiku Rest API is a thin wrapper around the <https://komiku.id/> scraping logic that exposes the latest rekomendasi, pustaka, genre, and chapter information through a RESTful interface. It is built with Express 5, Cheerio for HTML parsing, Axios for HTTP requests, and includes basic rate-limiting and CORS middleware so it can safely be consumed by frontend applications.

## Table of Contents

1. [Features](#features)
2. [Prerequisites](#prerequisites)
3. [Installation](#installation)
4. [Running the Server](#running-the-server)
5. [API Reference](#api-reference)
6. [Contributing](#contributing)
7. [License](#license)

## Features

- Scrapes Komiku.id to expose rekomendasi, komik populer, and genre data.
- Provides search and detail-by-slug endpoints for chapters and manga metadata.
- Built-in rate limiting + CORS to protect public deployments.
- Zero database dependencies—data is fetched on demand.

## Prerequisites

- Node.js >= 18.x (defined in [`package.json`](package.json)).
- Internet access to reach `komiku.id`.

## Installation

```bash
npm install
```

## Running the Server

- **Development with hot reload**

  ```bash
  npm run dev
  ```

- **Production (or preview environments)**

  ```bash
  npm start
  ```

The server listens on `process.env.PORT` or `3005` by default and enables global error handlers so uncaught exceptions/rejections are logged without exiting the process.

## API Reference

All responses are JSON. The API routes simply proxy data scraped from Komiku.id and may change if the source updates its structure.

| Endpoint | Description | Parameters |
| --- | --- | --- |
| `GET /` | Health / metadata endpoint that lists available routes. | None |
| `GET /rekomendasi` | Latest rekomendasi manga. | None |
| `GET /terbaru` | Latest chapter releases. | None |
| `GET /pustaka` | Manga collection displayed on Komiku home. | None |
| `GET /berwarna` | Colored (berwarna) level content. | None |
| `GET /komik-populer` | Currently popular Komiku titles. | None |
| `GET /detail-komik/:slug` | Detailed metadata for a manga. | `slug` (URL-friendly title) |
| `GET /baca-chapter/:slug/:chapter` | Chapter pages with image URLs. | `slug`, `chapter` |
| `GET /search` | Search by keyword. | `q` (query term) |
| `GET /genre-all` | List all genres available. | None |
| `GET /genre-detail/:slug` | Manga under a specific genre. | `slug` (genre name) |
| `GET /genre-rekomendasi` | Featured genres / recommendations. | None |

### Sample Response

```json
{
  "title": "One Piece",
  "status": "Ongoing",
  "genres": ["Action", "Adventure"],
  "chapters": [
    {
      "chapter": "1096",
      "url": "http://komiku.id/one-piece/"
    }
  ]
}
```

> The structure slightly varies by endpoint because each controller maps to a distinct page on Komiku.

## Deployment Notes

- Rate limiting is configured via [`middleware/rateLimiter.js`](middleware/rateLimiter.js) to guard against abuse.
- The app is stateless and safe to deploy on serverless platforms (e.g., Vercel, Render) as long as the origin site allows scraping.

## Contributing

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/your-topic`.
3. Commit changes with descriptive messages.
4. Open a pull request and describe your changes.

Add new tests where appropriate. For scraping updates, verify selectors against `komiku.id`.

## License

MIT © [Your Name](https://github.com/VernSG)
