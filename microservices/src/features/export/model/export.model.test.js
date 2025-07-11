const mongoose = require('mongoose');
const Export = require('./export.model');

describe('Export Model', () => {
    beforeAll(async () => {
        await mongoose.connect('mongodb://localhost:27017/export_test', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    afterEach(async () => {
        await Export.deleteMany({});
    });

    it('should create and save an export successfully', async () => {
        const validExport = new Export({
            title: 'Test Export',
            tag: 'test',
            description: 'A test export description',
            photo: 'photo_url.jpg',
            category: 'test-category',
        });

        const savedExport = await validExport.save();

        expect(savedExport._id).toBeDefined();
        expect(savedExport.title).toBe('Test Export');
        expect(savedExport.tag).toBe('test');
        expect(savedExport.description).toBe('A test export description');
        expect(savedExport.photo).toBe('photo_url.jpg');
        expect(savedExport.category).toBe('test-category');
        expect(savedExport.status).toBe('active');
        expect(savedExport.createdAt).toBeDefined();
        expect(savedExport.updatedAt).toBeDefined();
    });

    it('should require title, description, photo, and category fields', async () => {
        const exportWithoutRequiredFields = new Export({});
        let err;
        try {
            await exportWithoutRequiredFields.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.title).toBeDefined();
        expect(err.errors.description).toBeDefined();
        expect(err.errors.photo).toBeDefined();
        expect(err.errors.category).toBeDefined();
    });

    it('should set status to "active" by default', async () => {
        const exportDoc = new Export({
            title: 'Test Export',
            tag: 'test',
            description: 'A test export description',
            photo: 'photo_url.jpg',
            category: 'test-category',
        });
        const savedExport = await exportDoc.save();
        expect(savedExport.status).toBe('active');
    });

    it('should only allow status to be "active" or "inactive"', async () => {
        const exportDoc = new Export({
            title: 'Test Export',
            tag: 'test',
            description: 'A test export description',
            photo: 'photo_url.jpg',
            category: 'test-category',
            status: 'invalid-status',
        });
        let err;
        try {
            await exportDoc.save();
        } catch (error) {
            err = error;
        }
        expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
        expect(err.errors.status).toBeDefined();
    });
});