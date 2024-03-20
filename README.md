# HomeFix - Web Application

## Overview
HomeFix is a web application developed using Express and EJS for service bookings. It includes search functionality and email confirmation for bookings, with data stored in the database.

## Setup
1. Clone this repository.
2. Install dependencies using npm install.
3. Create a .env file in the root directory and define the following variables:
4. Start the server using npm start.
5. Navigate to http://localhost:8080 in your web browser.

## Features
- *Service Bookings*: Users can book various services offered.
- *Search Functionality*: Users can search for services.
- *Email Confirmation*: Users receive email confirmations for bookings.
- *Database Storage*: Booking data is stored in the database.
- *Flash Messages*: Flash messages for success and error alerts.

## Routes
- /: Home page.
- /form: Service booking form.
- /search: Search for services.

## Dependencies
- express: Web application framework.
- ejs-mate: EJS template engine with layout support.
- connect-flash: Middleware for displaying flash messages.
- express-session: Middleware for managing sessions.
- nodemailer: Email sending library.
- dotenv: Loads environment variables from a .env file.

## Website Link
Access the website [here](https://homefix-eq0m.onrender.com/).

## Developer
This project was developed by Satyam Kumar.

## License
This project is licensed under the [MIT License](LICENSE).
