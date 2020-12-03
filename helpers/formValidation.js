module.exports = {
  loginValidation: (username, password) => {
    let errors = "";
    
    if (username === "") {
      errors = "Kullanıcı adınızı giriniz!" ;
    }

    else if (password === "") {
      errors = "Şifre giriniz!" ;
    }
    return errors;
  },
};
