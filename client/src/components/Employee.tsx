import React, {useState , useEffect } from "react";



export default function Employees() {
    const [employees, setEmployees] = useState<EmployeeProps[]>([]);
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch("http://localhost:3001/employees");
                const data = await response.json();
                console.log(data);

                if (!response.ok) throw new Error(data.error);
                setEmployees(data);
            } catch (error) {
                console.error("❌ Error fetching employees:", error);
            }
        };

        fetchEmployees();
    }, []);


    return (
        <div>
            <h1>Employees</h1>
            <table>
                <thead>
                    <tr>
                        <th>id</th>
                        <th>Name</th>
                        <th>Role</th>
                        <th>Salary</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee=> (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.role}</td>
                            <td>{employee.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
    }
