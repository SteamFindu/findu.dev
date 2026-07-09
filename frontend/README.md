# Findu.dev - React Frontend

React + TypeScript + Vite frontend for findu.dev website with multi-language support via Lingui.

## Features

- **React 18** - Modern React with hooks
- **React Router** - Client-side routing
- **Lingui i18n** - Multi-language support (English & Finnish)
- **Tailwind CSS** - Utility-first styling
- **TypeScript** - Type-safe code
- **Vite** - Fast build tool and dev server
- **JWT Authentication** - Secure token-based auth

## Pages

- Home - Portfolio landing page
- Projects - Showcase of projects
- Contact - Contact form
- Login - Authentication
- Register - User registration
- User Dashboard - User management
- Change Password - Password management
- Change Username - Profile management

## Setup

### Prerequisites

- Node.js >= 18
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Development

```bash
npm run dev
```

The development server will start at `http://localhost:5173`

### Building

```bash
npm run build
```

Production build will be in the `dist` directory.

### Translation Management

#### Extract messages

```bash
npm run extract
```

This generates message catalogs from all `t\`message\`` strings.

#### Compile translations

```bash
npm run compile
```

This compiles the .po files to JS.

## Environment Variables

Create a `.env.local` file:

```
VITE_API_BASE_URL=http://localhost:443
```

## API Integration

The frontend communicates with the Rust backend via these endpoints:

- `POST /api/register` - User registration
- `POST /api/login` - User login
- `GET /api/user/all` - List all users
- `PUT /api/user/changename` - Change username
- `PUT /api/user/changepassword` - Change password

## Architecture

```
src/
├── components/
│   └── Layout.tsx          # Main layout with nav/footer
├── pages/
│   ├── Home.tsx
│   ├── Projects.tsx
│   ├── Contact.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── UserDashboard.tsx
│   ├── ChangeName.tsx
│   ├── ChangePassword.tsx
│   └── NotFound.tsx
├── utils/
│   ├── api.ts             # Axios instance with interceptors
│   └── auth.ts            # Authentication helpers
├── locales/
│   └── en/messages.ts     # English translations
└── App.tsx                # Router setup
```
