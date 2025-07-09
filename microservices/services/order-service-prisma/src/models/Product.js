const { prisma } = require('../config/database');

class Product {
    static async getAll(limit = 20, offset = 0) {
        return await prisma.product.findMany({
            orderBy: { name: 'asc' },
            take: limit,
            skip: offset
        });
    }

    static async findById(id) {
        return await prisma.product.findUnique({
            where: { id: parseInt(id) }
        });
    }

    static async updateStock(id, quantity) {
        return await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                stockQuantity: quantity,
                updatedAt: new Date()
            }
        });
    }

    static async search(searchTerm, limit = 20, offset = 0) {
        return await prisma.product.findMany({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { category: { contains: searchTerm, mode: 'insensitive' } }
                ]
            },
            orderBy: { name: 'asc' },
            take: limit,
            skip: offset
        });
    }

    static async count() {
        return await prisma.product.count();
    }

    static async countBySearch(searchTerm) {
        return await prisma.product.count({
            where: {
                OR: [
                    { name: { contains: searchTerm, mode: 'insensitive' } },
                    { description: { contains: searchTerm, mode: 'insensitive' } },
                    { category: { contains: searchTerm, mode: 'insensitive' } }
                ]
            }
        });
    }

    static async create(productData) {
        return await prisma.product.create({
            data: productData
        });
    }

    static async update(id, productData) {
        return await prisma.product.update({
            where: { id: parseInt(id) },
            data: {
                ...productData,
                updatedAt: new Date()
            }
        });
    }

    static async delete(id) {
        return await prisma.product.delete({
            where: { id: parseInt(id) }
        });
    }
}

module.exports = Product;