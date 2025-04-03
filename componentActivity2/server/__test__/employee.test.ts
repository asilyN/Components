import request from "supertest";
import express from "express";
import router from "../routers/router";
import { supabase } from "../supabase";

// Mock Supabase
jest.mock("../supabase", () => ({
  supabase: {
    from: jest.fn(),
  },
}));

// Mock console.log and console.error to keep test output clean
global.console.log = jest.fn();
global.console.error = jest.fn();

const app = express();
app.use(express.json());
app.use("/api", router);

// Test table name
const TEST_TABLE = "employees";

describe("Employee API", () => {
  let mockSelect: jest.Mock;
  let mockInsert: jest.Mock;
  let mockUpdate: jest.Mock;
  let mockDelete: jest.Mock;
  let mockEq: jest.Mock;

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();

    // Setup mock implementations
    mockEq = jest.fn();
    mockSelect = jest.fn();
    mockInsert = jest.fn();
    mockUpdate = jest.fn();
    mockDelete = jest.fn();

    // Configure the from mock to return our chain of mocks
    (supabase.from as jest.Mock).mockImplementation((table) => {
      expect(table).toBe(TEST_TABLE);
      return {
        select: mockSelect,
        insert: mockInsert,
        update: mockUpdate,
        delete: mockDelete,
      };
    });

    // Configure select mock
    mockSelect.mockReturnValue({
      data: null,
      error: null,
    });

    // Configure insert mock
    mockInsert.mockReturnValue({
      select: jest.fn().mockReturnValue({
        data: null,
        error: null,
      }),
    });

    // Configure update mock
    mockUpdate.mockReturnValue({
      eq: mockEq.mockReturnValue({
        data: null,
        error: null,
      }),
    });

    // Configure delete mock
    mockDelete.mockReturnValue({
      eq: mockEq.mockReturnValue({
        data: null,
        error: null,
      }),
    });
  });

  describe("GET /api/employees", () => {
    // Happy Path
    it("should return all employees", async () => {
      // Setup mock data
      const mockEmployees = [
        {
          id: 1,
          first_name: "John",
          last_name: "Doe",
          group_name: "Engineering",
          role: "Developer",
          expected_salary: 75000,
          expected_date_of_defense: "2023-12-31T00:00:00.000Z",
        },
      ];

      mockSelect.mockReturnValue({
        data: mockEmployees,
        error: null,
      });

      const response = await request(app).get("/api/employees").expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].first_name).toBe("John");
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
      expect(mockSelect).toHaveBeenCalledWith("*");
    });

    // Sad Path 1
    it("should handle database errors", async () => {
      mockSelect.mockReturnValue({
        data: null,
        error: new Error("Database error"),
      });

      const response = await request(app).get("/api/employees").expect(500);

      expect(response.body.error).toBe("Database error");
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
    });

    // Sad Path 2
    it("should handle empty result set", async () => {
      mockSelect.mockReturnValue({
        data: [],
        error: null,
      });

      const response = await request(app).get("/api/employees").expect(200);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(0);
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
    });
  });

  describe("POST /api/employees", () => {
    // Happy Path
    it("should create a new employee", async () => {
      const employeeData = {
        first_name: "John",
        last_name: "Doe",
        group_name: "Engineering",
        role: "Developer",
        expected_salary: 75000,
        expected_date_of_defense: "2023-12-31",
      };

      const mockInsertSelect = jest.fn().mockReturnValue({
        data: [
          {
            ...employeeData,
            id: 1,
            expected_date_of_defense: "2023-12-31T00:00:00.000Z",
          },
        ],
        error: null,
      });

      mockInsert.mockReturnValue({
        select: mockInsertSelect,
      });

      const response = await request(app)
        .post("/api/employees")
        .send(employeeData)
        .expect(201);

      expect(response.body).toBeInstanceOf(Array);
      expect(response.body[0].first_name).toBe("John");
      expect(response.body[0].id).toBe(1);
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
      expect(mockInsert).toHaveBeenCalledWith([
        expect.objectContaining({
          first_name: "John",
          last_name: "Doe",
          expected_date_of_defense: expect.any(String),
        }),
      ]);
      expect(mockInsertSelect).toHaveBeenCalledWith();
    });

    // Sad Path 1
    it("should handle validation errors for missing fields", async () => {
      const invalidData = {
        first_name: "John",
        // Missing required fields
      };

      const response = await request(app)
        .post("/api/employees")
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Missing required fields");
    });

    // Sad Path 2
    it("should handle invalid date format", async () => {
      const invalidDateData = {
        first_name: "John",
        last_name: "Doe",
        group_name: "Engineering",
        role: "Developer",
        expected_salary: 75000,
        expected_date_of_defense: "invalid-date",
      };

      const response = await request(app)
        .post("/api/employees")
        .send(invalidDateData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Invalid date format");
    });

    // Sad Path 3
    it("should handle invalid salary format", async () => {
      const invalidSalaryData = {
        first_name: "John",
        last_name: "Doe",
        group_name: "Engineering",
        role: "Developer",
        expected_salary: "not-a-number",
        expected_date_of_defense: "2023-12-31",
      };

      const response = await request(app)
        .post("/api/employees")
        .send(invalidSalaryData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Expected salary must be a number");
    });
  });

  describe("PUT /api/employees/:id", () => {
    // Happy Path
    it("should update an employee", async () => {
      const employeeId = 1;
      const updatedData = {
        first_name: "Updated",
        last_name: "Name",
        group_name: "Engineering",
        role: "Senior Developer",
        expected_salary: 85000,
        expected_date_of_defense: "2024-01-15",
      };

      mockEq.mockReturnValue({
        data: { ...updatedData, id: employeeId },
        error: null,
      });

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(updatedData)
        .expect(200);

      expect(response.text).toBe("Employee updated successfully");
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({
          first_name: "Updated",
          last_name: "Name",
          expected_date_of_defense: expect.any(String),
        })
      );
      expect(mockEq).toHaveBeenCalledWith("id", employeeId.toString());
    });

    // Sad Path 1
    it("should handle validation errors for missing fields", async () => {
      const employeeId = 1;
      const invalidData = {
        first_name: "Updated",
        // Missing required fields
      };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(invalidData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Missing required fields");
      // Don't expect supabase.from to be called since validation fails early
    });

    // Sad Path 2
    it("should handle database errors during update", async () => {
      const employeeId = 999;
      const updatedData = {
        first_name: "Updated",
        last_name: "Name",
        group_name: "Engineering",
        role: "Senior Developer",
        expected_salary: 85000,
        expected_date_of_defense: "2024-01-15",
      };

      mockEq.mockReturnValue({
        data: null,
        error: new Error("Employee not found"),
      });

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(updatedData)
        .expect(500);

      expect(response.body.error).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
    });

    // Sad Path 3
    it("should handle invalid date format in update", async () => {
      const employeeId = 1;
      const invalidDateData = {
        first_name: "Updated",
        last_name: "Name",
        group_name: "Engineering",
        role: "Senior Developer",
        expected_salary: 85000,
        expected_date_of_defense: "invalid-date",
      };

      const response = await request(app)
        .put(`/api/employees/${employeeId}`)
        .send(invalidDateData)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Invalid date format");
    });
  });

  describe("DELETE /api/employees/:id", () => {
    // Happy Path
    it("should delete an employee", async () => {
      const employeeId = 1;

      mockEq.mockReturnValue({
        data: null,
        error: null,
      });

      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(200);

      expect(response.text).toBe("Employee deleted successfully");
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith("id", employeeId.toString());
    });

    // Sad Path 1
    it("should handle database errors during deletion", async () => {
      const employeeId = 999;

      mockEq.mockReturnValue({
        data: null,
        error: new Error("Employee not found"),
      });

      const response = await request(app)
        .delete(`/api/employees/${employeeId}`)
        .expect(500);

      expect(response.body.error).toBeDefined();
      expect(supabase.from).toHaveBeenCalledWith(TEST_TABLE);
    });

    // Sad Path 2
    it("should handle invalid ID format", async () => {
      const invalidId = "not-a-number";

      const response = await request(app)
        .delete(`/api/employees/${invalidId}`)
        .expect(400);

      expect(response.body.error).toBeDefined();
      expect(response.body.error).toBe("Invalid employee ID");
    });
  });
});
