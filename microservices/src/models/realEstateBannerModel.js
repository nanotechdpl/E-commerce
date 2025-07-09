const mongoose = require('mongoose');


const  RealEstateBannerSchema = new mongoose.Schema({
  image:{
    type:mongoose.SchemaTypes.String
  },
   header:{
         type:mongoose.SchemaTypes.String
      },
      subHeaderOne:{
         type:mongoose.SchemaTypes.String
      },
      subHeaderTwo:{
         type:mongoose.SchemaTypes.String
      },
      subHeaderThree:{
         type:mongoose.SchemaTypes.String
      },
      subHeaderFour:{
         type:mongoose.SchemaTypes.String
      },
      description:{
        type:mongoose.SchemaTypes.String
     },
      
})

const RealEstateBannerModel = mongoose.model('realEstate-banner',RealEstateBannerSchema)

module.exports = RealEstateBannerModel