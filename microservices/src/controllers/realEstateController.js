const realEstateBannerModel = require("../models/realEstateBannerModel")

const realEstateModel = require("../model/realEstateModel")

const  uploadRealEstate =  async (req,res) => {

    try {

        const {client,location,surfaceArea,yearsCompleted,house,bed,bath,kitchen,architect,address,price} = req.body

      if(!house || !kitchen || !bed || !price){
        res.status(400).json({
            title:"Real Estate Message",
            status:400,
            successful:false,
            message:"Atleast area of the house, no of kitchens,price and no of bed rooms fields are needed to upload real estate."
        })
        return
      }

       const newRealEstate = new realEstateModel({
        client,location,surfaceArea,yearsCompleted,house,bed,bath,kitchen,architect,address,price

       })

       await  newRealEstate.save()

        const realestates =   await realEstateModel.find().sort('-1')

       res.status(200).json({
        title:"Real Estate Message",
        status:200,
        successful:true,
        message:"Successfully uploaded service.",
        realestates
    })
   
    
        
    } catch (error) {
        res.status(500).json({
            title:"Real Estate Message",
            status:500,
            successful:false,
            message:"Internal server error.",
            error:error.message
        })
        return
    }
}


const getRealEstate = async (req,res) => {
  try {

    const realEstates = await realEstateModel.find().sort('-1')
    const realEstateBanner = await realEstateBannerModel.find()
    res.status(200).json(
        {
            response:{
                title:"Get real estate Message",
                status:200,
                successful:true,
                message:"Successfully fetched projects.",
                cardData: realEstates,
                bannerData: realEstateBanner
            }
        }
    );

  } catch (error) {
   
    res.status(500).json({
            title:"Get real Estate Message",
            status:500,
            successful:false,
            message:"Internal Server error.",
             error:error.message
        })
     
  }
}

//admin functionality edit blog top view 
const  addRealEstateHeaderView  = async  (req,res) => {
       
   const {header,subHeaderOne,subHeaderTwo,subHeaderThree,subHeaderFour,image, description} =  req.body

   if(!header || !image || !description){
    res.status(400).json({
      status:400,
      message:'Alteast header,image and description field is needed to continue.subHeaderOne,subHeaderTwo,subHeaderThree,subHeaderFour fields are optional'
    })
    return
   }

   const newBanner =  new realEstateBannerModel({
    header,subHeaderOne,subHeaderTwo,subHeaderThree,subHeaderFour,image, description 
   })

   await  newBanner.save()

   res.status(200).json({
    status:200,
    message:'Banner added successfully.',
    bannerDetails:newBanner
  })

}

 const  updateRealEstateHeaderView  = async  (req,res) => {
 
   const {header,subHeaderOne,subHeaderTwo,subHeaderThree,subHeaderFour,image, description,bannerId} =  req.body

   if(!header || !image || !description || !bannerId){
    res.status(400).json({
      status:400,
      message:'Alteast header,image and description and bannerId fields are needed to continue.subHeaderOne,subHeaderTwo,subHeaderThree,subHeaderFour fields are optional'
    })
    return
   }

   const realEstate = await realEstateBannerModel.findOne({_id:bannerId})

     if(!realEstate){
      res.status(400).json({
        status:400,
        message:'real estate with id not found.'
      })
      return
     }


  realEstate.updateOne({
    header,subHeaderOne:(subHeaderOne)?subHeaderOne:realEstate.subHeaderOne
    ,subHeaderTwo:(subHeaderTwo)?subHeaderTwo:realEstate.subHeaderTwo,subHeaderThree:(subHeaderThree)?subHeaderThree:realEstate.subHeaderThree,subHeaderFour:(subHeaderFour)?subHeaderFour:realEstate.subHeaderFour,image, description 
   })

  

   res.status(200).json({
    status:200,
    message:'realEstate updated successfully.',
    realEstate
  })

}

const  deleteRealEstateHeaderView  = async  (req,res) => {
     
   const {bannerId} =  req.params

   if(!bannerId){
    res.status(400).json({
      status:400,
      message:'bannerId field is  needed to continue.'
    })
    return
   }

   const realEstate = await realEstateBannerModel.findOne({_id:bannerId})

     if(!realEstate){
      res.status(400).json({
        status:400,
        message:'Real Estate with id not found.'
      })
      return
     }


  realEstate.deleteOne({_id:bannerId})

  

   res.status(200).json({
    status:200,
    message:'Banner deleted successfully.'
  })

}

const deleteRealEstate = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if the ID is provided
        if (!id) {
            return res.status(400).json({
                status: 400,
                message: 'Real estate ID is required to delete.',
            });
        }

        // Find and delete the real estate entry
        const deletedRealEstate = await realEstateModel.findByIdAndDelete(id);

        // Check if the real estate was successfully deleted
        if (!deletedRealEstate) {
            return res.status(404).json({
                status: 404,
                message: 'Real estate not found.',
            });
        }

        // Respond with success
        res.status(200).json({
            status: 200,
            message: 'Real estate deleted successfully.',
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            message: 'Internal server error.',
            error: error.message,
        });
    }
}

const searchRealEstate = async (req, res) => {
    try {
        const { query } = req.query; // Get search query from request

        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        // Construct a case-insensitive regex search for string fields
        const searchRegex = new RegExp(query, "i");

        // Convert numeric queries properly
        const numericQuery = !isNaN(query) ? Number(query) : null;

        const results = await realEstateModel.find({
            $or: [
                { client: searchRegex },
                { location: searchRegex },
                { house: searchRegex },
                { architect: searchRegex },
                { address: searchRegex },
                numericQuery !== null ? { surfaceArea: numericQuery } : null,
                numericQuery !== null ? { bed: numericQuery } : null,
                numericQuery !== null ? { bath: numericQuery } : null,
                numericQuery !== null ? { kitchen: numericQuery } : null,
                numericQuery !== null ? { price: numericQuery } : null,
            ].filter(Boolean), // Remove null conditions
        });

        res.json(results);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
}

module.exports = {uploadRealEstate,getRealEstate,addRealEstateHeaderView,
    updateRealEstateHeaderView,deleteRealEstateHeaderView,searchRealEstate, deleteRealEstate}