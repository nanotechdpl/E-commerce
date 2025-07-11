const adminsService = require("./admins.service");
const Admins = require("./admin.model");
const OTPModel = require("../../../models/OtpVerification");
const bcrypt = require("bcryptjs");
const { sendEmail } = require("../../../config/mailConfig");

// We recommend installing an extension to run jest tests.


jest.mock("./admin.model");
jest.mock("../../../models/OtpVerification");
jest.mock("bcryptjs");
jest.mock("../../../config/mailConfig");

describe("Admins Service", () => {
    describe("getAll", () => {
        it("should return all admins", async () => {
            const mockAdmins = [{ name: "Admin1" }, { name: "Admin2" }];
            Admins.find.mockResolvedValue(mockAdmins);

            const result = await adminsService.getAll();

            expect(result).toEqual(mockAdmins);
            expect(Admins.find).toHaveBeenCalled();
        });
    });

    describe("get", () => {
        it("should return a single admin by ID", async () => {
            const mockAdmin = { name: "Admin1" };
            Admins.findOne.mockResolvedValue(mockAdmin);

            const result = await adminsService.get("123");

            expect(result).toEqual(mockAdmin);
            expect(Admins.findOne).toHaveBeenCalledWith({ _id: "123" });
        });
    });

    describe("create", () => {
        it("should create a new admin", async () => {
            const mockAdminData = { name: "Admin1" };
            const mockAdmin = { save: jest.fn().mockResolvedValue(mockAdminData) };
            Admins.mockImplementation(() => mockAdmin);

            const result = await adminsService.create(mockAdminData);

            expect(result).toEqual(mockAdminData);
            expect(mockAdmin.save).toHaveBeenCalled();
        });
    });

    describe("update", () => {
        it("should update an admin by ID", async () => {
            const mockAdminData = { name: "Updated Admin" };
            Admins.findOneAndUpdate.mockResolvedValue(mockAdminData);

            const result = await adminsService.update("123", mockAdminData);

            expect(result).toEqual(mockAdminData);
            expect(Admins.findOneAndUpdate).toHaveBeenCalledWith(
                { _id: "123" },
                mockAdminData,
                { new: true }
            );
        });
    });

    describe("remove", () => {
        it("should delete an admin by ID", async () => {
            const mockAdmin = { name: "Admin1" };
            Admins.findByIdAndDelete.mockResolvedValue(mockAdmin);

            const result = await adminsService.remove("123");

            expect(result).toEqual(mockAdmin);
            expect(Admins.findByIdAndDelete).toHaveBeenCalledWith("123");
        });
    });

    describe("login", () => {
        it("should throw an error if admin is not found", async () => {
            Admins.findOne.mockResolvedValue(null);

            await expect(adminsService.login("test@example.com", "password")).rejects.toThrow(
                "Admin not found"
            );
        });

        it("should throw an error if password is incorrect", async () => {
            const mockAdmin = { password: "hashedPassword" };
            Admins.findOne.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(false);

            await expect(adminsService.login("test@example.com", "password")).rejects.toThrow(
                "Invalid credentials"
            );
        });

        it("should return the admin if login is successful", async () => {
            const mockAdmin = { _id: "123", password: "hashedPassword" };
            Admins.findOne.mockResolvedValue(mockAdmin);
            bcrypt.compare.mockResolvedValue(true);

            const result = await adminsService.login("test@example.com", "password");

            expect(result).toEqual(mockAdmin);
            expect(Admins.findOne).toHaveBeenCalledWith({ email: "test@example.com" });
            expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
        });
    });

    describe("requestPasswordReset", () => {
        it("should throw an error if admin is not found", async () => {
            Admins.findOne.mockResolvedValue(null);

            await expect(adminsService.requestPasswordReset("test@example.com")).rejects.toThrow(
                "Admin not found"
            );
        });

        it("should send an OTP email if admin exists", async () => {
            const mockAdmin = { email: "test@example.com" };
            Admins.findOne.mockResolvedValue(mockAdmin);
            OTPModel.updateOne.mockResolvedValue();
            sendEmail.mockResolvedValue();

            await adminsService.requestPasswordReset("test@example.com");

            expect(OTPModel.updateOne).toHaveBeenCalled();
            expect(sendEmail).toHaveBeenCalled();
        });
    });

    // Additional tests for verifyPasswordResetOTP, resetPassword, and changePassword can be added similarly.
});