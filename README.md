# Pokedex Dashboard

A modern React application that fetches and displays Pokemon data live from the [PokeAPI](https://pokeapi.co/). Built with React 18, TypeScript, React Router v6, and Vite.

**Live Demo:** [https://pokeapi-dashboard.vercel.app](https://pokeapi-dashboard.vercel.app)

## API Used

**PokeAPI** — a free, open RESTful API for Pokemon data. No API key required.

- `GET /pokemon?limit=1025` — fetches the full list of 1,025 Pokemon
- `GET /pokemon/{name}` — fetches detailed stats, types, abilities for a single Pokemon
- All data is fetched live using the native `fetch()` API

## Features

### Core
- **Live API Integration** — all Pokemon data fetched from PokeAPI using `fetch()`, not bundled JSON
- **Client-side Routing** — React Router v6 with 4 routes: catalog (`/`), detail (`/pokemon/:name`), compare (`/compare`), and 404
- **Loading & Error States** — animated loader during API calls, clear error messages with retry on failure
- **Responsive Grid Layout** — CSS Grid catalog of Pokemon cards, works on mobile and desktop

### Catalog (List Page)
- Paginated grid of 1,025 Pokemon cards (40 per page)
- Real-time search filtering by name
- URL-synced pagination and search (`?page=2&q=char`)

### Detail Page
- Full Pokemon stats with animated bar charts (HP, Attack, Defense, Sp. Atk, Sp. Def, Speed)
- Type badges, abilities (regular + hidden), height/weight/base EXP
- **3D Viewer** — click the Pokemon sprite to open a draggable 3D model viewer
- **Evolution Chain** — visual chain showing evolution stages with links
- **Prev/Next Navigation** — arrow buttons and keyboard arrows to browse between Pokemon

### Comparison Page
- Side-by-side stat comparison of any two Pokemon
- Searchable dropdown to select Pokemon
- Visual bar indicators showing which Pokemon wins each stat

### Extras
- **Favorites** — heart button on cards and detail page, localStorage-persisted, filterable
- **Dark/Light Theme** — toggle in the header, respects system preference, localStorage-persisted
- **Keyboard Navigation** — arrow keys on detail page to go to previous/next Pokemon

## Tech Stack

- React 18 + TypeScript
- React Router v6
- Vite (build tool)
- CSS Modules
- Vitest (testing)
- ESLint + Prettier

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint
npm run lint

# Type check
npm run typecheck
```

## Deployment

This project is deployed on [Vercel](https://vercel.com). To deploy your own copy:

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com) and sign in with GitHub
3. Click "New Project" and import the repository
4. Vercel auto-detects Vite/React — click "Deploy"
5. Your app will be live at `https://your-project.vercel.app`

## Project Structure

```
src/
  components/     # Reusable UI components
    PokemonCard/   # Card component with tilt effect + favorites
    EvolutionChain/ # Evolution tree visualization
    FavoritesButton/ # Heart toggle for favorites
    ThemeToggle/   # Dark/light mode toggle
    PokemonViewer3D/ # 3D model viewer
  context/        # React contexts (Favorites, Theme)
  data/           # API layer — fetch() calls to PokeAPI
  hooks/          # Custom hooks (useTilt3D, useFavorites, useTheme, useKeyboardNav)
  pages/          # Route pages (Home, PokemonDetail, Compare)
  utils/          # Utility functions (sprite URLs, type colors, formatting)
```
