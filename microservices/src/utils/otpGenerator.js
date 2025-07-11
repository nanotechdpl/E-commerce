
const generateOTP = async () => {
    let otp  = Math.floor(Math.random() * 999999)

    while(Number(otp).toString().length < 6){
        otp  = Math.floor(Math.random() * 999999) 
    }
    return otp
}


module.exports = generateOTP

