const request = require("supertest");
const express = require("express");
const mongoose = require("mongoose");
const employeesController = require("./employeesController");
const EmployeeModel = require("../model/employeesModel");

jest.mock("../model/employeesModel");

const app = express();
app.use(express.json());
app.post("/employees", employeesController.registerEmployee);
app.get("/employees", employeesController.getEmployees);
app.put("/employees/:id", employeesController.updateEmployee);
app.get("/employees/:employeeId", employeesController.getEmployeeById);
app.patch("/employees/:id/status", employeesController.changeEmployeeStatus);
app.delete("/employees/:id", employeesController.deleteEmployee);
app.get("/employees/analytics", employeesController.getEmployeeAnalytics);
app.get("/employees/top", employeesController.getTopEmployees);
app.get("/employees/search", employeesController.searchEmployees);

describe("Employees Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("registerEmployee", () => {
        it("should register a new employee and return 200", async () => {
            const mockEmployee = {
                title: "Developer",
                name: "John Doe",
                photo: "photo_url",
                isBestEmployee: false,
                links: [],
            };

            EmployeeModel.prototype.save = jest.fn().mockResolvedValue(mockEmployee);
            EmployeeModel.find = jest.fn().mockResolvedValue([mockEmployee]);

            const response = await request(app)
                .post("/employees")
                .send(mockEmployee);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(EmployeeModel.prototype.save).toHaveBeenCalled();
        });

        it("should return 400 if required fields are missing", async () => {
            const response = await request(app).post("/employees").send({});

            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });

    describe("getEmployees", () => {
        it("should fetch employees and return 200", async () => {
            const mockEmployees = [
                { title: "Developer", name: "John Doe", photo: "photo_url" },
            ];

            EmployeeModel.find = jest.fn().mockResolvedValue(mockEmployees);
            EmployeeModel.countDocuments = jest.fn().mockResolvedValue(1);

            const response = await request(app).get("/employees");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toEqual(mockEmployees);
        });
    });

    describe("updateEmployee", () => {
        it("should update an employee and return 200", async () => {
            const mockEmployee = { title: "Updated Title" };

            EmployeeModel.findByIdAndUpdate = jest
                .fn()
                .mockResolvedValue(mockEmployee);

            const response = await request(app)
                .put("/employees/123")
                .send(mockEmployee);

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should return 404 if employee is not found", async () => {
            EmployeeModel.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

            const response = await request(app)
                .put("/employees/123")
                .send({ title: "Updated Title" });

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe("deleteEmployee", () => {
        it("should delete an employee and return 200", async () => {
            const mockEmployee = { _id: "123", name: "John Doe" };

            EmployeeModel.findByIdAndDelete = jest.fn().mockResolvedValue(mockEmployee);

            const response = await request(app).delete("/employees/123");

            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
        });

        it("should return 404 if employee is not found", async () => {
            EmployeeModel.findByIdAndDelete = jest.fn().mockResolvedValue(null);

            const response = await request(app).delete("/employees/123");

            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });

    describe("getEmployeeById", () => {
        it("should fetch an employee by ID and return 200", async () => {
            const mockEmployee = { _id: "123", name: "John Doe" };

            EmployeeModel.findById = jest.fn().mockResolvedValue(mockEmployee);

            const response = await request(app).get("/employees/123");

            expect(response.status).toBe(200);
            expect(response.body.successful).toBe(true);
            expect(response.body.employee).toEqual(mockEmployee);
        });

        it("should return 404 if employee is not found", async () => {
            EmployeeModel.findById = jest.fn().mockResolvedValue(null);

            const response = await request(app).get("/employees/123");

            expect(response.status).toBe(404);
            expect(response.body.successful).toBe(false);
        });
    });
});