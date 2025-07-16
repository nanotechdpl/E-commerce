const mongoose = require('mongoose');
const RealEstateBannerModel = require('./realEstateBannerModel');

describe('RealEstateBannerModel Schema', () => {
    it('should have the correct schema fields and types', () => {
        const schemaPaths = RealEstateBannerModel.schema.paths;

        expect(schemaPaths).toHaveProperty('image');
        expect(schemaPaths.image.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('header');
        expect(schemaPaths.header.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('subHeaderOne');
        expect(schemaPaths.subHeaderOne.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('subHeaderTwo');
        expect(schemaPaths.subHeaderTwo.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('subHeaderThree');
        expect(schemaPaths.subHeaderThree.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('subHeaderFour');
        expect(schemaPaths.subHeaderFour.instance).toBe('String');

        expect(schemaPaths).toHaveProperty('description');
        expect(schemaPaths.description.instance).toBe('String');
    });

    it('should create a document with the correct values', () => {
        const banner = new RealEstateBannerModel({
            image: 'test.jpg',
            header: 'Main Header',
            subHeaderOne: 'Sub 1',
            subHeaderTwo: 'Sub 2',
            subHeaderThree: 'Sub 3',
            subHeaderFour: 'Sub 4',
            description: 'A description'
        });

        expect(banner.image).toBe('test.jpg');
        expect(banner.header).toBe('Main Header');
        expect(banner.subHeaderOne).toBe('Sub 1');
        expect(banner.subHeaderTwo).toBe('Sub 2');
        expect(banner.subHeaderThree).toBe('Sub 3');
        expect(banner.subHeaderFour).toBe('Sub 4');
        expect(banner.description).toBe('A description');
    });
});