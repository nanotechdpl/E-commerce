const mongoose = require('mongoose');
const RealEstateOrderCounterSchema = new mongoose.Schema({
  modelName: { type: String, required: true },
  sequenceValue: { type: Number, default: 0 }, 
});

module.exports = mongoose.model('RealEstateOrderCounter', RealEstateOrderCounterSchema);   