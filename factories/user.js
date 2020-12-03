const bcrypt = require("bcryptjs");
const { use } = require("passport");
const User = require("../model/User");
module.exports = {
  getAllUsers: (result) => {
    User.find({},{ "password": 0 }).exec((err,users)=>{
      result(err,users.map(users => users.toJSON()));
    });
  },
  getUserByUsername: (username,result) =>{
    User.findOne({ username },{ "password": 0 }).exec((err, user) => {
      result(err,user.toJSON());
    });
  }, 
  getUserById: (id,result) =>{
    User.findById(id,{ "password": 0 }).exec((err, user) => {
      result(err,user);
    });
  },
  addUser: ({username,password,fullName,email,phoneNumber,type},result) =>{
    bcrypt.genSalt(10, function (err, salt) {
      if (err) result("Hata oluştu",null);
      bcrypt.hash("ogrenci", salt, async function (err, hash) {
        if (err) result("Hata oluştu",null);
        const newUser = new User({
          username: username,
          password: hash,
          fullName: fullName,
          email: email,
          phoneNumber: phoneNumber,
          type: type,
          superAdmin: false
        });

        await newUser.save((err,doc)=>{
          if(err){
            if(err.keyValue.username){
              result(err.keyValue.username+" kullanıcı adı kullanılıyor!",null);
            }
            if(err.keyValue.email){
              console.log("burada2")
              result(err.keyValue.email +" mail adresi kullanılıyor!",null);
            }
          }
          else{
            result(null,"Kullanıcı başarıyla eklenmiştir.");
          };
        });
      });
    });   
  },

  updateUser: async (id,data,result) =>{
    try {
      await User.findByIdAndUpdate(id,data,(err,doc)=>{
        if(!err){
          result(null,"Kullanıcı başarı ile güncellenmiştir.");
        }
      });
    } catch (err) {
      if(err){if(err.keyValue.username){
        result(err.keyValue.username+" kullanıcı adı kullanılıyor!",null);
      }
      if(err.keyValue.email){
        result(err.keyValue.email +" mail adresi kullanılıyor!",null);
      }}
    }
  },

  removeUser: (id,result) =>{
    User.findById(id,{ "password": 0 },(err, user) => {
      if (err) result("Hata oluştu",null);
      if(user.superAdmin){
        result("Bu kullanıcı silinemez!",null);
      }
      else{
        user.deleteOne();
        result(err,"Kullanıcı başarıyla silindi.");
      }      
    });
  },

  updateUserProfilPhoto: async (id,data,result) =>{
    var user = await User.findById(id);
    console.log(user);
    user.profilPhoto = data;
    user.save((err,doc)=>{
      if(err) result("Beklenmeyen bir hata oluştu", null);
      else result(null, "Profil resmi başarıyla güncellendi")
    })
  }
};


