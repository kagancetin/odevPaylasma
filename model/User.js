const mongoose = require("mongoose");
const path = require('path');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: {
    type: String,
    trim: true,
    index: { unique: true },
    required: true
  },
  password: {
    type: String,
    required: true
  },
  type: {
    type: Number,
    required: true
  },
  fullName: {
    type: String
  },
  phoneNumber: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    index: { unique: true }
  },
  profilPhoto:{
    type: String,
    default: '/assets/images/users/default.jpg'
  },
  lastConnect: {
    type: Date
  },
  superAdmin:{
    type: Boolean
  }
});

const User = mongoose.model("User", UserSchema);
module.exports = User;
