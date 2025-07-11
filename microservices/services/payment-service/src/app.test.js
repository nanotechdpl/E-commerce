const request = require('supertest');
const app = require('./app');

describe('Payment Service App', () => {
    describe('GET /health', () => {
        it('should return healthy status and service info', async () => {
            const res = await request(app).get('/health');
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('status', 'healthy');
            expect(res.body).toHaveProperty('service', 'payment-service');
            expect(res.body).toHaveProperty('timestamp');
        });
    });

    describe('Middleware', () => {
        it('should parse JSON bodies', async () => {
            // /api/payments route should exist, but we don't know its implementation.
            // We'll test that invalid JSON returns a 400 error (express.json() behavior).
            const res = await request(app)
                .post('/api/payments')
                .set('Content-Type', 'application/json')
                .send('{"invalidJson": }');
            // Should be handled by express.json() and errorHandler
            expect(res.statusCode).toBeGreaterThanOrEqual(400);
        });

        it('should set security headers with helmet', async () => {
            const res = await request(app).get('/health');
            expect(res.headers).toHaveProperty('x-dns-prefetch-control');
            expect(res.headers).toHaveProperty('x-frame-options');
            expect(res.headers).toHaveProperty('x-content-type-options');
        });

        it('should allow CORS', async () => {
            const res = await request(app)
                .get('/health')
                .set('Origin', 'http://example.com');
            expect(res.headers).toHaveProperty('access-control-allow-origin');
        });
    });

    describe('Error Handling', () => {
        it('should handle 404 errors', async () => {
            const res = await request(app).get('/non-existent-route');
            expect(res.statusCode).toBe(404);
        });
    });
});

// We recommend installing an extension to run jest tests.