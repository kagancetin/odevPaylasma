const bcrypt = require("bcryptjs");
const passport = require("passport");
const formValidation = require("../helpers/formValidation");
const User = require("../model/User");
require("../helpers/passport/local");

module.exports = {
  getIndex: async (req, res, next) => {
    res.render("pages/index");
  },
  getLogin: async (req, res, next) => {
    res.locals.loginError = req.flash("error");
    res.locals.username = req.flash("username");
    res.render("pages/login", {layout: 'loginLayout.handlebars', refPath: req.query.ref});
  },
  logout: async (req,res,next) => {
    req.logout();
    res.redirect('/login');
  },
  postLogin: async (req, res, next) => {
    let refPath = req.query.ref ? req.query.ref : '/';
    const username = req.body.username;
    const password = req.body.password;

    const validationErrors = formValidation.loginValidation(username, password);

    if (validationErrors.length > 0) {
      res.locals.loginError = validationErrors;
      return res.render("pages/login", {layout: 'loginLayout.handlebars',username,password});
    }

    req.flash("username",username);

    passport.authenticate("local", {
      successRedirect: refPath,
      failureRedirect: "/login?ref="+refPath,
      badRequestMessage: false ,
      failureFlash: true,
      successFlash: true,
    })(req, res, next);
    /*
    const username = req.body.username;
    const password = req.body.password;

    const validationErrors = formValidation.loginValidation(username, password);
    if (validationErrors.length > 0) {
      return res.render("pages/login", {
        username: username,
        password: password,
        errors: validationErrors,
      });
    }
    
    const newUser = new User({
      username: username,
      password: password,
    });
    newUser.save().then(() => {
      req.flash("flashSuccess","Kullanıcı Başarıyla Eklendi.")
      res.redirect("/");
    }).catch(err => console.log(err)); 
    */
  },
  settings: async (req, res, next) => {
    if(req.user){
      User.findOne({ username: req.user.username },{ "password": 0 }).exec((err, user) => {
        res.render("pages/settings" ,user);
      });
    }
  },
};
