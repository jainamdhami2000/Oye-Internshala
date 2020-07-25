//jshint esversion:6

const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const employeruserSchema = new mongoose.Schema({
  local: {
    password: String,
  },
  username:String,
  FirstName: String,
  LastName: String,
  image:Object,
  CompanyName:String,
  City:String,
  Email: String,
  MainOfficeLocation:String,
});

employeruserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

employeruserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model("EmployerUser", employeruserSchema);
