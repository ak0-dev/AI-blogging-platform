# QuickBlog

QuickBlog is a full-stack blogging platform with a public blog, an admin dashboard, AI-assisted content generation, image uploads, and comment moderation.

The project is split into:

- `Client` - React 19 and Vite frontend
- `server` - Express API backed by MongoDB

## Features

- Browse published blog posts by category
- Read individual blog posts and leave comments for moderation
- Admin authentication using JWT
- Admin dashboard with blog, draft, and comment statistics
- Create, publish, unpublish, and delete blog posts
- Rich-text editing with Quill
- Generate blog content with Google Gemini
- Upload and optimize blog thumbnails through ImageKit
- Approve or delete reader comments
- Newsletter signup UI

## Technology stack

### Frontend

- React
- React Router
- Vite
- Tailwind CSS
- Axios
- Quill
- Marked
- React Hot Toast
- Motion

### Backend

- Node.js
- Express
- MongoDB with Mongoose
- JSON Web Tokens
- Multer
- ImageKit
- Google Gemini via `@google/genai`

## Project structure

```text
.
├── Client/
│   ├── src/
│   │   ├── components/       # Public and admin UI components
│   │   ├── context/          # Shared application state and API client
│   │   └── pages/            # Public blog and admin pages
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── configs/              # Database, Gemini, and ImageKit setup
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Authentication and uploads
│   ├── models/               # Mongoose models
│   ├── routes/               # API routes
│   ├── package.json
│   └── server.js
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database
- An ImageKit account
- A Google Gemini API key

## Getting started

### 1. Clone and enter the repository

```bash
git clone <repository-url>
cd "AI blogging platform"
```

### 2. Configure the server

Create `server/.env` with the following variables:

```env
PORT=3000
JWT_SECRET=replace-with-a-long-random-secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace-with-a-strong-password

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>

IMAGEKIT_PUBLIC_KEY=your-imagekit-public-key
IMAGEKIT_PRIVATE_KEY=your-imagekit-private-key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-imagekit-id

GEMINI_API_KEY=your-gemini-api-key
```

The server connects to the `quickblog` database under the MongoDB URI.

### 3. Configure the client

Create `Client/.env` with the URL of the running API:

```env
VITE_BASE_URL=http://localhost:3000
```

Vite exposes variables to browser code only when they use the `VITE_` prefix. Do not put private keys in `Client/.env`.

### 4. Install dependencies

Install dependencies in both applications:

```bash
cd server
npm install

cd ../Client
npm install
```

### 5. Run the applications

Start the API in one terminal:

```bash
cd server
npm run server
```

Start the Vite development server in a second terminal:

```bash
cd Client
npm run dev
```

Open the URL printed by Vite, usually `http://localhost:5173`.

The admin area is available at `/admin`. Sign in with the `ADMIN_EMAIL` and `ADMIN_PASSWORD` configured in the server environment.

## Available scripts

### Client

Run these commands from `Client`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

### Server

Run these commands from `server`:

| Command | Description |
| --- | --- |
| `npm run server` | Start the API with Nodemon |
| `npm start` | Start the API with Node |

## API overview

The API runs on port `3000` by default. Protected routes require the JWT returned by the admin login endpoint in the `Authorization` header.

### Public blog routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/api/blog/all` | Get all published blogs |
| `GET` | `/api/blog/:blogId` | Get a blog by ID |
| `POST` | `/api/blog/add-comment` | Submit a comment for moderation |
| `POST` | `/api/blog/comments` | Get approved comments for a blog |

### Admin and protected blog routes

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/admin/login` | Authenticate the administrator |
| `GET` | `/api/admin/dashboard` | Get dashboard statistics |
| `GET` | `/api/admin/blogs` | Get all blogs, including drafts |
| `GET` | `/api/admin/comments` | Get all comments |
| `POST` | `/api/admin/approve-comment` | Approve a comment |
| `POST` | `/api/admin/delete-comment` | Delete a comment |
| `POST` | `/api/blog/add` | Create a blog with an uploaded image |
| `POST` | `/api/blog/delete` | Delete a blog and its comments |
| `POST` | `/api/blog/toggle-publish` | Toggle a blog's published status |
| `POST` | `/api/blog/generate` | Generate content with Gemini |

## Production notes

- Build the frontend with `npm run build` from `Client`.
- Set `VITE_BASE_URL` to the deployed API URL before building the frontend.
- Set the server environment variables in the hosting provider rather than committing `.env` files.
- Restrict MongoDB network access and rotate any credentials that may have been exposed.
- Configure CORS for the deployed frontend origin before production use.

## License

No license has been specified for this project yet.
