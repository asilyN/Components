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

describe("Employee API (Real Database)", () => {
    // ga delete ka data sa database
    beforeEach(async () => {
        console.log("Cleaning up the test table...");
        const { error } = await supabase.from(TEST_TABLE).delete().not("id", "is", null);
        if (error) {
            throw new Error(`Failed to clean up test table: ${error.message}`);
        }
        const { data } = await supabase.from(TEST_TABLE).select("*");
        console.log("Database state after cleanup:", data);
    });
    
    afterAll(async () => {
        console.log("Cleaning up the test table after all tests...");
        const { error } = await supabase.from(TEST_TABLE).delete().not("id", "is", null);
        if (error) {
            throw new Error(`Failed to clean up test table: ${error.message}`);
        }
        const { data } = await supabase.from(TEST_TABLE).select("*");
        console.log("Database state after final cleanup:", data);
    });

    describe("GET /api/employee", () => {
        it("should return all employee", async () => {
            const mockEmployee = [
                {
                    first_name: "Siao",
                    last_name: "Zhang",
                    group_name: "Group A",
                    role: "Developer",
                    expected_salary: 750,
                    expected_date_of_defense: "2025-12-31",
                },
            ];

            const { error: insertError } = await supabase
                .from(TEST_TABLE)
                .insert(mockEmployee);

            if (insertError) {
                throw new Error(`Failed to insert test employee: ${insertError.message}`);
            }

            const response = await request(app).get("/api/employee").expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });

        it("should handle empty result set", async () => {
            await supabase.from(TEST_TABLE).delete().neq("id", 0);

            const response = await request(app).get("/api/employee").expect(200);

            expect(response.body).toBeInstanceOf(Array);
        });


        it("should handle database errors", async () => {
            const invalidTableName = "invalid_table";

            const { from } = supabase;
            supabase.from = (table: string) => from(table === TEST_TABLE ? invalidTableName : table);

            const response = await request(app).get("/api/employee").expect(500);

            supabase.from = from;

            expect(response.body.error).toBeDefined();
        });

        
    });
});
