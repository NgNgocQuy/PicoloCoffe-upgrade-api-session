// main 
const express = require('express')
const path = require("path");
const session = require('express-session');
const methordOverride = require("method-override");
const bodyParser = require("body-parser")
// connect db
const data = require('./config/connect_db')
const port = process.env.PORT || 3000;
// routing
const route = require('./routes')

// app
const app = express()

// app.use-------------------------------------------
// session
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret',
  cookie: { maxAge: 1000*60*60 }})
);

// public
app.use(express.static(path.join(__dirname, "public")));

// upload
app.use(methordOverride("_method"));

// encode - (post)
app.use(
  express.urlencoded({
    extended: true,
  })
);

// json
app.use(express.json())

// mongo database
data.connect()

// using app
route(app)

// view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views" ));

// listen port
app.listen(port, () => {
    console.log(`App listening at http://localhost:${port}`);
  });

