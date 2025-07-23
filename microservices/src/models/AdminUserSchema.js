const mongoose = require("mongoose");
const CounterModel = require("../../auth/models/schema/counterSchema.js");

let newUserSchema = new mongoose.Schema({

  email: {
    type: mongoose.Schema.Types.String,
    unique: [true, "email already exists"],
    validate: {
      validator: (value) => {
        const re =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.]*)*)|(\".+\"))@((([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})|(\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b))$/i;
        return value.match(re);
      },
      message: "Please enter a valid email",
    },
  },
  login_url: {
    type: mongoose.Schema.Types.String,
  },
  password: {
    type: mongoose.Schema.Types.String,
  },
  profileImage: {
    type: mongoose.Schema.Types.String,
  },
  name: {
    type: mongoose.Schema.Types.String,
  },
  pincode: {
    type: mongoose.Schema.Types.String,
  },
  permissions: {
    type: [String],
    default: []
  },
  isSuspended: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  isBlocked: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  isDeleted: {
    type: mongoose.Schema.Types.Boolean,
    default: false,
  },
  lastActiveAt: {
    type: mongoose.Schema.Types.Date,
  },
  createdAt: {
    type: mongoose.Schema.Types.Date,
    default: Date.now,
  },
});



let userAdminModel = mongoose.model("UsersAdmin", newUserSchema);

module.exports = userAdminModel;
