import request from "supertest";
import express from "express";
import router from "../routers/router";
import { supabase } from "../supabase";
import dotenv from "dotenv";


dotenv.config({ path: ".env.test" });

const app = express();
app.use(express.json());
app.use("/api", router);

const TEST_TABLE = "employee";

describe("PUT /api/employee/:id", () => {
    let employeeId: number;

    beforeEach(async () => {
        await supabase.from(TEST_TABLE).delete().neq("id", 0);
        const { data, error } = await supabase
            .from(TEST_TABLE)
            .insert([
                {
                    first_name: "Original",
                    last_name: "Employee",
                    group_name: "Engineering",
                    role: "Developer",
                    expected_salary: 75000,
                    expected_date_of_defense: "2023-12-31",
                },
            ])
            .select();
        if (error) throw new Error("Failed to insert test employee");
        employeeId = data![0].id;
    });

    afterEach(async () => {
        await supabase.from(TEST_TABLE).delete().neq("id", 0);
    });

    it("should update an employee", async () => {
        const updatedData = {
            first_name: "Updated",
            last_name: "Name",
            group_name: "Engineering",
            role: "Senior Developer",
            expected_salary: 85000,
            expected_date_of_defense: "2024-01-15",
        };

        const response = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(updatedData)
            .expect(200);

        expect(response.text).toBe("Employee updated successfully");

        const { data, error } = await supabase
            .from(TEST_TABLE)
            .select("*")
            .eq("id", employeeId);

        expect(error).toBeNull();
        expect(data).toBeInstanceOf(Array);
        expect(data![0].first_name).toBe("Updated");
        expect(data![0].last_name).toBe("Name");
        expect(data![0].expected_salary).toBe(85000);
    });

    it("should handle validation errors for missing fields", async () => {
        const invalidData = {
            first_name: "Updated",
        };

        const response = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(invalidData)
            .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe("Missing required fields");
    });

    it("should handle invalid date format in update", async () => {
        const invalidDateData = {
            first_name: "Updated",
            last_name: "Name",
            group_name: "Engineering",
            role: "Senior Developer",
            expected_salary: 85000,
            expected_date_of_defense: "invalid-date",
        };

        const response = await request(app)
            .put(`/api/employee/${employeeId}`)
            .send(invalidDateData)
            .expect(400);

        expect(response.body.error).toBeDefined();
        expect(response.body.error).toBe("Invalid date format");
    });
});


