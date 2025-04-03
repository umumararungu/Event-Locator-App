# Event Management System - Project Documentation

1. **Overview**

This project is an Event Management System built with Node.js, Express, Sequelize (PostgreSQL), and JWT-based authentication. It allows users to create, browse, and manage events with categories, ratings, and user interactions.

2. **Technical Stack**

   | Component | Technology | 
   |---------|-----------|
   | Backend | Node.js, Express |
   | Database |	PostgreSQL (Sequelize ORM) |
   | Authentication | JWT (JSON Web Tokens) |
   | API Docs |	Swagger/OpenAPI |
   | Error Handling	| Custom middleware |

3. **Project Setup**

### Prerequisites


- Node.js (v16+)

- PostgreSQL (v12+)

- npm or yarn

### Installation

Clone the repository

``` bash

- git clone https://github.com/your-repo/event-management-system.git
- cd event-management-system
```

### Install dependencies

``` bash

- npm install
# or
- yarn install
```

### Set up environment variables (.env file)

#### .env

```bash

DB_NAME=your_db_name
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=your_jwt_secret_key
```
### Database setup

``` bash

- npx sequelize-cli db:create    # Creates the database
- npx sequelize-cli db:migrate   # Runs migrations
- npx sequelize-cli db:seed:all  # Optional: Seeds sample data
```

### Start the server


``` bash

- npm run dev  # Development (with nodemon)
# or
- npm start    # Production
```

4. **API Endpoints**

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| /auth/register | POST | User registration |
| /auth/login | POST | User login (returns JWT token) |
| /auth/me | GET | Get user information |

### Events


| Endpoint | Method | Description |
|---------|--------|-------------|
| /events |	POST | Create new event (requires auth) |
| /events/:id |	GET	| Get event by ID |
| /events/:id |	PUT	| Update event (requires auth) |
| /events/:id |	GET	| Get event by id (requires auth) |
| /events/:id |	DELETE | Delete event (requires auth) |
| /events/nearby | GET | Find events near a location |
| /events/{id}/ratings | POST | Add a rating to an event |
| /events/{id}/ratings | GET | Get ratings for an event |
| /events/{id}/favorite | POST | Add event to favorites |
| /events/{id}/favorite | DELETE | Remove event from favorites |
| /events |	GET	| Get all events |

5. **Database Schema**

### Tables

- Users (id, username, email, password_hash, preferred_language, created_at, updated_at)

- Events (id, title_key, description_key, longitude, latitude, address, creator_id, start_time, end_time, capacity, price, created_at, updated_at)

- Categories (id, name_key, icon, created_at, updated_at)

- EventRatings (id, event_id, user_id, rating, comment)

### Relationships

- User → Events: One-to-Many (User.hasMany(Event))
- 
- Event → Categories: Many-to-Many (Event.belongsToMany(Category))
- 
- Event → Ratings: One-to-Many (Event.hasMany(EventRating))

6. **Authentication Flow**

- User registers (POST /auth/register)

- User logs in (POST /auth/login) → Returns JWT token

- Token is sent in headers for protected routes:

#### http

Authorization: Bearer <JWT_TOKEN>

7. **Error Handling**

|400 | Bad Request | Invalid input |
|401 | Unauthorized | Missing/invalid token |
|403 | Forbidden | User lacks permissions |
|404 | Not Found | Resource doesn’t exist |
|500 | Server Error | Internal server issue |

8. **Testing the API**

#### Using Swagger UI

- Visit http://localhost:3000/api-docs

- Click "Authorize" and enter your JWT token.

- Test endpoints interactively.