module.exports = {
  authCheck: (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    } else {
      return res.redirect("/login?ref="+req.originalUrl);
    }
  },
  authCheckAdmin: (req, res, next) => {
    if (req.isAuthenticated()) {
      if(req.user.type == 0)return next();
      else{
        req.flash("warning", "Giriş yetkiniz bulunmamaktadır.")
        res.redirect("/");
      } 
    } else {
      return res.redirect("/login?ref="+req.originalUrl);
    }
  },
};
