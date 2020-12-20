const bcrypt = require("bcryptjs");
const { use } = require("passport");
const User = require("../model/User");
const UserFactories = require("../factories/user");
const ManageDocumentHelper = require("../helpers/manageDocument");

module.exports = {
  users: async (req, res, next) => {
    let data = await UserFactories.getAllUsersWithoutPassword();
    let allUsers = data.map(p=>p.toJSON());
    res.render("pages/users",{allUsers});
    /*
    UserFactories.getAllUsers((err,users)=>{
      if(err) throw err;
      else res.render("pages/users",{users});
    });
    */
  },
  usersProfile: async (req, res, next) => {
    UserFactories.getUserByUsername(req.params.username,(err,userInfo)=>{
      res.render("pages/profile" ,{userInfo:userInfo});
    })
  },
  updateInfo: async (req, res, next) => {
    let id = req.body._id;
    if(req.params.id){
      id = req.params.id
    }
    UserFactories.updateUser(id, req.body,(err,result)=>{
    if(err){
      req.flash("error",err);
    }
    else req.flash("success",result);
    if(req.query.ref == 'users'||req.query.ref == 'settings'){
      res.redirect('/'+req.query.ref); 
    }else{
      res.redirect('/users/profile/'+req.body.username);
    }
    });
  },
  resetPassword: async (req, res, next) => {
    let id =  req.params.id;

    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
        if (err) throw err;
        User.findByIdAndUpdate(id, {
          password: hash,
        },(err, doc)=>{
          if(err){
            req.flash("error","Bir hata oluştu.");
            res.redirect("/users");
          }
          if(doc){
            let message = doc.fullName + " kullanıcısının şifresi başarı ile sıfırlanmıştır."
            req.flash("success", message);
            res.redirect("/users");
          }
        })
      });
    });

  },
  updateProfilPhoto: async(req, res, next) => {
    ManageDocumentHelper.uploadFile(req,(err,message,result)=>{
      if(err){
        req.flash("error",err);
        res.redirect('/settings');
      }
      else {
        UserFactories.updateUserProfilPhoto(req.user._id,result.path,(err,message)=>{
          if(err){
            req.flash("error",err);
          }
          else{
            req.flash("success",message);
          }
          res.redirect('/settings');
        })
      }
    });
  },
  updatePassword: async (req, res, next) => {
    if(req.body.newPassword != req.body.renewPassword){
      req.flash("error","Yeni şifreleriniz farklı görünüyor.");
      res.redirect("/settings");
    }
    await bcrypt.compare(req.body.password, req.user.password, async (err, resource) => {
      if (resource) {
        bcrypt.genSalt(10, function (err, salt) {
          bcrypt.hash(req.body.newPassword, salt, async function (err, hash) {
            if (err) throw err;
            User.findByIdAndUpdate(req.user._id, {
              password: hash,
            },(err, doc)=>{
              if(err){
                req.flash("error","Bir hata oluştu.");
                res.redirect("/settings");
              }
              if(doc){
                req.flash("success","Bilgileriniz başarı ile güncellenmiştir.");
                res.redirect("/settings");
              }
            })
          });
        });
      }
      else{
        req.flash("error","Şifreniz hatalı");
        res.redirect("/settings");
      }
    });
  },
  userAdd: async (req, res, next) => {
    let redata = req.flash("redata");
    res.render("pages/userAdd",{redata: redata[0]});
  },

  postUserAdd: async (req, res, next) => {
    UserFactories.addUser(req.body,(err,result)=>{
      if(err){
        req.flash("redata",req.body);
        req.flash("error",err);
      }
      else req.flash("success",result);
      res.redirect("/users/userAdd");
    });
  },
  removeUser: async (req, res, next) => {
    UserFactories.removeUser(req.params.id,(err,result)=>{
      if(err){
        req.flash("error",err);
      }
      else req.flash("success",result);
      res.redirect("/users");
    })
  },
};
