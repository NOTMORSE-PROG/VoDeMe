# VoDeMe - Master Your Vocabulary

A modern, secure vocabulary learning application built with Next.js 16, PostgreSQL, and best-in-class authentication practices.

## Features

- ✅ **Secure Authentication**: Argon2id password hashing, session-based auth with httpOnly cookies
- ✅ **User Profiles**: Profile picture uploads via UploadThing, customizable bio
- ✅ **Interactive Games**: SynoHit, HopRight, Word Parts, and Quiz games
- ✅ **Database-Backed**: PostgreSQL (Neon) with Prisma ORM
- ✅ **Security Features**: CSRF protection, input validation with Zod, audit logging
- ✅ **Modern Stack**: Next.js 16 App Router, React 19, TypeScript, Tailwind CSS

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript, Tailwind CSS
- **Authentication**: Custom implementation with Argon2id, jose (JWT), server actions
- **Database**: PostgreSQL (Neon), Prisma ORM
- **File Uploads**: UploadThing
- **Validation**: Zod
- **UI Components**: Shadcn/ui, Radix UI
- **Styling**: Tailwind CSS 4

## Prerequisites

- Node.js 18+
- npm or yarn
- PostgreSQL database (we use Neon)
- UploadThing account

## Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd NICOLE\ ANNE
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory (use `.env.example` as a template):

```env
# Database - Neon PostgreSQL
DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"

# Authentication Secrets (Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64'))")
JWT_SECRET="your-jwt-secret-here"
SESSION_SECRET="your-session-secret-here"

# UploadThing - Profile Picture Uploads
UPLOADTHING_TOKEN="your-uploadthing-token-here"

# Public URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=VoDeMe
```

**Generate secure secrets:**
```bash
node -e "console.log('JWT_SECRET=' + require('crypto').randomBytes(32).toString('base64')); console.log('SESSION_SECRET=' + require('crypto').randomBytes(32).toString('base64'))"
```

### 4. Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (creates tables)
npx prisma db push

# Or use migrations for production
npx prisma migrate dev --name init
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app.

## Project Structure

```
/
├── app/                          # Next.js App Router
│   ├── api/
│   │   └── uploadthing/          # File upload API routes
│   ├── auth/                     # Authentication pages
│   │   ├── signin/               # Sign in page
│   │   ├── signup/               # Sign up page
│   │   └── actions.ts            # Auth server actions
│   ├── dashboard/                # Protected dashboard
│   │   ├── page.tsx              # Dashboard server component
│   │   └── dashboard-client.tsx  # Dashboard client component
│   ├── profile/                  # User profile
│   │   ├── page.tsx              # Profile server component
│   │   ├── profile-client.tsx    # Profile client component
│   │   └── actions.ts            # Profile server actions
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── globals.css               # Global styles
├── components/                   # React components
│   ├── ui/                       # Shadcn/ui components
│   ├── home.tsx                  # Landing page
│   ├── sign-in.tsx               # Sign in form
│   ├── sign-up.tsx               # Sign up form
│   ├── dashboard.tsx             # Dashboard UI
│   ├── synohit-game.tsx          # Game components
│   ├── hopright-game.tsx
│   ├── word-parts-game.tsx
│   └── quiz-game.tsx
├── lib/                          # Utilities and libraries
│   ├── auth.ts                   # Authentication utilities
│   ├── password.ts               # Password hashing (Argon2id)
│   ├── db.ts                     # Prisma client singleton
│   ├── env.ts                    # Environment validation
│   ├── validation.ts             # Zod schemas
│   ├── uploadthing.ts            # UploadThing client
│   └── utils.ts                  # Misc utilities
├── prisma/
│   └── schema.prisma             # Database schema
├── .env                          # Environment variables (gitignored)
├── .env.example                  # Environment template
└── README.md                     # This file
```

## Database Schema

### Users Table
- **id**: Unique identifier (cUID)
- **email**: Unique email address
- **name**: User's full name
- **passwordHash**: Argon2id hashed password
- **profilePicture**: UploadThing URL (optional)
- **bio**: User bio (optional)
- **status**: Account status (active, suspended, deleted)
- **emailVerified**: Email verification timestamp
- **createdAt**: Account creation timestamp
- **updatedAt**: Last update timestamp

### Sessions Table
- **id**: Session identifier
- **token**: Unique session token
- **userId**: Foreign key to users
- **ipAddress**: User's IP address
- **userAgent**: User's browser/device info
- **expiresAt**: Session expiration
- **createdAt**: Session creation timestamp

### AuditLogs Table
- **id**: Log entry identifier
- **userId**: Foreign key to users
- **action**: Action performed (login, logout, profile_update, etc.)
- **entity**: Entity affected (user, session, etc.)
- **entityId**: ID of affected entity
- **oldData**: Previous state (JSON)
- **newData**: New state (JSON)
- **ipAddress**: User's IP address
- **userAgent**: User's browser/device info
- **createdAt**: Log timestamp

## Security Features

### Password Security
- **Hashing Algorithm**: Argon2id (OWASP recommended 2025)
- **Memory Cost**: 128 MiB
- **Time Cost**: 3 iterations
- **Parallelism**: 1
- **Password Requirements**:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number

### Session Management
- **Storage**: Database-backed sessions
- **Cookie Settings**: httpOnly, secure (production), sameSite: 'lax'
- **Duration**: 7 days
- **Cleanup**: Expired sessions are deletable via `cleanupExpiredSessions()`

### Input Validation
- All user inputs validated with Zod schemas
- Server-side validation for all mutations
- XSS protection via React's default escaping
- SQL injection prevention via Prisma's parameterized queries

### File Upload Security (UploadThing)
- Maximum file size: 4MB
- Allowed types: Images only (PNG, JPG, JPEG, WebP)
- Authentication required
- Server-side validation

### Audit Logging
- All authentication events logged
- Profile changes tracked
- IP address and user agent recorded
- Immutable audit trail

## API Routes

### Authentication
- `POST /auth/signin` - Sign in with email/password
- `POST /auth/signup` - Create new account
- `POST /auth/signout` - Destroy session

### Profile
- `GET /profile` - View profile
- `POST /profile/update` - Update profile (name, bio)
- `POST /profile/password` - Change password
- `DELETE /profile/picture` - Delete profile picture

### File Uploads
- `POST /api/uploadthing` - Upload profile picture

## Server Actions

### Auth Actions (`app/auth/actions.ts`)
- `signUpAction()` - Create account
- `signInAction()` - Authenticate user
- `signOutAction()` - Logout user

### Profile Actions (`app/profile/actions.ts`)
- `updateProfileAction()` - Update user profile
- `changePasswordAction()` - Change password
- `deleteProfilePictureAction()` - Remove profile picture

## Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Add Environment Variables**
   Add all variables from `.env` to Vercel:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `SESSION_SECRET`
   - `UPLOADTHING_TOKEN`
   - `NEXT_PUBLIC_APP_URL` (your Vercel URL)
   - `NEXT_PUBLIC_APP_NAME`

4. **Deploy**
   Vercel will automatically deploy on push to main branch

### Manual Deployment

```bash
# Build the application
npm run build

# Start production server
npm start
```

## Database Management

### View Database
```bash
npx prisma studio
```

### Create Migration
```bash
npx prisma migrate dev --name migration_name
```

### Apply Migrations (Production)
```bash
npx prisma migrate deploy
```

### Reset Database (Development only!)
```bash
npx prisma migrate reset
```

## Common Tasks

### Add a New User Manually
```typescript
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/password';

const password = await hashPassword('SecurePassword123');
await db.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
    passwordHash: password,
    status: 'active',
  },
});
```

### Clean Up Expired Sessions
```typescript
import { cleanupExpiredSessions } from '@/lib/auth';

const deletedCount = await cleanupExpiredSessions();
console.log(`Deleted ${deletedCount} expired sessions`);
```

## Troubleshooting

### "Invalid environment variables" Error
- Ensure all required variables in `.env` are set
- Regenerate secrets if needed
- Check that `DATABASE_URL` is correct

### Database Connection Issues
- Verify Neon database is accessible
- Check connection string format
- Ensure SSL mode is correct (`sslmode=require`)

### UploadThing Errors
- Verify `UPLOADTHING_TOKEN` is correct
- Check that the token hasn't expired
- Ensure file size is under 4MB

### Session/Auth Issues
- Clear browser cookies
- Check that `SESSION_SECRET` and `JWT_SECRET` are set
- Verify database sessions table exists

## License

MIT

## Support

For issues and questions:
- Create an issue on GitHub
- Email: support@vodeme.com

---

**Built with ❤️ for Grade 10 students**
