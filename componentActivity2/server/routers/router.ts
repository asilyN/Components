import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { supabase } from "../supabase";

const router = express.Router();
const TABLE_NAME = "employee";

const validateEmployeeData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Validating employee data:", req.body);

  const {
    first_name,
    last_name,
    group_name,
    role,
    expected_salary,
    expected_date_of_defense,
  } = req.body;

  if (
    !first_name ||
    !last_name ||
    !group_name ||
    !role ||
    !expected_salary ||
    !expected_date_of_defense
  ) {
    console.log("Missing required fields");
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  if (expected_salary && isNaN(Number(expected_salary))) {
    console.log("Invalid salary format");
    res.status(400).json({ error: "Expected salary must be a number" });
    return;
  }

  if (expected_date_of_defense) {
    console.log("Validating date:", expected_date_of_defense);

    try {
      const date = new Date(expected_date_of_defense);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
    } catch {
      console.log("Invalid date format detected");
      res.status(400).json({ error: "Invalid date format" });
      return;
    }
  }

  console.log("Validation passed");
  next();
};

// Validate ID middleware
// const validateEmployeeId = (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ) => {
//   const { id } = req.params;

//   const uuidRegex = /^[0-9a-fA-F-]{36}$/;
//     if (!uuidRegex.test(id)) {
//         res.status(400).json({ error: "Invalid employee ID" });
//         return;
//     }

//   next();
// };

router.get("/employee", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from(TABLE_NAME).select("*");

    if (error) throw error;

    const formattedData = data.map((item) => ({
      ...item,
      expected_date_of_defense: new Date(item.expected_date_of_defense),
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

router.post(
  "/employee",
  validateEmployeeData,
  async (req: Request, res: Response) => {
    const {
      first_name,
      last_name,
      group_name,
      role,
      expected_salary,
      expected_date_of_defense,
    } = req.body;

    try {
      const formattedDate = new Date(expected_date_of_defense).toISOString();

      const { data, error } = await supabase
        .from(TABLE_NAME)
        .insert([
          {
            first_name,
            last_name,
            group_name,
            role,
            expected_salary,
            expected_date_of_defense: formattedDate,
          },
        ])
        .select();

      if (error) throw error;

      res.status(201).json(data);
    } catch (error) {
      console.error("Error in POST /employee:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
);


router.put(
  "/employee/:id",
  async (req, res) => {
    const { id } = req.params;
    const {
      first_name,
      last_name,
      group_name,
      role,
      expected_salary,
      expected_date_of_defense,
    } = req.body;


    if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      res.status(400).json({ error: "Invalid employee ID" })
      return ;
    }
  
    if (!first_name || !last_name || !group_name || !role || !expected_salary || !expected_date_of_defense) {
      res.status(400).json({ error: "Missing required fields" })
      return ;
    }
  
    if (isNaN(expected_salary)) {
      res.status(400).json({ error: "Expected salary must be a number" });
      return;
    }

    if (isNaN(Date.parse(expected_date_of_defense))) {
      res.status(400).json({ error: "Invalid date format" });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("employee")
        .update({
          first_name,
          last_name,
          group_name,
          role,
          expected_salary,
          expected_date_of_defense,
        })
        .eq("id", id)
        .select();

      if (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ error: "Failed to update employee" });
        return;
      }

      if (!data || data.length === 0) {
        res.status(404).json({ error: "Employee not found" });
        return;
      }

      res.status(200).send("Employee updated successfully");
    } catch (error) {
      console.error("Error in PUT /employee/:id:", error);
      res.status(500).json({ error: (error as Error).message });
    }
  }
);


router.delete("/employee/:id", async (req, res) => {
  const { id } = req.params;

  if (!id || !/^[0-9a-fA-F-]{36}$/.test(id)) {
      res.status(400).json({ error: "Invalid employee ID" })
      return ;
  }

  try {
      const { data: existingEmployee, error: fetchError } = await supabase
          .from("employee")
          .select("*")
          .eq("id", id);

      if (fetchError) {
          console.error("Error fetching employee:", fetchError);
          res.status(500).json({ error: "Failed to fetch employee" })
          return ;
      }

      if (!existingEmployee || existingEmployee.length === 0) {
          res.status(404).json({ error: "Employee not found" })
          return ;
      }

      const { error: deleteError } = await supabase
          .from("employee")
          .delete()
          .eq("id", id);

      if (deleteError) {
          console.error("Error deleting employee:", deleteError);
          res.status(500).json({ error: "Failed to delete employee" })
          return ;
      }

      res.status(200).send("Employee deleted successfully");
  } catch (error) {
      console.error("Error in DELETE /employee/:id:", error);
      res.status(500).json({ error: (error as Error).message });
  }
});


export default router;
