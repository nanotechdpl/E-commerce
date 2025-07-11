const mongoose = require("mongoose");
const Construction = require("./construction.model");

describe("Construction Model", () => {
    beforeAll(async () => {
        await mongoose.connect("mongodb://localhost:27017/testdb", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it("should create a construction document with required fields", async () => {
        const data = {
            title: "Test Construction",
            description: "Test Description",
            photo: "photo.jpg",
            category: "Building",
        };
        const construction = await Construction.create(data);
        expect(construction.title).toBe(data.title);
        expect(construction.description).toBe(data.description);
        expect(construction.photo).toBe(data.photo);
        expect(construction.category).toBe(data.category);
        expect(construction.status).toBe("active");
        expect(construction.createdAt).toBeDefined();
        expect(construction.updatedAt).toBeDefined();
    });

    it("should not create a construction document without required fields", async () => {
        const data = {
            title: "Test Construction",
            photo: "photo.jpg",
            category: "Building",
        };
        let error;
        try {
            await Construction.create(data);
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe("ValidationError");
        expect(error.errors.description).toBeDefined();
    });

    it("should set status to 'active' by default", async () => {
        const data = {
            title: "Test Construction 2",
            description: "Another Description",
            photo: "photo2.jpg",
            category: "Road",
        };
        const construction = await Construction.create(data);
        expect(construction.status).toBe("active");
    });

    it("should not allow status other than 'active' or 'inactive'", async () => {
        const data = {
            title: "Test Construction 3",
            description: "Desc",
            photo: "photo3.jpg",
            category: "Bridge",
            status: "pending",
        };
        let error;
        try {
            await Construction.create(data);
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe("ValidationError");
        expect(error.errors.status).toBeDefined();
    });

    it("should allow optional tag field", async () => {
        const data = {
            title: "Test Construction 4",
            description: "Desc",
            photo: "photo4.jpg",
            category: "Tunnel",
            tag: "urgent",
        };
        const construction = await Construction.create(data);
        expect(construction.tag).toBe("urgent");
    });
});