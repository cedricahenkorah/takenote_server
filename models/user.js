const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

// static signup function
userSchema.statics.signup = async function (username, email, password) {
  // validation
  if (!username || !email || !password) {
    throw Error("Please fill out the signup form");
  }

  if (!validator.isEmail(email)) {
    throw Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw Error(
      "Password is not strong enough, must be at least 8 characters long, include at least one upppercase letter, one lowercase letter, one number and one special character (e.g., !, @, #, $, etc.)"
    );
  }

  // check if username and email exists
  const usernameExists = await this.findOne({ username });

  if (usernameExists) {
    throw Error("This username already exists, please select another username");
  }

  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error("This email is already in use");
  }

  // generate salt and hash password
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  // save hashed password and store in db with user
  const user = await this.create({ username, email, password: hash });

  return user;
};

// static login function
userSchema.statics.login = async function (username, password) {
  // validation
  if (!username || !password) {
    throw Error("Please enter username and password");
  }

  // check if user exists
  const user = await this.findOne({ username });

  if (!user) {
    throw Error("Invalid login credentials");
  }

  // compare hashed passwords
  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    throw Error("Invalid login credentials");
  }

  return user;
};

module.exports = mongoose.model("User", userSchema);
