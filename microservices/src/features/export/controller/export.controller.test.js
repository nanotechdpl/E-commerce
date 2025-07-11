const exportController = require('./export.controller');
const Export = require('../model/export.model');

jest.mock('../model/export.model');

const mockRes = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

describe('Export Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllExportsWithPaginationAndSearch', () => {
        it('should return exports with pagination and search', async () => {
            const req = { query: { query: 'test', limit: '2', page: '1' } };
            const res = mockRes();
            Export.find.mockResolvedValueOnce([{ title: 'test' }]);
            Export.countDocuments.mockResolvedValueOnce(1);

            await exportController.getAllExportsWithPaginationAndSearch(req, res);

            expect(Export.find).toHaveBeenCalled();
            expect(Export.countDocuments).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 200, data: [{ title: 'test' }], totalData: 1 })
            );
        });

        it('should handle errors', async () => {
            const req = { query: {} };
            const res = mockRes();
            Export.find.mockRejectedValueOnce(new Error('DB error'));

            await exportController.getAllExportsWithPaginationAndSearch(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: false, status: 500, message: 'Internal server error' })
            );
        });
    });

    describe('getAllExportsWithSearch', () => {
        it('should return exports with category search', async () => {
            const req = { query: { query: 'cat', limit: '1', page: '1' } };
            const res = mockRes();
            Export.find.mockResolvedValueOnce([{ category: 'cat' }]);
            Export.countDocuments.mockResolvedValueOnce(1);

            await exportController.getAllExportsWithSearch(req, res);

            expect(Export.find).toHaveBeenCalled();
            expect(Export.countDocuments).toHaveBeenCalled();
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 200, data: [{ category: 'cat' }], totalData: 1 })
            );
        });
    });

    describe('getCategory', () => {
        it('should return distinct categories', async () => {
            const req = {};
            const res = mockRes();
            Export.distinct.mockResolvedValueOnce(['cat1', 'cat2']);

            await exportController.getCategory(req, res);

            expect(Export.distinct).toHaveBeenCalledWith('category');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 200, successful: true, data: ['cat1', 'cat2'] })
            );
        });

        it('should handle errors', async () => {
            const req = {};
            const res = mockRes();
            Export.distinct.mockRejectedValueOnce(new Error('Error'));

            await exportController.getCategory(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 500, successful: false, message: 'Internal server error.' })
            );
        });
    });

    describe('changeExportsStatus', () => {
        it('should update export status', async () => {
            const req = { params: { id: '1' }, body: { status: 'active' } };
            const res = mockRes();
            Export.findById.mockResolvedValueOnce({ _id: '1' });
            Export.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', status: 'active' });

            await exportController.changeExportsStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 200 })
            );
        });

        it('should return 404 if export not found', async () => {
            const req = { params: { id: '1' }, body: { status: 'active' } };
            const res = mockRes();
            Export.findById.mockResolvedValueOnce(null);

            await exportController.changeExportsStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });

        it('should return 400 for invalid status', async () => {
            const req = { params: { id: '1' }, body: { status: 'invalid' } };
            const res = mockRes();
            Export.findById.mockResolvedValueOnce({ _id: '1' });

            await exportController.changeExportsStatus(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('createExport', () => {
        it('should create a new export', async () => {
            const req = { body: { title: 't', description: 'd', category: 'c', photo: 'p', tag: 'tag' } };
            const res = mockRes();
            Export.mockImplementation(() => ({
                save: jest.fn().mockResolvedValueOnce({ title: 't' })
            }));

            await exportController.createExport(req, res);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 201, data: { title: 't' } })
            );
        });

        it('should return 400 if required fields are missing', async () => {
            const req = { body: { title: '', description: '', category: '', photo: '' } };
            const res = mockRes();

            await exportController.createExport(req, res);

            expect(res.status).toHaveBeenCalledWith(400);
        });
    });

    describe('updateExport', () => {
        it('should update export', async () => {
            const req = { params: { id: '1' }, body: { title: 't', description: 'd', photo: 'p', category: 'c' } };
            const res = mockRes();
            Export.findByIdAndUpdate.mockResolvedValueOnce({ _id: '1', title: 't' });

            await exportController.updateExport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 200, data: { _id: '1', title: 't' } })
            );
        });

        it('should return 404 if export not found', async () => {
            const req = { params: { id: '1' }, body: {} };
            const res = mockRes();
            Export.findByIdAndUpdate.mockResolvedValueOnce(null);

            await exportController.updateExport(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('deleteExport', () => {
        it('should delete export', async () => {
            const req = { params: { id: '1' } };
            const res = mockRes();
            Export.findByIdAndDelete.mockResolvedValueOnce({ _id: '1' });

            await exportController.deleteExport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ success: true, status: 200 })
            );
        });

        it('should return 404 if export not found', async () => {
            const req = { params: { id: '1' } };
            const res = mockRes();
            Export.findByIdAndDelete.mockResolvedValueOnce(null);

            await exportController.deleteExport(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('getAllExports', () => {
        it('should fetch all exports', async () => {
            const req = { query: {} };
            const res = mockRes();
            Export.find.mockResolvedValueOnce([{ title: 't' }]);

            await exportController.getAllExports(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Exports fetched successfully', exports: [{ title: 't' }] })
            );
        });
    });

    describe('getExportById', () => {
        it('should fetch export by id', async () => {
            const req = { params: { id: '1' } };
            const res = mockRes();
            Export.findById.mockResolvedValueOnce({ _id: '1' });

            await exportController.getExportById(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ message: 'Export fetched successfully', data: { _id: '1' } })
            );
        });

        it('should return 404 if not found', async () => {
            const req = { params: { id: '1' } };
            const res = mockRes();
            Export.findById.mockResolvedValueOnce(null);

            await exportController.getExportById(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
        });
    });

    describe('filterExport', () => {
        it('should filter exports', async () => {
            const req = { query: { title: 't', description: 'd', category: 'c' } };
            const res = mockRes();
            Export.find.mockResolvedValueOnce([{ title: 't', description: 'd', category: 'c' }]);

            await exportController.filterExport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 200, successful: true, count: 1 })
            );
        });
    });

    describe('searchExport', () => {
        it('should search exports by title', async () => {
            const req = { query: { title: 't' } };
            const res = mockRes();
            Export.find.mockResolvedValueOnce([{ title: 't' }]);

            await exportController.searchExport(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(
                expect.objectContaining({ status: 200, successful: true, count: 1 })
            );
        });
    });
});