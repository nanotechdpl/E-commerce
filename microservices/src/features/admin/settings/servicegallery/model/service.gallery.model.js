const mongoose = require("mongoose");
const schema = mongoose.Schema;

const ServiceGallerySchema = new schema({
  media: {
    type: String,
  },
   title : {
    type: String,
  },
  category : {
      type: String,
  },
  media_type: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const serviceGalleryModel = mongoose.model("service_gallery", ServiceGallerySchema);
module.exports = {
  serviceGalleryModel,
};