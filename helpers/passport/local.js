const localStrategy = require("passport-local").Strategy;
const passport = require("passport");
const bcrypt = require("bcryptjs");
const User = require("../../model/User");

passport.use(
  new localStrategy((username, password, done) => {
    User.findOne({ username }, (err, user) => {
      if (err) {
        return done(err, null, {message:"Bir hata oluştu."});
      }
      if (!user) {
        return done(null, false, {message:"Kullanıcı bulunamadı."});
      }
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          return done(null, user, {message:"Başarıyla giriş yapıldı."});
        } else {
          return done(null, false, {message:"Yanlış şifre girdiniz!"});
        }
      });
    });
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
