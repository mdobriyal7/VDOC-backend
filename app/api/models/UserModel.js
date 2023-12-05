// js imports
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// project imports
const Project = require("./ProjectModel").schema;


// Model Utils
var validateEmail = function (email) {
  var re =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(email);
};


// User Schema 
const userSchema = new mongoose.Schema({
  full_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validateEmail: [validateEmail, "Please fill a valid email address"],
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minLength: 8,
  },
  user_type: {
    type: [Number],
    default: [1],
  },
  profilePicture: {
    type: String,
    default:
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png",
  },
  designation: {
    type: String,
    required: true,
  },
  projects: {
    type: [Project],
  },
  createdAt: Date
});


// Hashing Password
const saltRound = 10
userSchema.pre("save", function (next) {
  this.password = bcrypt.hashSync(this.password, saltRound);
  next();
})

// Exporting Model
module.exports = mongoose.model("User", userSchema);
