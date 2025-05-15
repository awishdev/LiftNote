# LiftNote Fitness Tracker

This app allows the user to create a login and track all of their fitness records to help meet their health goals.
This README gives a brief overview of the main backend (Python) and frontend (React/JSX) files in this project.

---
## Installation

--Clone the repo and run the following

>npm install --prefix client
>pipenv install --prefix server
>npm start --prefix server

--In a second terminal
>pipenv shell
>python server/app.py



## Backend

- **config.py**  
  Sets up the Flask app, database (SQLAlchemy), migrations, CORS, and Flask-Bcrypt. Exports the `app`, `db`, and `api` instances used throughout the server.

- **app.py**  
  Defines the Flask-RESTful resources and routes for:  
  - **Auth**: `/login`, `/register`, `/logout`, `/check_session`  
  - **Dashboard**: `/dashboard` (user + categories + grouped exercises)  
  - **Categories**: GET/POST `/categories`  
  - **Exercises**: GET/POST `/exercises` and GET/PUT/DELETE `/exercises/<id>`  

- **models.py**  
  Contains the SQLAlchemy models and serializers:  
  - **User**: with a `@hybrid_property` for password hashing & `authenticate()`  
  - **Category**: simple name + relationship to exercises  
  - **Exercise**: join table with `name`, `record`, `date`, `user_id`, `category_id`  

---

## Frontend (React)

- **src/App.jsx**  
  Top-level component that:  
  - Checks session on load  
  - Fetches dashboard data once on login  
  - Stores `user`, `categories`, and `exerciseRecords` in state  
  - Sets up React-Router v6 with protected routes (`/`, `/exercises`, `/add`)  

- **src/components/NavBar.js**  
  Renders navigation buttons for:  
  - **Categories** (`/`)  
  - **My Exercises** (`/exercises`)  
  - **Add Exercise** (`/add`)  
  Also includes a **Log Out** button that calls `/logout`.

- **src/components/LoginSignupPage.js**  
  A Formik+Yup controlled form that toggles between **Login** and **Register** modes, posting to `/login` or `/register` and lifting the user object back to `App`.

- **src/components/CategoriesPage.js**  
  Displays all categories and includes a Formik+Yup form to **add a new category** via `POST /categories`, updating the list in real time.

- **src/components/ExercisesPage.js**  
  - Renders a row of **category buttons** (styled inline) that expand/collapse to show exercises for that category.  
  - Uses `ExerciseCard` for each entry, and calls back to `App`-level handlers to **PATCH** or **DELETE** exercises.

- **src/components/AddExercisePage.js**  
  A Formik+Yup form to **create a new exercise**, fetching the available `categories` from props, posting to `/exercises`, and then calling `onAdd` to append it to global state before navigating to `/exercises`.

- **src/components/ExerciseCard.js**  
  A reusable card for a single exercise that:  
  - Shows **view mode** (name, record, date + Edit/Delete buttons)  
  - Switches to **edit mode** using Formik+Yup, validating and submitting a PATCH via `onEdit`, or calling `onDelete`  


## Author info
Arthur Ish

## License

MIT License

Copyright (c) 2025 Arthur Ish

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
