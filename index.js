const express = require('express');
const dotenv = require('dotenv');
const db = require('./config/mogoose');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport');
const MongoStore = require('connect-mongo');


const app = express();

//set ejs template engine
app.set('view engine', 'ejs');
app.set('views', './views');

// mongo store is used to store the session cookie in the db 
app.use(session({
    name: "ERS",
    // change secret during before deployment in production 
    secret: "employeeReviewSystem",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://Nitish:nitish33@cluster0.ksobj.mongodb.net/Ecommerce?retryWrites=true&w=majority',
        autoRemove: 'disabled'
    },
        (err) => {
            console.log(err || 'connect-mongo setup ok');
        }
    )
}))

// for style and script
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8000;

// passport authentication
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use('/', require('./routes'));

// listen to port
app.listen(port, function (error) {
  if (error) {
    console.log(`Error in connecting to server: ${error}`);
    return;
  }
  console.log(`Successfully connected to Server`);
});