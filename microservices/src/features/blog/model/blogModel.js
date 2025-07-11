const mongoose = require("mongoose");
const schema = mongoose.Schema;

const BlogSchema = new schema({
 title: {
    type: String,
  },
  description : {
    type: String,
  },
  photo: {
    type: String,
  },
  tag: {
    type: String,
  },
  price:{
    type: Number, default : 0
  },
  view: {
    type: Number, default : 0
  },
  share: {
    type: Number, default : 0
  },
  favourite: {
    type: Number, default : 0
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active",
  }
  
},

{
  timestamps: true
});


module.exports = mongoose.model("blog",BlogSchema);

