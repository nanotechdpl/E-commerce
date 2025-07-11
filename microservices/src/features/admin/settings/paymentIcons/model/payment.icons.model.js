const mongoose = require('mongoose');

const paymentIconSchema = new mongoose.Schema(
    {
        icon: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { timestamps: true } // Automatically adds createdAt and updatedAt timestamps
);

const PaymentIcon = mongoose.model('PaymentIcon', paymentIconSchema);

module.exports = PaymentIcon;