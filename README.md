# Tech Stack Generator

A modern web tool to generate customized technology stack icons in Markdown format using [Simple Icons](https://simpleicons.org/) and [Devicon](https://devicon.dev/).

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=flat&logo=vercel)](https://tech-stack-generator.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=flat&logo=react)](https://react.dev/)

## Features

- 🎨 **236+ Technology Icons** - Comprehensive collection from Simple Icons and Devicon
- 🖼️ **Dual Output Formats** - Generate as single image or individual icons with clickable links
- 🔗 **Official Site Links** - Individual icons link to official technology websites
- 🌗 **Dark/Light Theme Toggle** - Preview icons in both themes
- 📐 **Customizable Layout** - Set icons per line (5-10)
- 🎯 **Category Filtering** - Browse by Languages, Frameworks, Platforms, Cloud, etc.
- 🔍 **Real-time Search** - Quickly find technologies
- 🖱️ **Drag & Drop** - Reorder selected icons intuitively
- 📋 **Markdown Export** - Copy generated markup to clipboard
- ⚡ **Built with Next.js 16** - Fast, modern React framework with Edge Runtime

## Tech Stack

This project itself is built with:

- **Framework:** [Next.js 16](https://nextjs.org/) with App Router
- **UI Library:** [React 19](https://react.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/)
- **Icons:** [Iconify](https://iconify.design/) (Simple Icons + Devicon)
- **Drag & Drop:** [@dnd-kit](https://dndkit.com/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Language:** TypeScript
- **Deployment:** Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/okano-t-ww/tech-stack-generator.git
cd tech-stack-generator

# Install dependencies
npm install

# Run development server
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to view the app.

### Build

\`\`\`bash
# Create production build
npm run build

# Start production server
npm start
\`\`\`

## Project Structure

\`\`\`
tech-stack-generator/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/                # API Routes (Edge Runtime)
│   │   │   ├── icon/           # Single icon SVG generation
│   │   │   └── icons/          # Combined icons SVG generation
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── generator/          # Main generator components
│   │   │   ├── GeneratorContainer.tsx
│   │   │   ├── IconGridGenerator.tsx
│   │   │   └── TechIconGrid.tsx
│   │   ├── layout/             # Layout components
│   │   ├── theme/              # Theme components
│   │   ├── ui/                 # shadcn/ui components
│   │   └── utils/              # Utility components
│   ├── constants/
│   │   └── techStack.ts        # 236 technology definitions
│   ├── lib/
│   │   ├── iconMapping.ts      # Iconify icon mappings (222 icons)
│   │   ├── techLinks.ts        # Official website URLs (200+ technologies)
│   │   ├── svgGenerator.ts     # SVG generation logic
│   │   └── utils.ts
│   └── types/
│       └── tech.ts             # TypeScript types
├── public/
└── scripts/                    # Build scripts
\`\`\`

## Usage

1. **Choose Output Format** - Select "Single Image" or "Individual Icons (with links)"
2. **Select a Category Tab** - Choose from Languages, Frameworks, Platforms, etc.
3. **Search or Browse** - Use the search bar or browse the technology list
4. **Toggle Icons** - Click to select/deselect technologies
5. **Reorder** - Drag and drop in the right panel to reorder
6. **Customize** - Set theme (dark/light) and icons per line (for single image)
7. **Generate** - Click "Generate Markdown" button
8. **Copy** - Click the copy button to copy Markdown to clipboard

### Output Format Examples

#### Single Image Format

Generates a combined image with all icons:

```markdown
![Tech Stack](https://your-domain.com/api/icons?i=react,nodejs,typescript&theme=dark&perline=10)
```

#### Individual Icons Format

Generates separate icons with clickable links to official websites:

```html
<p align="center">
  <a href="https://react.dev/" target="_blank" rel="noopener noreferrer">
    <img src="https://your-domain.com/api/icon?i=react&theme=dark&size=48" alt="React" width="48" height="48" />
  </a>
  <a href="https://nodejs.org/" target="_blank" rel="noopener noreferrer">
    <img src="https://your-domain.com/api/icon?i=nodejs&theme=dark&size=48" alt="Node.js" width="48" height="48" />
  </a>
</p>
```

## API Endpoints

### GET /api/icons

Generates a combined SVG image with multiple technology icons.

**Query Parameters:**

- `i` (required): Comma-separated icon IDs (e.g., `react,nodejs,typescript`)
- `theme` (optional): `light` or `dark` (default: `dark`)
- `perline` (optional): Icons per line, 5-10 (default: `10`)

**Example:**

```text
/api/icons?i=react,nodejs,typescript&theme=dark&perline=10
```

### GET /api/icon

Generates a single technology icon SVG.

**Query Parameters:**

- `i` (required): Icon ID (e.g., `react`)
- `theme` (optional): `light` or `dark` (default: `dark`)
- `size` (optional): Icon size in pixels (default: `48`)

**Example:**

```text
/api/icon?i=react&theme=dark&size=48
```

## Documentation

- [API Documentation](docs/API.md) - Detailed API endpoint documentation



## License

MIT License - see [LICENSE](LICENSE) for details

## Credits

- Icons: [Simple Icons](https://simpleicons.org/) (CC0 1.0) & [Devicon](https://devicon.dev/) (MIT)
- UI Components: [shadcn/ui](https://ui.shadcn.com/)
- Icon Framework: [Iconify](https://iconify.design/)

## Author

**Tatsuya Okano** (okano-t-ww)

- GitHub: [@okano-t-ww](https://github.com/okano-t-ww)
- Project: [tech-stack-generator](https://github.com/okano-t-ww/tech-stack-generator)

---

Made with ❤️ using Next.js