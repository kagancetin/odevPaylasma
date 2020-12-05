const express = require("express");
const exphbs = require("express-handlebars");
const logger = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const flash = require("connect-flash");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const fs = require('fs');
var helpers = require('handlebars-helpers')();

const handlebarsHelpers = require("./helpers/handlebarsHelpers");

var allHelpers = {...helpers,...handlebarsHelpers}

var User = require("./model/User");

// MongoDB Connection
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/odevPaylasma", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "DB Connection Error"));
db.once("open", () => {
  console.log("DB Connected");

  bcrypt.genSalt(10, function (err, salt) {
    if (err) throw err;
    bcrypt.hash("password", salt, async function (err, hash) {
      if (err) throw err;
      var all = await User.countDocuments();
      if (all == 0) {
        const newUser = new User({
          username: "admin",
          password: hash,
          fullName:"admin",
          type: 0,
          superAdmin: true
        });
        newUser.save().then(() => {
          console.log("user added");
        });
      }
    });
  });
});

const app = express();

// Routes
const index = require("./router/index.js");
const users = require("./router/users.js");
const manage = require("./router/manage.js");
const homeworks = require("./router/homeworks.js");

// MİDDLEWARES
// Basic Security - Helmet
app.use(helmet());

// Bodyparser
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// Public explanation
app.use(express.static("public"));

// Morgan explanation
/*
app.use(logger('common', {
  stream: fs.createWriteStream('./access.log', {flags: 'a'})
}));
*/
app.use(logger("dev"));

// Template Engine
const hbs = exphbs.create({ 
  extname: "handlebars", 
  defaultLayout: "main",
  helpers: allHelpers
});
app.engine(
  "handlebars",
  hbs.engine
);
app.set("view engine", "handlebars");

//Cookie Parser
app.use(cookieParser("keyboard cat"));

// Session
app.use(
  session({
    cookie: { maxAge: 600000 },
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true,
  })
);

// Connect Flash
app.use(flash());

// Passport
app.use(passport.initialize());
app.use(passport.session());

//Global - Res.Locals
app.use((req, res, next) => {
  
  res.locals.flashMessages =
    {error: req.flash("error"),
    success: req.flash("success"),
    warning: req.flash("warning")}
  
  if(req.user){
    res.locals.userActive={
      _id: req.user._id,
      username: req.user.username,
      type:req.user.type,
      fullName:req.user.fullName,
      profilPhoto: req.user.profilPhoto
    };
    res.locals.userType = req.user.type;
  }
  
  next();
});

//Routes
app.use("/", index);
app.use("/users", users);
app.use("/manage", manage);
app.use("/homeworks", homeworks);

//Catch 404 errors and forward them to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  res.render("static/404",{layout: 'staticLayout.handlebars'});
});

//Error handler function
app.use((err, req, res, next) => {
  const error = app.get("env") === "development" ? err : {};
  const status = err.status || 500;

  //Respond to client
  res.status(status).json({
    error: {
      message: error.message,
    },
  });

  //Respond to ourselves
  console.error(err);
});

//Start the server
const port = 3000 || process.env.PORT;
app.listen(port, () => console.log("Server is listenning on port " + port));
