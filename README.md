# Event Management System - Project Documentation

1. **Overview**

This project is an Event Management System built with Node.js, Express, Sequelize (PostgreSQL), and JWT-based authentication. It allows users to create, browse, and manage events with categories, ratings, and user interactions.

2. **Technical Stack**

   Component	                 Technology
   ----------                  -----------
   Backend	                    Node.js, Express
   Database	                    PostgreSQL (Sequelize ORM)
   Authentication	            JWT (JSON Web Tokens)
   API Docs	                    Swagger/OpenAPI
   Error Handling	            Custom middleware

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

env

- DB_NAME=your_db_name
- DB_USER=your_db_user
- DB_PASSWORD=your_db_password
- DB_HOST=localhost
- DB_PORT=5432
- JWT_SECRET=your_jwt_secret_key
- Database setup

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

Events
-------

Endpoint	    Method	     Description
--------       --------     -------------
- /events	        GET	        Get all events (public)
- /events/:id	    GET	        Get event by ID
- /events	        POST	    Create new event (requires auth)
- /events/:id	    PUT	        Update event (requires auth)
- /events/:id	    DELETE	    Delete event (requires auth)
