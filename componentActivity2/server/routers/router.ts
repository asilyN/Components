import express, { Request, Response } from 'express';
import { supabase } from '../supabase';

const router = express.Router();


router.get('/employees', async (req: Request, res: Response) => {
    try {
        const { data, error } = await supabase.from('employees').select('*');
        if (error) throw error;

        const formattedData = data.map((item: { expected_date_of_defense: string; id: number; first_name: string; last_name: string; group_name: string; role: string; expected_salary: number }) => ({
            ...item,
            expected_date_of_defense: new Date(item.expected_date_of_defense),
        }));

        res.status(200).json(formattedData);
    } catch (error) {
        res.status(500).json({ error:(error as Error).message  });
    }
});


router.post("/employees", async (req: Request, res: Response) => {
    console.log("Received Data:", req.body); // Log the incoming request body

    const { first_name, last_name, group_name, role, expected_salary, expected_date_of_defense } = req.body;

    try {
        const formattedDate = new Date(expected_date_of_defense).toISOString();

        const { data, error } = await supabase.from("employees").insert([
            {
                first_name,
                last_name,
                group_name,
                role,
                expected_salary,
                expected_date_of_defense: formattedDate,
            },
        ]).select();

        if (error) throw error;

        res.status(201).json(data);
    } catch (error) {
        console.error("Error inserting data into Supabase:", error); // Log the error
        res.status(500).json({ error: (error as Error).message });
    }
});

router.put("/employees/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { first_name, last_name, group_name, role, expected_salary, expected_date_of_defense } = req.body;

    try {
        const formattedDate = new Date(expected_date_of_defense).toISOString();

        const { error } = await supabase
            .from("employees")
            .update({
                first_name,
                last_name,
                group_name,
                role,
                expected_salary,
                expected_date_of_defense: formattedDate,
            })
            .eq("id", id);

        if (error) throw error;

        res.status(200).send("Employee updated successfully");
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});


router.delete("/employees/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const { error } = await supabase.from("employees").delete().eq("id", id);
        if (error) throw error;
        res.status(200).send("Employee deleted successfully");
    } catch (error) {
        res.status(500).json({ error: (error as Error).message });
    }
});

export default router;