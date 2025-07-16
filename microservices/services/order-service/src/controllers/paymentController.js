const Payment = require('../models/Payment');
const { client } = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk');

async function createPaypalOrder({ amount, currency, order_id, return_url, cancel_url, description }) {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
        intent: 'CAPTURE',
        application_context: {
            return_url,
            cancel_url,
            brand_name: process.env.BRAND_NAME || 'Order Platform',
            landing_page: 'BILLING',
            user_action: 'PAY_NOW'
        },
        purchase_units: [{
            reference_id: order_id ? order_id.toString() : undefined,
            amount: {
                currency_code: currency,
                value: amount.toFixed(2)
            },
            description
        }]
    });
    return client().execute(request);
}

class PaymentController {
    static async createPayment(req, res) {
        try {
            const { order_id, user_id, agency_id, amount, currency = 'USD', type = 'order', return_url, cancel_url } = req.body;
            const description = type === 'security_deposit' ? 'Security Deposit' : type === 'annual_fee' ? 'Annual Fee' : `Order #${order_id}`;
            const paypalOrder = await createPaypalOrder({ amount, currency, order_id, return_url, cancel_url, description });
            const payment = await Payment.create({
                order_id,
                user_id,
                agency_id,
                amount,
                currency,
                payment_method: 'paypal',
                paypal_order_id: paypalOrder.result.id,
                type,
                metadata: {
                    paypal_status: paypalOrder.result.status,
                    paypal_links: paypalOrder.result.links
                }
            });
            const approvalUrl = paypalOrder.result.links.find(link => link.rel === 'approve');
            res.status(201).json({
                success: true,
                data: {
                    payment_id: payment.payment_id,
                    paypal_order_id: paypalOrder.result.id,
                    approval_url: approvalUrl ? approvalUrl.href : null,
                    status: paypalOrder.result.status
                },
                message: 'PayPal order created successfully'
            });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }

    static async getPaymentsByOrder(req, res) {
        try {
            const payments = await Payment.getByOrder(req.params.order_id);
            res.json({ success: true, data: payments });
        } catch (error) {
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async updatePaymentStatus(req, res) {
        try {
            const payment = await Payment.updateStatus(req.params.payment_id, req.body.status);
            res.json({ success: true, data: payment });
        } catch (error) {
            res.status(400).json({ success: false, message: error.message });
        }
    }
}

module.exports = PaymentController; 