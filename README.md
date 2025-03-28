
# School Management System

This project is a **School Management System** divided into three main sections: **Admin**, **Frontend**, and **Backend**. Each section serves a different purpose to make the system efficient, modular, and scalable.

## Project Structure

### 📁frontend

The **frontend** folder contains all the files for the user-facing part of the website. It includes assets such as images, scripts, and styles, along with reusable components and pages.

```
└── 📁frontend
    └── 📁assets
        └── 📁images                # Images used throughout the website
        └── 📁scripts                # JavaScript files for dynamic functionality
            └── events.js           # Logic for event-related functionalities
            └── main.js             # Main JS file to control website behavior
            └── parents.js          # JS file for parents portal related logic
        └── 📁styles                 # CSS files for styling the frontend
            └── home.css            # Styling for the homepage
            └── main.css            # General styling for the site
            └── parents.css         # Custom styling for parents portal
    └── 📁components
        └── footer.html             # Footer component (HTML)
        └── navbar.html             # Navbar component (HTML)
    └── 📁pages
        └── about.html              # About Us page
        └── contact.html            # Contact page
        └── event-calendar.html     # Event Calendar page
        └── gallery.html            # Gallery page
        └── index.html              # Homepage
        └── parents-portal.html     # Parents Portal page
        └── policies.html           # School Policies page
```

**Explanation**:
- **assets**: Contains images, scripts, and styles used throughout the website.
- **components**: Includes reusable HTML components such as the `navbar.html` and `footer.html`.
- **pages**: Contains HTML pages for different sections of the website, such as `about.html`, `contact.html`, `gallery.html`, etc.

---

### 📁backend

The **backend** folder handles the server-side logic, including routing, database management, and authentication. It is responsible for managing data such as student records, homework, events, and more.

```
└── 📁backend
    └── 📁config
        └── db.js                  # Database connection configuration
    └── 📁middleware
        └── auth.js                # Middleware for authentication (JWT)
    └── 📁models
        └── Admin.js               # Admin schema for managing admin users
        └── Contact.js             # Contact form data model
        └── Event.js               # Event model for managing events
        └── Homework.js            # Homework model for student homework data
        └── Marks.js               # Marks model for student marks data
        └── Student.js             # Student model for student-related data
    └── 📁routes
        └── adminRoutes.js         # Routes for admin functionalities
        └── contactRoutes.js       # Routes for contact form submissions
        └── eventRoutes.js         # Routes for event management
        └── homeworkRoutes.js      # Routes for homework management
        └── marksRoutes.js         # Routes for marks management
        └── studentRoutes.js       # Routes for student data management
    └── .env                        # Environment variables for server configuration
    └── package-lock.json           # NPM lock file
    └── package.json                # NPM package dependencies
    └── server.js                   # Main server file to start the app
```

**Explanation**:
- **config**: Holds the database configuration and other server-side settings.
- **middleware**: Contains middleware like `auth.js` for handling authentication.
- **models**: Defines Mongoose models (schemas) for the app's database, such as `Admin.js`, `Student.js`, and `Event.js`.
- **routes**: Defines the routes for various API endpoints to handle requests like login, CRUD operations, etc.
- `.env`: Holds environment variables for sensitive information like database credentials.
- `server.js`: The entry point for the backend server, where Express is set up.

---

### 📁admin

The **admin** folder holds all the files for the admin dashboard, including styling, scripts, and pages. It allows admins to manage students, homework, marks, events, and more.

```
└── 📁admin
    └── 📁assets
        └── 📁scripts
            └── admin.js            # JavaScript file for managing admin functionalities
        └── 📁styles
            └── admin-secure.css    # Custom styling for admin secure login page
            └── admin.css           # Admin dashboard general styling
    └── 📁pages
        └── dashboard.html         # Admin dashboard page
        └── login.html             # Admin login page
        └── manage-events.html     # Manage events page
        └── manage-homework.html   # Manage homework page
        └── manage-marks.html      # Manage marks page
        └── manage-students.html  # Manage students page
```

**Explanation**:
- **assets**: Contains admin-specific styles (`admin.css`, `admin-secure.css`) and scripts (`admin.js`) for dynamic admin panel functionality.
- **pages**: Includes HTML pages that represent different admin functionalities like managing events, homework, marks, students, etc.

---

## How to Run the Project

### Backend Setup
1. Navigate to the backend directory:
    ```bash
    cd backend
    ```
2. Install the required dependencies:
    ```bash
    npm install
    ```
3. Start the backend server:
    ```bash
    npm run dev    # Or alternatively:
    node server.js
    ```
   This will start the server on `http://localhost:5000`.

### Frontend Setup
1. Navigate to the frontend directory and open the project in a live server (use VS Code's Live Server extension or any other tool to serve the HTML files):
    ```bash
    cd frontend
    ```
2. Open the `index.html` file in your browser using a live server.

### Admin Setup
1. Navigate to the admin directory:
    ```bash
    cd admin
    ```
2. Open the `login.html` page in a browser for the admin login functionality.

---

## Technologies Used
- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js, MongoDB (Mongoose for models)
- **Authentication**: JWT (JSON Web Tokens)
- **Environment**: dotenv for environment variables

---
