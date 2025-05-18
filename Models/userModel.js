const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  adhar: String,
  location: String,
  role: { type: String, enum: ["citizen", "admin"], default: "citizen" }, // Role field
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);