if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

// Import required modules
const express = require("express");
const path = require("path");
const ejsMate = require("ejs-mate");
const flash = require("connect-flash");
const session = require("express-session");
const nodemailer = require("nodemailer");
const { google } = require('googleapis');

const spreadsheetId = process.env.SPREADSHEETID;
const range = 'Sheet1!A:F';

// Initialize Express app
const app = express();

// Configure session middleware
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set secure to true if your app is served over HTTPS
}));

// Configure flash middleware
app.use(flash());

// Set up middleware to make flash messages available in all templates
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));

// Configure nodemailer transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USER,
    pass: process.env.PASS,
  },
});

// Define routes
// app.get("/", (req, res) => {
//   res.send("Hello, I am the root route!");
// });

app.get("/", (req, res) => {
  res.render("layouts/boilerplate");
});

app.get("/form", (req, res) => {
  res.render("listings/form");
});

app.get("/search", (req, res) => {
  const query = req.query.q.toLowerCase().trim(); // Convert query to lowercase and trim whitespace

  // Define keywords and their corresponding paths
  const keywords = {
    pricing: "/pricing",
    carpentry: "/carpentry",
    plumbing: "/plumbing",
    electrical: "/electrical",
    explore: "/explore",
    testimonials: "/testimonial",
    homefix: "/",
    "water line service": "/waterLineService",
    "gas line service": "/gasLineService",
    "kitchen plumbing": "/kitchenPlumbing",
    "bathroom plumbing": "/bathroomPlumbing",
    "book service": "/form",
  };

  // Check if the query matches any keyword
  for (const [keyword, path] of Object.entries(keywords)) {
    if (query.includes(keyword)) {
      return res.redirect(path);
    }
  }

  // If no matching keyword is found, render a page with a message
  res.status(404).send("No search results found.");
});

app.get("/waterLineService", (req, res) => {
  res.render("listings/waterLineService");
});
app.get("/gasLineService", (req, res) => {
  res.render("listings/gasLineService");
});
app.get("/plumbing", (req, res) => {
  res.render("listings/plumbing");
});
app.get("/carpentry", (req, res) => {
  res.render("listings/carpentry");
});
app.get("/electrical", (req, res) => {
  res.render("listings/electrical");
});

app.get("/kitchenPlumbing", (req, res) => {
  res.render("listings/kitchenPlumbing");
});

app.get("/bathroomPlumbing", (req, res) => {
  res.render("listings/bathroomPlumbing");
});

app.get("/testimonial", (req, res) => {
  res.render("listings/testimonial");
});

app.get("/pricing", (req, res) => {
  res.render("listings/pricing");
});

app.get("/explore", (req, res) => {
  res.render("listings/explore");
});

async function appendDataToSpreadsheet(data) {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.KEYFILE,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const sheets = google.sheets({ version: 'v4', auth });

  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values: [
          [data.name, data.email, data.phone, data.address, data.service, data.description],
        ],
      },
    });
    console.log('Data appended successfully:', response.data);
  } catch (error) {
    console.error('Error appending data:', error);
  }
}

app.post("/form", async (req, res) => {
  const { name, email, phone, address, service, description } = req.body;
  console.log('Form Data:', { name, email, phone, address, service, description });

  await appendDataToSpreadsheet({ name, email, phone, address, service, description });

  let mailOptions = {
    from: process.env.SECRET,
    to: email,
    subject: `Booking Confirmation for ${service}`,
    text: `Dear ${name},\n\nThank you for booking our ${service} service. We will get back to you shortly.\n\nDetails:\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\nAddress: ${address}\nService: ${service}\nDescription: ${description}\n\nRegards,\nHomeFix Team`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      req.flash("error", error.message);
      return res.redirect('/listings/form');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash("success", "Email sent successfully.");
      return res.redirect('/listings/form');
    }
  }); 
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});