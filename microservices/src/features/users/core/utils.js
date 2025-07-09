const jwt = require("jsonwebtoken");
const Counter = require('../model/Counter');

//create jwt token for users when the signup or login
const age = Math.floor(Date.now() / 1000) + 10 * 365 * 24 * 60 * 60;


const create_user_token = (user) => {
  return jwt.sign({ user }, 'user', {
    expiresIn: age,
  });
};
//comment added this whole core folder

const handleError = (err) => (res) => {
  return res.status(400).json({
    status_code: 400,
    status: false,
    message: err,
    data: [],
    error: err,
  });
};



function generateRandomString(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
}

function generateRandomNumber(length) {
  let result = "";
  const characters = "0123456789";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  // Pad the result with leading zeros to ensure consistency
  return result.padStart(length, "0");
}

////generate order tracking id and ensure the the order tracking id doesnt exist
//const generateuserauthcode = async () => {
//  let id = generateRandomNumber(6);
//  console.log(id);
//  let checkid = await userModel.findOne({ "auth.auth_code": id });
//  let counter = 0;
//  while (checkid) {
//    counter++;
//    console.log("count :", counter);
//    id = generateRandomNumber(6);
//    console.log("new id", id);
//    checkid = await userModel.findOne({ "auth.auth_code": id });
//  }
//  return id;
//};

async function generateNumber(counterName) {
  try {
    console.log(`Generating number for counter: ${counterName}`);
    
    const counter = await Counter.findOneAndUpdate(
      { name: counterName },       // Search for the counter by name
      { $inc: { sequenceValue: 1 } }, // Increment the sequence value
      { new: true, upsert: true }     // Return the updated document or create a new one
    );

    if (!counter) {
      console.error('Counter document not found or created!');
      throw new Error('Failed to retrieve or create counter document.');
    }

    console.log('Counter document after update:', counter);

    const sequence = counter.sequenceValue;

    if (typeof sequence !== 'number' || isNaN(sequence)) {
      throw new Error(`Invalid sequence value: ${sequence}`);
    }

    return sequence;
  } catch (error) {
    console.error('Error in generateNumber:', error);
    return NaN; // Return NaN to indicate failure
  }
}
(async () => {
  const userSequence = await generateNumber('userNumber');
  console.log('Generated Sequence:', userSequence);
})();



module.exports = {
  create_user_token,
  handleError,
  generateRandomString,
  generateRandomNumber,
  generateNumber
};
