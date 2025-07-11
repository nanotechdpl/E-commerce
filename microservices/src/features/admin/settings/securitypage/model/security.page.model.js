const mongoose = require("mongoose");
const schema = mongoose.Schema;

const SecurityPageSchema = new schema({
  image: {
    type: String,
  },
   title : {
    type: String,
  },
  tag: {
    type: String,
  },
  description: {
    type: String,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const securityPageModel = mongoose.model("security_page", SecurityPageSchema);
module.exports = {
  securityPageModel,
};
