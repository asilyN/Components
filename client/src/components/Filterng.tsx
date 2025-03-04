import React from "react";
import { EmployeeProps } from "./Props";

interface EmployeeProps {
    employees: EmployeeProps[];
}

const Filtering:  React.FC<EmployeeProps> = ({ employees }) => {
    const entry = employees.filter((employee) => employee.salary < 50000);
    const senior = employees.filter((employee) => employee.salary > 50000);

    return (
        <div>
            <h1>Employees</h1>
            <h2>Entry Level</h2>
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
                    {entry.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</td>
                            <td>{employee.role}</td>
                            <td>{employee.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <h2>Senior Level</h2>
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
                    {senior.map((employee) => (
                        <tr key={employee.id}>
                            <td>{employee.id}</td>
                            <td>{employee.name}</json></td>
                            <td>{employee.role}</td>
                            <td>{employee.salary}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );