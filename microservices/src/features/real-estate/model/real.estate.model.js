const mongoose = require("mongoose");
const schema = mongoose.Schema;


const RealEstateSchema = new schema({
  photo: { type: String, required: true },
  propertyStatus:{
    type: String,
    required: true,
  },
   type: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true
  },
  sizeOrSquareFeet: {
    type: String,
   default: 0
  },
  priceOrBudget: {
    type: String, 
    default : 0
  },
 beds:{
    type: String,
    default: 0
  },
  bathRoom: {
    type: String,
    default: 0
  },
  kitchen: {
    type: String,
    default: 0
  },
  features:{
    type:[String],
    default: []
  },
    description: { type: String, required: true },

    visible: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }


  
});


module.exports = mongoose.model("realEstate", RealEstateSchema);

