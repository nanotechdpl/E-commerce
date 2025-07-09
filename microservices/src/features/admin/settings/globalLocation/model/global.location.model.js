const mongoose = require("mongoose");
const schema = mongoose.Schema;

const Riderschema = new schema({

  
  photo: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
   call: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
 
  email: {
    type: String,
    required: true,
  },
  
    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    links: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
},
{
  timestamps:true
});
const globalLocationModel = mongoose.model("global_location", Riderschema);
module.exports = globalLocationModel;

