
# EduHub Backend API

This is the backend API for the EduHub application, a community platform for sharing educational content.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4 or higher)

### Installation

1. Clone the repository
2. Create a `.env` file based on `.env.example`
3. Install dependencies:

```bash
npm install
```

4. Start the server:

```bash
npm run dev
```

5. (Optional) Seed the database with initial data:

```bash
node seeder.js
```

To clear all data:

```bash
node seeder.js -d
```

## Default Users

After running the seeder, the following users will be available:

1. Admin User:
   - Email: admin@example.com
   - Password: admin123
   - Role: admin

2. Moderator User:
   - Email: jane@example.com
   - Password: moderator123
   - Role: moderator

3. Regular User:
   - Email: john@example.com
   - Password: user123
   - Role: user

## API Documentation

### Authentication Endpoints

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile (protected)
- `PATCH /api/auth/update-password` - Update user password (protected)

### User Endpoints

- `GET /api/users/profile/:id` - Get user profile (protected)
- `PATCH /api/users/profile` - Update user profile (protected)
- `GET /api/users/transactions` - Get user transactions (protected)
- `GET /api/users/saved-content` - Get user saved content (protected)
- `DELETE /api/users/delete-account` - Delete user account (protected)

### Content Endpoints

- `GET /api/content` - Get all content (public)
- `GET /api/content/:id` - Get single content (public)
- `POST /api/content` - Create new content (protected)
- `POST /api/content/:id/save` - Save content (protected)
- `DELETE /api/content/:id/unsave` - Unsave content (protected)
- `POST /api/content/:id/flag` - Flag content (protected)
- `POST /api/content/:id/share` - Share content (protected)

### Credits Endpoints

- `GET /api/credits/balance` - Get credit balance (protected)
- `POST /api/credits/spend` - Spend credits (protected)
- `POST /api/credits/claim-daily` - Claim daily bonus (protected)
- `GET /api/credits/transactions` - Get transaction history (protected)

### Admin Endpoints

- `GET /api/admin/stats` - Get dashboard statistics (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `PATCH /api/admin/users/:id/role` - Update user role (admin only)
- `PATCH /api/admin/users/:id/status` - Update user status (admin only)
- `PATCH /api/admin/users/:id/credits` - Adjust user credits (admin only)
- `GET /api/admin/reports` - Get all reports (moderator & admin)
- `PATCH /api/admin/reports/:id/resolve` - Resolve a report (moderator & admin)
- `GET /api/admin/flagged-content` - Get flagged content (moderator & admin)

## Environment Variables

```
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/eduhub
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=30d
```

## Error Handling

The API uses a standardized error response format:

```json
{
  "status": "error",
  "message": "Error message here"
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

- 100 requests per 15 minutes per IP address
