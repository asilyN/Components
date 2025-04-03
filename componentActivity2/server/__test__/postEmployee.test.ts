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

describe("Employee API", () => {
    beforeEach(async () => {
        await supabase.from(TEST_TABLE).delete().neq("id", 0);
    });

    describe("POST /api/employee", () => {
        it("should create a new employee", async () => {
            const employeeData = {
                first_name: "Elmor",
                last_name: "Rodrigo",
                group_name: "Group A",
                role: "Developer Muse",
                expected_salary: 75000,
                expected_date_of_defense: "2023-12-31",
            };

            const response = await request(app)
                .post("/api/employee")
                .send(employeeData)
                .expect(201);

            expect(response.body).toBeInstanceOf(Array);
            expect(response.body[0].first_name).toBe("Elmor");
            expect(response.body[0].id).toBeDefined();

            const { data, error } = await supabase
                .from(TEST_TABLE)
                .select("*")
                .eq("id", response.body[0].id);

            expect(error).toBeNull();
            expect(data).toBeInstanceOf(Array);
            expect(data).not.toBeNull();
            expect(data![0].first_name).toBe("Elmor");
        });

        it("should handle validation errors for missing fields", async () => {
            const invalidData = {
                first_name: "Elmor",
            };

            const response = await request(app)
                .post("/api/employee")
                .send(invalidData)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe("Missing required fields");
        });

        it("should handle invalid date format", async () => {
            const invalidDateData = {
                first_name: "Elmor",
                last_name: "Rodrigo",
                group_name: "Group A",
                role: "Developer Muse",
                expected_salary: 75000,
                expected_date_of_defense: "invalid-date",
            };

            const response = await request(app)
                .post("/api/employee")
                .send(invalidDateData)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe("Invalid date format");
        });

        it("should handle invalid salary format", async () => {
            const invalidSalaryData = {
                first_name: "Elmor",
                last_name: "Rodrigo",
                group_name: "Group A",
                role: "Developer Muse",
                expected_salary: "Mamamo",
                expected_date_of_defense: "2023-12-31",
            };

            const response = await request(app)
                .post("/api/employee")
                .send(invalidSalaryData)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe("Expected salary must be a number");
        });
    });

    afterEach(async () => {
        await supabase.from(TEST_TABLE).delete().neq("id", 0);
    });
});