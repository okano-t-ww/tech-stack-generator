# API Documentation

Tech Stack Generator provides two Edge Runtime API endpoints for generating technology stack icons as SVG images.

## Table of Contents

- [Overview](#overview)
- [Authentication](#authentication)
- [Rate Limiting](#rate-limiting)
- [Endpoints](#endpoints)
  - [GET /api/icons](#get-apiicons)
  - [GET /api/icon](#get-apiicon)
- [Supported Technologies](#supported-technologies)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Overview

All API endpoints:

- Return SVG images with proper `Content-Type: image/svg+xml` headers
- Are deployed on Vercel Edge Runtime for optimal performance
- Support aggressive caching with `Cache-Control: public, max-age=31536000, immutable`
- Use [Simple Icons](https://simpleicons.org/) as the icon source

Base URL: `https://tech-stack-generator.vercel.app` (or your deployment URL)

## Authentication

No authentication is required. All endpoints are publicly accessible.

## Rate Limiting

Currently, there are no explicit rate limits. However, as a courtesy to the service:

- Cache responses on your end when possible
- Avoid making excessive requests in short time periods
- Use the API responsibly

## Endpoints

### GET /api/icons

Generates a combined SVG image containing multiple technology icons in a grid layout.

#### Request

**URL:** `/api/icons`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                                          |
|-----------|--------|----------|---------|------------------------------------------------------|
| `i`       | string | Yes      | -       | Comma-separated list of technology IDs               |
| `theme`   | string | No       | `dark`  | Color theme: `light` or `dark`                       |
| `perline` | number | No       | `10`    | Number of icons per line (range: 5-10)               |

#### Response

**Success (200 OK):**

- **Content-Type:** `image/svg+xml`
- **Body:** SVG image

**Error (400 Bad Request):**

```json
{
  "error": "Missing 'i' parameter. Usage: /api/icons?i=react,nodejs,typescript"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "No valid icon IDs provided"
}
```

**Error (400 Bad Request):**

```json
{
  "error": "Too many icons. Maximum is 50."
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to generate SVG"
}
```

#### Example Request

```text
GET /api/icons?i=react,nodejs,typescript,tailwind&theme=dark&perline=4
```

#### Example Response

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="224" height="56" viewBox="0 0 224 56">
  <rect width="224" height="56" fill="#0d1117" rx="8"/>
  <!-- Icon paths... -->
</svg>
```

---

### GET /api/icon

Generates a single technology icon as an SVG image with a background.

#### Request

**URL:** `/api/icon`

**Method:** `GET`

**Query Parameters:**

| Parameter | Type   | Required | Default | Description                            |
|-----------|--------|----------|---------|----------------------------------------|
| `i`       | string | Yes      | -       | Technology ID                          |
| `theme`   | string | No       | `dark`  | Color theme: `light` or `dark`         |
| `size`    | number | No       | `48`    | Icon size in pixels                    |

#### Response

**Success (200 OK):**

- **Content-Type:** `image/svg+xml`
- **Body:** SVG image

**Error (400 Bad Request):**

```json
{
  "error": "Missing 'i' parameter. Usage: /api/icon?i=react"
}
```

**Error (500 Internal Server Error):**

```json
{
  "error": "Failed to generate icon"
}
```

#### Example Request

```text
GET /api/icon?i=react&theme=dark&size=64
```

#### Example Response

```xml
<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64">
  <rect width="64" height="64" fill="#0d1117" rx="4"/>
  <g transform="translate(20, 20)">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path fill="#61DAFB" d="M14.23 12.004..."/>
    </svg>
  </g>
</svg>
```

---

## Supported Technologies

The API supports 236+ technologies across multiple categories:

### Categories

- **Languages**: JavaScript, TypeScript, Python, Java, Go, Rust, C, C++, C#, Ruby, PHP, Swift, Kotlin, Dart, Scala, R, Bash, Lua, Perl, Elixir, Clojure, Haskell
- **Frameworks**: React, Vue, Angular, Svelte, Next.js, Nuxt.js, Gatsby, Remix, Astro, SolidJS
- **Backend**: Node.js, Express, NestJS, FastAPI, Django, Flask, Spring, Laravel, Rails
- **UI Libraries**: Tailwind CSS, Bootstrap, Material-UI, Sass
- **Testing**: Jest, Vitest, Cypress, Selenium, Playwright, Mocha, Jasmine
- **Build Tools**: Vite, Webpack, Rollup, Bun, Babel, esbuild, SWC, Parcel
- **Cloud Platforms**: AWS, Azure, GCP, Vercel, Netlify, Cloudflare, Heroku
- **Databases**: MongoDB, PostgreSQL, MySQL, Redis, SQLite, Cassandra, Elasticsearch
- **DevOps**: Docker, Kubernetes, Jenkins, GitHub Actions, GitLab, Terraform, Ansible
- **And many more...**

### Finding Technology IDs

Technology IDs are typically lowercase versions of the technology name:

- `react` → React
- `nodejs` → Node.js
- `typescript` → TypeScript
- `nextjs` → Next.js

For a complete list, visit the web interface at [tech-stack-generator.vercel.app](https://tech-stack-generator.vercel.app/)

---

## Error Handling

All endpoints return appropriate HTTP status codes:

- **200 OK**: Request successful, SVG returned
- **400 Bad Request**: Invalid parameters or request format
- **500 Internal Server Error**: Server-side error during SVG generation

Error responses include a JSON body with an `error` field describing the issue.

---

## Examples

### Example 1: Single Image for README

Generate a tech stack badge for your GitHub README:

```markdown
![Tech Stack](https://tech-stack-generator.vercel.app/api/icons?i=react,nodejs,typescript,tailwind,prisma&theme=dark&perline=5)
```

### Example 2: Individual Icons with Links

Generate individual icons that link to official documentation:

```html
<p align="center">
  <a href="https://react.dev/" target="_blank">
    <img src="https://tech-stack-generator.vercel.app/api/icon?i=react&theme=dark&size=48" alt="React" width="48" height="48" />
  </a>
  <a href="https://nodejs.org/" target="_blank">
    <img src="https://tech-stack-generator.vercel.app/api/icon?i=nodejs&theme=dark&size=48" alt="Node.js" width="48" height="48" />
  </a>
  <a href="https://www.typescriptlang.org/" target="_blank">
    <img src="https://tech-stack-generator.vercel.app/api/icon?i=typescript&theme=dark&size=48" alt="TypeScript" width="48" height="48" />
  </a>
</p>
```

### Example 3: Light Theme

Generate icons with a light theme:

```markdown
![Tech Stack](https://tech-stack-generator.vercel.app/api/icons?i=python,django,postgres&theme=light&perline=3)
```

### Example 4: Custom Icon Size

Generate a larger single icon:

```html
<img src="https://tech-stack-generator.vercel.app/api/icon?i=vue&theme=dark&size=128" alt="Vue.js" width="128" height="128" />
```

### Example 5: Full Stack Project

Display a comprehensive tech stack:

```markdown
![Tech Stack](https://tech-stack-generator.vercel.app/api/icons?i=react,typescript,nextjs,tailwind,nodejs,express,prisma,postgres,docker,vercel&theme=dark&perline=5)
```

---

## Implementation Details

### SVG Generation

- Icons are sourced from [Simple Icons](https://simpleicons.org/)
- SVG generation is performed server-side using the `simple-icons` npm package
- Each icon is rendered with proper viewBox and path data
- Background colors adapt based on the selected theme

### Caching

Response headers include:

```text
Cache-Control: public, max-age=31536000, immutable
```

This indicates:

- Responses are publicly cacheable
- Cache for 1 year (31536000 seconds)
- Content is immutable and won't change

### Edge Runtime

Both endpoints use Vercel Edge Runtime for:

- Global distribution
- Low latency responses
- Automatic scaling
- High availability

---

## Changelog

### v2.0.0 (2025-01-XX)

- Migrated from external Skill Icons API to self-hosted Simple Icons solution
- Added `/api/icons` endpoint for combined icon grids
- Added `/api/icon` endpoint for individual icons
- Implemented Edge Runtime for both endpoints
- Added support for light/dark themes
- Added official website link mappings for 200+ technologies

---

## Support

For issues, feature requests, or questions:

- GitHub Issues: [tech-stack-generator/issues](https://github.com/okano-t-ww/tech-stack-generator/issues)
- Documentation: [README.md](../README.md)

---

## License

This API is provided as-is under the MIT License. Icon data is sourced from:

- [Simple Icons](https://simpleicons.org/) - CC0 1.0 Universal (Public Domain)
- [Devicon](https://devicon.dev/) - MIT License
