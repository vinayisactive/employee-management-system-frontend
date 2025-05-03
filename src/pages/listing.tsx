import { useEffect, useState } from "react";
import axios from "axios";
import { Edit2, Trash2, Search, ArrowUpDown, User, Plus } from "lucide-react";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";

type Employee = {
  id: string;
  name: string;
  email: string;
  mobile: string;
  designation: string;
  gender: string;
  course: string;
  createdAt: string;
  image?: string;
};

const ListingPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [sortAsc, setSortAsc] = useState(true);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  const navigate = useNavigate();

  const fetchEmployees = async () => {
    try {
      const { data } = await axios.get(
        "https://employee-management-backend-15e3.onrender.com/api/v1/employees",
        {
          withCredentials: true,
        }
      );
      setEmployees(data.data);
      setFiltered(data.data);
    } catch (error) {
      console.error("Failed to fetch employees:", error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const filteredEmployees = employees
      .filter((emp) => emp.name.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) =>
        sortAsc ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      );
    setFiltered(filteredEmployees);
  }, [search, sortAsc, employees]);

  const handleDelete = async () => {
    if (!selectedEmployee) return;
    try {
      await axios.delete(
        `http://localhost:8080/api/v1/employees/${selectedEmployee}`,
        {
          withCredentials: true,
        }
      );
      await fetchEmployees();
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleteOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">



        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold tracking-tight">
            Employee Directory
          </h1>

          <div className="w-full md:w-auto flex flex-col-reverse md:flex-row gap-3">
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
            </div>

            <button
              onClick={() => setSortAsc(!sortAsc)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ArrowUpDown className="w-5 h-5" />
              <span className="">Sort {sortAsc ? "A-Z" : "Z-A"}</span>
            </button>
          </div>
        </div>

        <div className="flex cursor-pointer justify-self-end items-center gap-2 px-4 py-2  mb-5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          <button
            className=" cursor-pointer"
            onClick={() => navigate("/create")}
          >
            Create Employee
          </button>
        </div>

        <div className="rounded-lg border border-gray-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-800">
                <tr>
                  {[
                    "",
                    "Name",
                    "Email",
                    "Mobile",
                    "Role",
                    "Gender",
                    "Course",
                    "Joined",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-4 py-3 text-left text-sm font-semibold text-gray-300 whitespace-nowrap"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filtered.map((emp) => (
                  <tr
                    key={emp.id}
                    className="hover:bg-gray-800/50 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                        {emp.image ? (
                          <img
                            src={emp.image}
                            alt={emp.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-full h-full p-2 text-gray-400" />
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium">{emp.name}</td>
                    <td className="px-4 py-3 text-gray-400">{emp.email}</td>
                    <td className="px-4 py-3">{emp.mobile}</td>
                    <td className="px-4 py-3">{emp.designation}</td>
                    <td className="px-4 py-3 capitalize">
                      {emp.gender.toLowerCase()}
                    </td>
                    <td className="px-4 py-3">{emp.course}</td>
                    <td className="px-4 py-3">
                      {new Date(emp.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          className="p-2 hover:bg-gray-700 rounded-md transition-colors text-blue-400"
                          onClick={() => navigate(`/edit/${emp.id}`)}
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button
                          className="p-2 hover:bg-gray-700 rounded-md transition-colors text-red-400"
                          onClick={() => {
                            setSelectedEmployee(emp.id);
                            setIsDeleteOpen(true);
                          }}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filtered.length === 0 && (
              <div className="py-12 text-center">
                <div className="max-w-xs mx-auto mb-4">
                  <User className="w-16 h-16 mx-auto text-gray-600" />
                  <h3 className="mt-4 text-lg font-medium text-gray-200">
                    No employees found
                  </h3>
                  <p className="mt-1 text-sm text-gray-400">
                    Try adjusting your search or filters
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      >
        <Dialog.Panel className="w-full max-w-md rounded-lg bg-gray-800 p-6 border border-gray-700">
          <Dialog.Title className="text-lg font-semibold">
            Delete Employee
          </Dialog.Title>
          <Dialog.Description className="mt-2 text-gray-400">
            Are you sure you want to delete this employee? This action cannot be
            undone.
          </Dialog.Description>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="px-4 py-2 rounded-md bg-red-600 hover:bg-red-500 transition-colors"
            >
              Confirm Delete
            </button>
          </div>
        </Dialog.Panel>
      </Dialog>
    </div>
  );
};

export default ListingPage;
