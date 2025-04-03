import request from "supertest";
import express from "express";
import router from "../routers/router";
import { supabase } from "../supabase";
import {v4 as uuid4} from "uuid";
import dotenv from "dotenv";


dotenv.config({ path: ".env.test" });

const app = express();
app.use(express.json());
app.use("/api", router);

const TEST_TABLE = "employee";

describe("Employee API", () => {
    beforeEach(async () => {
        const { error } = await supabase.from(TEST_TABLE).delete().not("id", "is", null);
        if (error) {
            throw new Error(`Failed to clean up test table: ${error.message}`);
        }
    });
    describe("DELETE /api/employee/:id", () => {

        it("should delete an employee", async () => {
            const employeeId =uuid4()
            const { data:insertedData, error: insertError } = await supabase
                .from(TEST_TABLE)
                .insert([
                    {
                        id: employeeId,
                        first_name: "Test",
                        last_name: "Employee",
                        group_name: "Unang Grupo",
                        role: "leader",
                        expected_salary: 75000,
                        expected_date_of_defense: "2023-12-31",
                    },
                ]).select();

                if (insertError) {
                    console.error("Insert Error:", insertError);
                    throw new Error(`Failed to insert test employee: ${insertError.message}`);
                }

                console.log("Inserted data:", insertedData);

                const { data: allEmployeesAfter } = await supabase.from(TEST_TABLE).select("*");
                console.log("Employees in the database after insertion:", allEmployeesAfter);

                expect(insertedData).toHaveLength(1);

                const response = await request(app)
                    .delete(`/api/employee/${employeeId}`)
                    .expect(200);

                expect(response.text).toBe("Employee deleted successfully");

                const { data } = await supabase
                    .from(TEST_TABLE)
                    .select("*")
                    .eq("id", employeeId);

                expect(data).toHaveLength(0);
            });

        it("should handle database errors during deletion", async () => {
            const nonExistentId = "00000000-0000-0000-0000-000000000000";

            const response = await request(app)
                .delete(`/api/employee/${nonExistentId}`)
                .expect(404);

            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe("Employee not found");
        });

        it("should handle invalid ID format", async () => {
            const invalidId = "not-a-uuid";

            const response = await request(app)
                .delete(`/api/employee/${invalidId}`)
                .expect(400);

            expect(response.body.error).toBeDefined();
            expect(response.body.error).toBe("Invalid employee ID");
        });
    });
});