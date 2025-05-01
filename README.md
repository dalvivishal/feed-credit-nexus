
# 📚 Community Hub — MERN Stack Project

A full-stack web application that serves as a **community hub** for discovering educational content, interacting with a personalized feed, and earning **credit points** through user engagement. Built with the **MERN stack**: MongoDB, Express.js, React.js, and Node.js.

---

## 🔍 Features

### 1. 🔐 User Authentication

- Secure registration & login with **JWT tokens**
- Persistent sessions with token verification

### 2. 💳 Credit Points System

- **Earn credits** for:
  - Watching content
  - Engaging (e.g., liking, saving, sharing)
- **Spend credits** on:
  - Unlocking premium resources or access to exclusive events
- **Transaction history**:
  - Timestamped logs
  - Description of each credit action

### 3. 📰 Feed Aggregator

- Aggregates content from **Twitter**, **Reddit**, and **LinkedIn**
- Content displayed as **cards** with:
  - Title
  - Source platform
  - Preview snippet
- User Interactions:
  - ✅ Save for later
  - 🔁 Share
  - 🚩 Report (flagged for admin review)

### 4. 🛠️ Admin/Moderator Panel

- Review and manage flagged content
- User moderation tools (suspend, warn, delete)
- Dashboard with stats:
  - Most saved/shared content
  - Top contributors
  - Report trends

### 5. 🚀 Deployment

- **Backend**: Node.js + Express.js API on **Google Cloud Platform (GCP)**
- **Frontend**: React.js + Tailwind CSS, deployed on **Firebase** or **GCP**
- **Database**: MongoDB Atlas (or self-hosted on GCP)
- Stores:
  - User data & preferences
  - Content metadata
  - Credit logs and engagement history

---

## 🧰 Tech Stack

| Layer         | Technology                |
|---------------|---------------------------|
| Frontend      | React.js, Tailwind CSS    |
| Backend       | Node.js, Express.js       |
| Database      | MongoDB                   |
| Authentication| JSON Web Tokens (JWT)     |
| Deployment    | Firebase / GCP            |
| APIs Used     | Twitter, Reddit, LinkedIn |

---

## 📁 Folder Structure (Suggested)

```
/client
  /src
    /components
    /pages
    /services
    App.js
    index.js

/server
  /controllers
  /models
  /routes
  /middleware
  app.js
  config.js

.env
README.md
```

---

## 🛠️ Setup Instructions

### Prerequisites

- Node.js v18+
- MongoDB Atlas or local MongoDB
- Firebase or GCP account
- Twitter, Reddit, and LinkedIn API keys

### Installation

```bash
# Clone the repository
git clone https://github.com/dalvivishal/feed-credit-nexus.git
cd community-hub

# Install backend dependencies
cd server
npm install

# Start backend server
npm run dev

# Install frontend dependencies
cd ../client
npm install

# Start frontend development server
npm run dev
```

---

## 🧪 Coming Soon

- Unit & integration tests (Jest, Supertest)
- Notifications system
- In-app messaging
