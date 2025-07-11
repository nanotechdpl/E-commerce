const mongoose = require('mongoose');
const RealEstate = require('./realEstateModel');

describe('RealEstate Model', () => {
    beforeAll(async () => {
        // Use MongoDB memory server or mock if needed
        await mongoose.connect('mongodb://localhost:27017/testdb', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should create a RealEstate document with default values', async () => {
        const estate = new RealEstate({});
        expect(estate.surfaceArea).toBe(0);
        expect(estate.bed).toBe(0);
        expect(estate.bath).toBe(0);
        expect(estate.kitchen).toBe(0);
        expect(estate.price).toBe(0);
    });

    it('should save and retrieve a RealEstate document', async () => {
        const data = {
            client: 'John Doe',
            location: 'Downtown',
            surfaceArea: 120,
            house: 'Villa',
            bed: 3,
            bath: 2,
            kitchen: 1,
            architect: 'Jane Smith',
            address: '123 Main St',
            price: 500000,
        };
        const estate = new RealEstate(data);
        const saved = await estate.save();

        expect(saved.client).toBe(data.client);
        expect(saved.location).toBe(data.location);
        expect(saved.surfaceArea).toBe(data.surfaceArea);
        expect(saved.house).toBe(data.house);
        expect(saved.bed).toBe(data.bed);
        expect(saved.bath).toBe(data.bath);
        expect(saved.kitchen).toBe(data.kitchen);
        expect(saved.architect).toBe(data.architect);
        expect(saved.address).toBe(data.address);
        expect(saved.price).toBe(data.price);

        const found = await RealEstate.findById(saved._id);
        expect(found).not.toBeNull();
        expect(found.client).toBe(data.client);
    });

    it('should allow missing optional fields', async () => {
        const estate = new RealEstate({ location: 'Suburb' });
        const saved = await estate.save();
        expect(saved.location).toBe('Suburb');
        expect(saved.client).toBeUndefined();
    });
});