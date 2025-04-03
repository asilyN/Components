import React, { useState, useEffect } from "react";
import axios from "axios";

interface Employee {
  id?: string;
  first_name: string;
  last_name: string;
  group_name: string;
  role: string;
  expected_salary: number;
  expected_date_of_defense: Date;
}

const CrudComponent = () => {
  const [data, setData] = useState<Employee[]>([]);
  const [formData, setFormData] = useState<Employee>({
    first_name: "",
    last_name: "",
    group_name: "",
    role: "",
    expected_salary: 0,
    expected_date_of_defense: new Date(),
  });

  const [isEdit, setIsEdit] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.get<Employee[]>(
        "http://localhost:3000/api/employee"
      );

      const employeesWithDates: Employee[] = result.data.map((item: Employee) => ({
        ...item,
        expected_date_of_defense: new Date(item.expected_date_of_defense),
      }));

      setData(employeesWithDates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === "expected_salary"
          ? Number(value)
          : name === "expected_date_of_defense"
          ? new Date(value)
          : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        expected_date_of_defense:
          formData.expected_date_of_defense.toISOString(),
      };

      console.log("Payload being sent:", payload);

      if (isEdit !== null) {
        await axios.put(
          `http://localhost:3000/api/employee/${isEdit}`,
          payload
        );
      } else {
        await axios.post("http://localhost:3000/api/employee", payload);
      }

      setFormData({
        first_name: "",
        last_name: "",
        group_name: "",
        role: "",
        expected_salary: 0,
        expected_date_of_defense: new Date(),
      });

      setIsEdit(null);
      fetchData();
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleEdit = (index: number) => {
    const employee = data[index];
    setFormData(employee);
    setIsEdit(employee.id || null);
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/api/employee/${id}`);
      fetchData();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-center text-2xl font-bold">CRUD Operations</h1>
      <div className="bg-white p-6 rounded-lg shadow-md mt-4">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            placeholder="First Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            placeholder="Last Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="group_name"
            value={formData.group_name}
            onChange={handleInputChange}
            placeholder="Group Name"
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleInputChange}
            placeholder="Role"
            className="border p-2 rounded"
          />
          <input
            type="number"
            name="expected_salary"
            value={formData.expected_salary}
            onChange={handleInputChange}
            placeholder="Expected Salary"
            className="border p-2 rounded"
          />
          <input
            type="date"
            name="expected_date_of_defense"
            value={formData.expected_date_of_defense.toISOString().split("T")[0]}
            onChange={handleInputChange}
            className="border p-2 rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Submit
          </button>
        </form>
        <table className="w-full bg-white rounded-md shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-2">First Name</th>
              <th className="p-2">Last Name</th>
              <th className="p-2">Group Name</th>
              <th className="p-2">Role</th>
              <th className="p-2">Expected Salary</th>
              <th className="p-2">Expected Date of Defense</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{item.first_name}</td>
                <td className="p-2">{item.last_name}</td>
                <td className="p-2">{item.group_name}</td>
                <td className="p-2">{item.role}</td>
                <td className="p-2">{item.expected_salary.toLocaleString()}</td>
                <td className="p-2">{item.expected_date_of_defense.toDateString()}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(index)} className="bg-green-500 text-white px-3 py-1 rounded">
                    Edit
                  </button>
                  <button onClick={() => item.id && handleDelete(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CrudComponent;
