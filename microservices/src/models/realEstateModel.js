const mongoose = require("mongoose");
const schema = mongoose.Schema;

const RealEstateSchema = new schema({
  client: {
    type: String,
  },
  location : {
    type: String,
  },
  surfaceArea: {
    type: Number, default : 0
  },
  house:{
    type: String
  },
  bed: {
    type: Number, default : 0
  },
  bath: {
    type: Number, default : 0
  },
  kitchen: {
    type: Number, default : 0
  },
  architect: {
    type: String
  },
  address: {
    type: String
  },
  price: {
    type: Number, default : 0
  },
});


module.exports = mongoose.model("realEstate",RealEstateSchema);

