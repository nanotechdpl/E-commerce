const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    // Create sample products
    const products = await prisma.product.createMany({
        data: [
            {
                name: 'Laptop',
                description: 'High-performance laptop',
                price: 999.99,
                stockQuantity: 10,
                category: 'Electronics'
            },
            {
                name: 'Phone',
                description: 'Smartphone with great camera',
                price: 599.99,
                stockQuantity: 25,
                category: 'Electronics'
            },
            {
                name: 'Book',
                description: 'Programming guide',
                price: 39.99,
                stockQuantity: 100,
                category: 'Books'
            }
        ],
        skipDuplicates: true
    });

    console.log('Seeded products:', products);
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
