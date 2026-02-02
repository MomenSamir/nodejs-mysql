# Node.js MySQL Tutorial Manager

A full-stack tutorial management system built with Node.js, Express, MySQL, and EJS. This project demonstrates modern backend development practices including authentication, file uploads, and advanced filtering.

## 🚀 Features

### ✅ Completed Features

#### 1. **User Authentication & Authorization**
- User registration with password hashing (bcrypt)
- Secure login system with session management
- Protected routes using middleware
- Session storage in MySQL database
- Automatic logout and session expiration

#### 2. **CRUD Operations (Tutorials)**
- Create new tutorials with rich content
- Read/view tutorials with detailed information
- Update existing tutorials
- Delete tutorials with confirmation
- RESTful API endpoints

#### 3. **File Upload & Management**
- Image upload for tutorials (JPG, PNG, GIF, WEBP)
- File size validation (max 5MB)
- Image preview before upload
- Automatic file cleanup on delete/update
- Static file serving

#### 4. **Search & Filtering**
- Real-time search by tutorial title
- Filter by publication status (Published/Draft)
- Pagination (10 items per page)
- Results counter
- Clear filters functionality
- URL parameter persistence

#### 5. **User Interface**
- Responsive EJS templates
- Clean, modern design
- User-friendly navigation bar
- Empty state handling
- Success/error messages
- Image thumbnails in list view

## 🛠️ Tech Stack

**Backend:**
- Node.js
- Express.js
- MySQL (with mysql2 promise-based driver)
- Express-Session (with MySQL session store)
- Bcrypt (password hashing)
- Multer (file uploads)

**Frontend:**
- EJS (templating)
- Vanilla JavaScript
- CSS3 (custom styling)

**Database:**
- MySQL 8.0+

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🔧 Installation

1. **Clone the repository:**
```bash
git clone <https://github.com/MomenSamir/nodejs-mysql.gitl>
cd nodejs-mysql
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure database:**

Create a database in MySQL:
```sql
CREATE DATABASE nodejs_mysql;
```

Update database credentials in `app/models/db.js`:
```javascript
const connection = mysql.createPool({
  host: "localhost",
  user: "your_username",
  password: "your_password",
  database: "nodejs_mysql"
});
```

4. **Run migrations:**
```bash
npm run migrate
```

This will create the following tables:
- `tutorials` - Tutorial content and metadata
- `users` - User accounts
- `sessions` - Session storage

5. **Start the server:**
```bash
npm start
# or for development with auto-restart:
nodemon server.js
```

6. **Access the application:**
```
http://localhost:8080
```

## 📁 Project Structure

```
nodejs-mysql/
├── app/
│   ├── config/
│   │   └── upload.config.js      # Multer file upload configuration
│   ├── controllers/
│   │   ├── auth.controller.js    # Authentication logic
│   │   └── tutorial.controller.js # Tutorial CRUD operations
│   ├── middleware/
│   │   └── auth.middleware.js    # Authentication middleware
│   ├── models/
│   │   ├── db.js                 # Database connection
│   │   ├── user.model.js         # User model
│   │   └── tutorial.model.js     # Tutorial model
│   ├── routes/
│   │   ├── auth.routes.js        # Auth API routes
│   │   ├── auth.view.routes.js   # Auth page routes
│   │   ├── tutorial.routes.js    # Tutorial API routes
│   │   └── tutorial.view.routes.js # Tutorial page routes
│   └── views/
│       ├── auth/
│       │   ├── login.ejs         # Login page
│       │   └── register.ejs      # Registration page
│       ├── partials/
│       │   └── navbar.ejs        # Reusable navbar
│       └── tutorials/
│           ├── index.ejs         # Tutorial list with search
│           ├── create.ejs        # Create tutorial form
│           └── edit.ejs          # Edit tutorial form
├── migrations/
│   ├── create_tutorials_table.js
│   ├── create_users_table.js
│   ├── create_sessions_table.js
│   ├── add_image_to_tutorials.js
│   └── migrate.js                # Migration runner
├── public/
│   └── uploads/
│       └── tutorials/            # Uploaded images
├── server.js                     # Main application entry
└── package.json
```

## 🔑 Environment Variables

For production, create a `.env` file:
```env
PORT=8080
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=nodejs_mysql
SESSION_SECRET=your-secret-key-change-this
```

## 🎯 API Endpoints

### Authentication
```
POST   /api/auth/register    # Register new user
POST   /api/auth/login       # Login user
POST   /api/auth/logout      # Logout user (protected)
GET    /api/auth/me          # Get current user (protected)
```

### Tutorials
```
GET    /api/tutorials              # Get all tutorials (with search/filter/pagination)
GET    /api/tutorials/:id          # Get single tutorial
POST   /api/tutorials              # Create tutorial (protected, with file upload)
PUT    /api/tutorials/:id          # Update tutorial (protected, with file upload)
DELETE /api/tutorials/:id          # Delete tutorial (protected)
GET    /api/tutorials/published    # Get published tutorials only
```

### Pages
```
GET    /                      # Redirect to /tutorials
GET    /login                 # Login page
GET    /register              # Registration page
GET    /tutorials             # Tutorial list (protected)
GET    /tutorials/create      # Create tutorial form (protected)
GET    /tutorials/:id/edit    # Edit tutorial form (protected)
```

## 📚 Key Learnings

### Node.js Concepts Covered:
- **Asynchronous programming** with async/await
- **Middleware patterns** in Express
- **Session management** with express-session
- **File upload handling** with Multer
- **Database interactions** with MySQL
- **Template rendering** with EJS
- **RESTful API design**
- **Error handling** strategies
- **Route organization** and modularization

### Security Practices:
- Password hashing with bcrypt
- Session-based authentication
- Protected routes with middleware
- SQL injection prevention (parameterized queries)
- File upload validation (type & size)
- CORS configuration

### Differences from PHP/Laravel:
- **Manual type conversion** (string to boolean/integer)
- **Explicit session saving** (async)
- **Route order matters** in Express
- **Manual middleware application**
- **No built-in ORM** (raw SQL queries)

## 🚧 Future Enhancements

Planned features for continued learning:

- [ ] User roles and permissions (Admin/User)
- [ ] Tutorial categories and tags (many-to-many relationships)
- [ ] User ownership of tutorials
- [ ] Comments system
- [ ] Rate limiting for API endpoints
- [ ] Input validation with express-validator
- [ ] API documentation with Swagger
- [ ] Unit and integration tests
- [ ] Docker containerization
- [ ] Cloud deployment (AWS/Heroku)

## 🤝 Contributing

This is a personal learning project, but suggestions and feedback are welcome!

## 📝 License

MIT License - feel free to use this project for learning purposes.

## 👨‍💻 Author

Built as a learning project to understand Node.js backend development coming from a PHP background.

## 🙏 Acknowledgments

- Original repo structure inspiration
- Node.js and Express.js documentation
- MySQL2 documentation
- Community tutorials and guides

---

**Happy Learning! 🚀**