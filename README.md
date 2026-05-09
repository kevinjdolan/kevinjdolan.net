# kevinjdolan.net

React/Vite frontend plus a FastAPI backend for Kevin J. Dolan's personal site.

## Run With Docker Compose

```bash
docker compose up --build
```

Then open:

- Frontend: http://localhost:5173
- Backend API docs: http://localhost:8000/docs
- Health check: http://localhost:8000/api/health

The Compose stack runs the backend on Python 3.14 with `uv`, and runs the Vite dev server with hot reloading. Source folders are mounted into the containers, so frontend and backend edits reload without rebuilding the images.

## Run Locally Without Docker

Backend:

```bash
cd backend
uv sync --frozen
uv run uvicorn app.main:app --reload
```

Frontend:

```bash
cd frontend
npm install
npm run dev
```

The frontend proxies `/api/*` to the backend. For Docker this is set to `http://backend:8000`; for local development it defaults to `http://localhost:8000`.

## Useful Commands

```bash
cd frontend && npm run typecheck
cd frontend && npm run build
docker compose down
```

## Project Structure

- `backend/`: FastAPI application, API models, and Python 3.14/uv Docker image.
- `frontend/`: Vite React app, TypeScript components, CSS, and public assets.
- `docker-compose.yml`: Development stack for API and hot-reloading frontend.

## Notes

The original static `index.html` has been decomposed into reusable React components. Continuous visual effects that previously ran through per-frame DOM mutation now use CSS transforms, opacity, and short TypeScript hooks only where layout measurement is needed.
