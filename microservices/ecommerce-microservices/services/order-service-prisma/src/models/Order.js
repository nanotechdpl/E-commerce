const { prisma } = require('../config/database');

class Order {
    static async create(orderData) {
        const { customer_id, items, shipping_address } = orderData;
        const order_number = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        return await prisma.$transaction(async (tx) => {
            // Check product availability and calculate total
            let total_amount = 0;
            const itemsWithDetails = [];

            for (const item of items) {
                const product = await tx.product.findUnique({
                    where: { id: item.product_id }
                });

                if (!product) {
                    throw new Error(`Product with ID ${item.product_id} not found`);
                }

                if (product.stockQuantity < item.quantity) {
                    throw new Error(`Insufficient stock for product ID ${item.product_id}`);
                }

                const itemTotal = product.price * item.quantity;
                total_amount += itemTotal;

                itemsWithDetails.push({
                    product_id: item.product_id,
                    product_name: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    total: itemTotal
                });
            }

            // Create order with items
            const order = await tx.order.create({
                data: {
                    orderNumber: order_number,
                    customerId: customer_id,
                    totalAmount: total_amount,
                    shippingAddress: shipping_address,
                    items: {
                        create: itemsWithDetails.map(item => ({
                            productId: item.product_id,
                            productName: item.product_name,
                            quantity: item.quantity,
                            price: item.price,
                            total: item.total
                        }))
                    }
                },
                include: {
                    items: true
                }
            });

            // Update stock quantities
            for (const item of items) {
                await tx.product.update({
                    where: { id: item.product_id },
                    data: {
                        stockQuantity: {
                            decrement: item.quantity
                        }
                    }
                });
            }

            return order;
        });
    }

    static async findById(id) {
        return await prisma.order.findUnique({
            where: { id: parseInt(id) },
            include: {
                items: true
            }
        });
    }

    static async findByCustomerId(customer_id, limit = 10, offset = 0) {
        return await prisma.order.findMany({
            where: { customerId: parseInt(customer_id) },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                items: true
            }
        });
    }

    static async updateStatus(id, status) {
        return await prisma.order.update({
            where: { id: parseInt(id) },
            data: {
                status: status.toUpperCase(),
                updatedAt: new Date()
            },
            include: {
                items: true
            }
        });
    }

    static async getAll(limit = 10, offset = 0) {
        return await prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: offset,
            include: {
                items: true
            }
        });
    }

    static async count() {
        return await prisma.order.count();
    }

    static async countByCustomerId(customer_id) {
        return await prisma.order.count({
            where: { customerId: parseInt(customer_id) }
        });
    }
}

module.exports = Order;