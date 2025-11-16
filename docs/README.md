# Komiku Rest API - Documentation Website

A beautiful, modern documentation website for the Komiku Rest API built with Tailwind CSS.

## Features

- **Interactive Endpoint Explorer** - Browse all 11+ API endpoints with descriptions and examples
- **Code Examples** - JavaScript, Python, cURL, and Node.js code snippets
- **Try It Button** - Test endpoints directly from the documentation
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Modern UI** - Built with Tailwind CSS for a sleek, professional look
- **Fast Loading** - Static HTML with CDN-hosted Tailwind CSS

## Local Development

```bash
# Install dependencies (optional, only for http-server)
npm install

# Start development server
npm run dev

# Open http://localhost:3000 in your browser
```

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set the root directory to `docs/`
3. Deploy!

Or use Vercel CLI:

```bash
npm i -g vercel
vercel
```

### Static Hosting

This is a static HTML file that can be deployed to any static hosting service:
- Netlify
- GitHub Pages
- AWS S3
- Cloudflare Pages
- Any web server

## Structure

```
docs/
├── index.html      # Main documentation page
├── package.json    # Project metadata
├── vercel.json     # Vercel deployment config
└── README.md       # This file
```

## Customization

Edit `docs/index.html` to customize:
- Colors and gradients
- Endpoint descriptions
- Code examples
- Links and branding

## Tech Stack

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS framework (via CDN)
- **JavaScript** - Interactive features
- **Axios** - HTTP client for testing endpoints

## License


