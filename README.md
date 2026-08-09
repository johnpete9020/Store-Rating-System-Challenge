# Store Rating System Challenge

A full-stack web application built to manage and rate stores, featuring distinct user roles (Admin, Store Owner, and Normal User) with secure authentication and database management.

Live Demo:
**(Vercel)**: Live App URL: https://store-rating-system-challenge.vercel.app/


Tech Stack:
* **Frontend:** React, Vite, Tailwind CSS / CSS, Axios
* **Backend:** Node.js, Express.js, JSON Web Tokens (JWT), bcryptjs
* **Database:** PostgreSQL (Hosted via Supabase)

---

## Default Admin Account Credentials
You can log in immediately using the pre-configured administrator account:
* **E-Mail:** `admin@example.com`
* **Password:** `Password1`

**Note:** Initial Login might take time because it is running on a Free instance of Render
---
## Database Schema Design:

**1. Users Table:**
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) CHECK (role IN ('admin', 'store_owner', 'user')) NOT NULL,
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

**2. Stores Table:**
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    address TEXT NOT NULL,
    owner_id INT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

**3. Ratings Table:**
CREATE TABLE ratings (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    store_id INT REFERENCES stores(id) ON DELETE CASCADE,
    rating INT CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_store_rating UNIQUE (user_id, store_id)
);


## Project Structure
```text
Full Stack Challenge/
├── store-rating-app/       # React Frontend (Vite)
└── store-rating-backend/   # Node.js / Express Backend

