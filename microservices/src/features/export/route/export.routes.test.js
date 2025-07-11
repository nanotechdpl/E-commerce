const request = require('supertest');
const express = require('express');
const router = require('./export.routes');

jest.mock('../controller/export.controller', () => ({
    getAllExportsWithPaginationAndSearch: jest.fn((req, res) => res.status(200).json({ message: 'pagination and search' })),
    getAllExportsWithSearch: jest.fn((req, res) => res.status(200).json({ message: 'search' })),
    getCategory: jest.fn((req, res) => res.status(200).json({ categories: [] })),
    deleteExport: jest.fn((req, res) => res.status(200).json({ deleted: true })),
    updateExport: jest.fn((req, res) => res.status(200).json({ updated: true })),
    changeExportsStatus: jest.fn((req, res) => res.status(200).json({ statusChanged: true })),
    searchExport: jest.fn((req, res) => res.status(200).json({ results: [] })),
    filterExport: jest.fn((req, res) => res.status(200).json({ filtered: [] })),
    createExport: jest.fn((req, res) => res.status(201).json({ created: true })),
    getAllExports: jest.fn((req, res) => res.status(200).json({ exports: [] })),
    getExportById: jest.fn((req, res) => res.status(200).json({ export: {} })),
}));

jest.mock('../../../middlewares/isAdminMiddleWare', () => (req, res, next) => next());
jest.mock('../../../middlewares/upload', () => ({
    upload: {
        single: () => (req, res, next) => next()
    }
}));

const app = express();
app.use(express.json());
app.use('/exports', router);

describe('Export Routes', () => {
    it('GET /exports/ should call getAllExportsWithPaginationAndSearch', async () => {
        const res = await request(app).get('/exports/');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('pagination and search');
    });

    it('GET /exports/export/category/secarch should call getAllExportsWithSearch', async () => {
        const res = await request(app).get('/exports/export/category/secarch');
        expect(res.statusCode).toBe(200);
        expect(res.body.message).toBe('search');
    });

    it('GET /exports/service/categories should call getCategory', async () => {
        const res = await request(app).get('/exports/service/categories');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.categories)).toBe(true);
    });

    it('DELETE /exports/:id should call deleteExport', async () => {
        const res = await request(app).delete('/exports/123');
        expect(res.statusCode).toBe(200);
        expect(res.body.deleted).toBe(true);
    });

    it('PUT /exports/:id should call updateExport', async () => {
        const res = await request(app)
            .put('/exports/123')
            .send({ name: 'test' });
        expect(res.statusCode).toBe(200);
        expect(res.body.updated).toBe(true);
    });

    it('PUT /exports/status/:id should call changeExportsStatus', async () => {
        const res = await request(app)
            .put('/exports/status/123')
            .send({ status: 'active' });
        expect(res.statusCode).toBe(200);
        expect(res.body.statusChanged).toBe(true);
    });

    it('GET /exports/quick-search should call searchExport', async () => {
        const res = await request(app).get('/exports/quick-search');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.results)).toBe(true);
    });

    it('GET /exports/filter should call filterExport', async () => {
        const res = await request(app).get('/exports/filter');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.filtered)).toBe(true);
    });

    it('POST /exports/ should call createExport', async () => {
        const res = await request(app)
            .post('/exports/')
            .send({ name: 'new export' });
        expect(res.statusCode).toBe(201);
        expect(res.body.created).toBe(true);
    });

    it('GET /exports/ should call getAllExports', async () => {
        const res = await request(app).get('/exports/');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body.exports)).toBe(true);
    });

    it('GET /exports/:id should call getExportById', async () => {
        const res = await request(app).get('/exports/123');
        expect(res.statusCode).toBe(200);
        expect(typeof res.body.export).toBe('object');
    });
});