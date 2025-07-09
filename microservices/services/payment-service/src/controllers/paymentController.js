const Payment = require('../models/Payment');
const Refund = require('../models/Refund');
const { client } = require('../config/paypal');
const paypal = require('@paypal/checkout-server-sdk');

class PaymentController {
    static async createOrder(req, res) {
        try {
            const { order_id, customer_id, amount, currency = 'USD', return_url, cancel_url } = req.body;

            // Create PayPal order
            const request = new paypal.orders.OrdersCreateRequest();
            request.prefer("return=representation");
            request.requestBody({
                intent: 'CAPTURE',
                application_context: {
                    return_url: return_url || `${process.env.FRONTEND_URL}/payment/success`,
                    cancel_url: cancel_url || `${process.env.FRONTEND_URL}/payment/cancel`,
                    brand_name: process.env.BRAND_NAME || 'Your Store',
                    landing_page: 'BILLING',
                    user_action: 'PAY_NOW'
                },
                purchase_units: [{
                    reference_id: order_id.toString(),
                    amount: {
                        currency_code: currency,
                        value: amount.toFixed(2)
                    },
                    description: `Order #${order_id}`
                }]
            });

            const order = await client().execute(request);

            // Save payment record
            const payment = await Payment.create({
                order_id,
                customer_id,
                amount,
                currency,
                paypal_order_id: order.result.id,
                metadata: {
                    paypal_status: order.result.status,
                    paypal_links: order.result.links
                }
            });

            // Find approval URL
            const approvalUrl = order.result.links.find(link => link.rel === 'approve');

            res.status(201).json({
                success: true,
                data: {
                    payment_id: payment.payment_id,
                    paypal_order_id: order.result.id,
                    approval_url: approvalUrl ? approvalUrl.href : null,
                    status: order.result.status
                },
                message: 'PayPal order created successfully'
            });

        } catch (error) {
            console.error('PayPal order creation error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create PayPal order'
            });
        }
    }

    static async captureOrder(req, res) {
        try {
            const { paypal_order_id } = req.body;

            // Capture PayPal order
            const request = new paypal.orders.OrdersCaptureRequest(paypal_order_id);
            request.requestBody({});

            const capture = await client().execute(request);

            // Find and update payment record
            const payment = await Payment.findByPaypalOrderId(paypal_order_id);
            if (payment) {
                let status = 'pending';
                let capture_id = null;

                if (capture.result.status === 'COMPLETED') {
                    status = 'completed';
                    const captureDetail = capture.result.purchase_units[0].payments.captures[0];
                    capture_id = captureDetail.id;
                } else if (capture.result.status === 'DECLINED') {
                    status = 'failed';
                }

                await Payment.updateStatus(payment.payment_id, status, capture_id);
            }

            res.json({
                success: true,
                data: {
                    status: capture.result.status,
                    paypal_order_id: capture.result.id,
                    capture_id: capture.result.purchase_units[0]?.payments?.captures[0]?.id
                }
            });

        } catch (error) {
            console.error('PayPal capture error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to capture PayPal order'
            });
        }
    }

    static async getPayment(req, res) {
        try {
            const payment = await Payment.findByPaymentId(req.params.payment_id);

            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            res.json({
                success: true,
                data: payment
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getOrderPayments(req, res) {
        try {
            const payments = await Payment.findByOrderId(req.params.order_id);

            res.json({
                success: true,
                data: payments
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getCustomerPayments(req, res) {
        try {
            const { customer_id } = req.params;
            const { page = 1, limit = 10 } = req.query;
            const offset = (page - 1) * limit;

            const payments = await Payment.findByCustomerId(customer_id, parseInt(limit), offset);

            res.json({
                success: true,
                data: payments,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit)
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async createRefund(req, res) {
        try {
            const { payment_id, amount, reason } = req.body;

            const payment = await Payment.findByPaymentId(payment_id);
            if (!payment) {
                return res.status(404).json({
                    success: false,
                    message: 'Payment not found'
                });
            }

            if (!payment.paypal_capture_id) {
                return res.status(400).json({
                    success: false,
                    message: 'Payment has not been captured, cannot refund'
                });
            }

            // Create refund with PayPal
            const request = new paypal.payments.CapturesRefundRequest(payment.paypal_capture_id);
            request.requestBody({
                amount: {
                    currency_code: payment.currency,
                    value: amount ? amount.toFixed(2) : payment.amount.toString()
                },
                note_to_payer: reason || 'Refund for your order'
            });

            const refundResponse = await client().execute(request);

            // Save refund record
            const refund = await Refund.create({
                payment_id,
                amount: parseFloat(refundResponse.result.amount.value),
                reason,
                paypal_refund_id: refundResponse.result.id
            });

            await Refund.updateStatus(refund.refund_id, refundResponse.result.status.toLowerCase());

            res.status(201).json({
                success: true,
                data: {
                    ...refund,
                    paypal_status: refundResponse.result.status
                },
                message: 'Refund created successfully'
            });

        } catch (error) {
            console.error('PayPal refund error:', error);
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to create refund'
            });
        }
    }

    static async getOrderDetails(req, res) {
        try {
            const { paypal_order_id } = req.params;

            const request = new paypal.orders.OrdersGetRequest(paypal_order_id);
            const order = await client().execute(request);

            res.json({
                success: true,
                data: order.result
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message || 'Failed to get order details'
            });
        }
    }

    static async preparePayment(req, res) {
        try {
            // This endpoint is called by order service to prepare payment
            const { order_id, amount, customer_id } = req.body;

            // Just acknowledge the preparation - actual payment happens later
            res.json({
                success: true,
                message: 'Payment preparation acknowledged',
                data: {
                    order_id,
                    amount,
                    customer_id,
                    status: 'prepared'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async webhookHandler(req, res) {
        try {
            // Handle PayPal webhooks for payment status updates
            const event = req.body;

            console.log('PayPal webhook received:', event.event_type);

            switch (event.event_type) {
                case 'PAYMENT.CAPTURE.COMPLETED':
                    await this.handleCaptureCompleted(event);
                    break;
                case 'PAYMENT.CAPTURE.DENIED':
                    await this.handleCaptureDenied(event);
                    break;
                default:
                    console.log('Unhandled webhook event:', event.event_type);
            }

            res.status(200).json({ success: true });
        } catch (error) {
            console.error('Webhook error:', error);
            res.status(500).json({ success: false });
        }
    }

    static async handleCaptureCompleted(event) {
        const captureId = event.resource.id;
        // Update payment status based on capture ID
        // This would require additional logic to find the payment by capture ID
    }

    static async handleCaptureDenied(event) {
        const captureId = event.resource.id;
        // Update payment status to failed
        // This would require additional logic to find the payment by capture ID
    }
}

module.exports = PaymentController;