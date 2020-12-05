module.exports = {
  loginValidation: (username, password) => {
    let errors= [];
    
    if (username === "") {
      errors.push("Kullanıcı adınızı giriniz!");
    }

    else if (password === "") {
      errors.push("Şifre giriniz!");
    }
    return errors;
  },
};
