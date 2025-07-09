const mongoose = require("mongoose");
const schema = mongoose.Schema;


const noticeSchema = new schema({
    title: {
      type: String,
      required: true,
    },
    photo: {
      type: String, 
      required: true,
    },
    visible: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  },
{
  timestamps: true,
}
);
  

   module.exports =  mongoose.model("notice", noticeSchema);