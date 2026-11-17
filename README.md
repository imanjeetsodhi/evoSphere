# EvoSphere

> An interactive artificial-life laboratory for exploring autonomous ecosystems in real time.

EvoSphere is a full-stack ecosystem simulation platform. It combines a low-poly 3D world, autonomous organisms, environmental systems, predator-prey dynamics, and ecological analytics in one browser-based experience.

## Highlights

- **Interactive 3D biosphere** powered by Three.js and React Three Fiber
- **Autonomous organisms** including plants, rabbits, and foxes
- **Predator-prey simulation** with movement, energy, feeding, reproduction, and death systems
- **Dynamic environments** with temperature, sunlight, water levels, weather, and day/night cycles
- **God-mode controls** for spawning organisms and triggering ecological events
- **Cinematic observation** with follow-camera support for individual organisms
- **Research Lab** with population charts, Lotka-Volterra visualizations, biodiversity metrics, and trophic analysis
- **Species Codex** for exploring organism traits and behavioral priorities
- **Biome presets** for quickly exploring different environmental conditions
- **Fastify API** for health checks and world metadata management

## Tech stack

### Frontend

- Next.js 16
- React 19
- TypeScript
- React Three Fiber and Drei
- Three.js
- Zustand
- Tailwind CSS
- Recharts

### Backend

- Node.js
- Fastify
- TypeScript
- Zod
- Drizzle ORM
- PostgreSQL client (`pg`)
- Pino logging

## Project structure

```text
evoSphere/
├── backend/
│   ├── src/
│   │   ├── config/          # Environment validation
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── db/              # Drizzle schema and database setup
│   │   ├── repositories/    # World data access
│   │   ├── routes/          # Health and world routes
│   │   ├── schemas/         # Request validation
│   │   ├── services/        # Application logic
│   │   └── types/           # Shared backend domain types
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js routes and pages
│   │   ├── components/      # UI and 3D scene components
│   │   ├── simulation/      # Simulation engine and systems
│   │   ├── store/           # Zustand state
│   │   └── types/           # Frontend domain types
│   └── package.json
└── README.md
```

## Requirements

- Node.js 20 or newer
- npm 10 or newer
- A modern browser with WebGL support

## Getting started

Clone the repository and install dependencies for both applications:

```bash
git clone https://github.com/<your-username>/evoSphere.git
cd evoSphere

cd backend
npm ci

cd ../frontend
npm ci
```

### Configure the backend

Create `backend/.env`:

```env
PORT=3001
NODE_ENV=development
# Optional. The current world routes use in-memory storage.
DATABASE_URL=postgres://postgres:postgres@localhost:5432/evosphere
```

`DATABASE_URL` is validated and a Drizzle/PostgreSQL connection is configured, but the active world API currently uses `InMemoryWorldRepository`. World data is therefore reset whenever the backend restarts.

### Run the applications

Start the backend in one terminal:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd frontend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. The backend listens on [http://localhost:3001](http://localhost:3001) by default.

## Frontend routes

| Route | Purpose |
| --- | --- |
| `/` | EvoSphere landing page |
| `/world` | Interactive ecosystem simulator |
| `/analytics` | Ecological analytics and research visualizations |
| `/codex` | Species and behavior reference |
| `/worlds` | Biome and world presets |

## Backend API

The backend exposes the following endpoints:

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/health` | Returns `{ "status": "ok" }` |
| `GET` | `/api/worlds` | Lists available worlds |
| `GET` | `/api/worlds/:id` | Retrieves a world by ID |
| `POST` | `/api/worlds` | Validates and creates a world |

Example:

```bash
curl http://localhost:3001/health
curl http://localhost:3001/api/worlds
curl http://localhost:3001/api/worlds/genesis_valley
```

Create a world:

```bash
curl -X POST http://localhost:3001/api/worlds \
  -H "Content-Type: application/json" \
  -d '{
    "id": "coastal-marsh",
    "name": "Coastal Marsh",
    "dimensions": { "width": 120, "depth": 80 },
    "environment": {
      "temperature": 22,
      "sunlight": 70,
      "waterLevel": 85,
      "timeOfDay": 9,
      "day": 1
    },
    "organisms": [],
    "simulation": {
      "isRunning": false,
      "speed": 1,
      "currentTick": 0
    }
  }'
```

## Available scripts

### Frontend

```bash
npm run dev       # Start the Next.js development server
npm run build     # Create a production build
npm run start     # Serve the production build
npm run lint      # Run ESLint
```

### Backend

```bash
npm run dev       # Start Fastify with watch mode
npm run build     # Compile TypeScript to dist/
npm run start     # Start the compiled server
npm test          # Placeholder; automated backend tests are not configured yet
```

## Development notes

- The simulation runs in the frontend and maintains live state through the Zustand store.
- The initial world and organism population are defined in the frontend simulation data.
- The backend currently provides world metadata and an in-memory default `Genesis Valley` world.
- PostgreSQL schema definitions are included as groundwork for persistent world storage.
- Environment files and generated build output are excluded by the repository's `.gitignore` files.

## Contributing

1. Create a feature branch.
2. Keep frontend and backend changes scoped to their respective applications.
3. Run the relevant lint, build, and development checks before opening a pull request.
4. Describe behavioral changes and include screenshots or recordings for visual updates.

## License

No license has been declared yet. Add a `LICENSE` file before distributing EvoSphere outside the repository.
