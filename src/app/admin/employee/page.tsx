'use client'

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import ConfirmationModal from "@/components/ui/ConfirmationModal/ConfirmationModal"
import EmployeeModal from "@/components/hris/EmployeeModal"
import EmployeeTable from "@/components/ui/table/EmployeeTable"
import { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
  type Employee,
  type CreateEmployeeRequest
} from "@/libs/employee-api"


const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
  </svg>
);

export default function EmployeePage() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToEdit, setEmployeeToEdit] = useState<Employee | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
    



    // Fetch employees from API
    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                setLoading(true);
                const data = await getEmployees();
                // Ensure all employees have unique ids
                if (Array.isArray(data)) {
                    // Filter out any employees without IDs
                    const validEmployees = data.filter(emp => emp.id && typeof emp.id === 'string');
                    
                    // Check for duplicate IDs
                    const ids = validEmployees.map(emp => emp.id);
                    const uniqueIds = [...new Set(ids)];
                    
                    if (ids.length !== uniqueIds.length) {
                        console.warn("Duplicate employee IDs found, filtering duplicates");
                        // Remove duplicates, keeping the first occurrence
                        const uniqueEmployees = validEmployees.filter((emp, index) => 
                            ids.indexOf(emp.id) === index
                        );
                        setEmployees(uniqueEmployees);
                    } else {
                        setEmployees(validEmployees);
                    }
                } else {
                    console.error("Invalid data format received from getEmployees:", data);
                    setEmployees([]);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching employees:", error);
                setEmployees([]);
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    const handleAddEmployee = () => {
        setEmployeeToEdit(null);
        setIsModalOpen(true);
    };

    const handleEditEmployee = (id: string) => {
        const emp = employees.find((e) => e.id === id);
        if (emp) {
            setEmployeeToEdit(emp);
            setIsModalOpen(true);
        }
    };

    const handleDeleteClick = (id: string) => {
        const emp = employees.find((e) => e.id === id);
        if (emp) {
            setEmployeeToDelete(emp);
            setIsDeleteModalOpen(true);
        }
    };

    const handleConfirmDelete = async () => {
        if (employeeToDelete) {
            try {
                const success = await deleteEmployee(employeeToDelete.id);
                if (success) {
                    setEmployees((prev) => {
                        // Ensure we're not creating duplicates or invalid entries
                        const filtered = prev.filter((emp) => emp.id !== employeeToDelete.id);
                        // Validate that all remaining employees have valid IDs
                        return filtered.filter(emp => emp.id && typeof emp.id === 'string');
                    });
                } else {
                    console.error("Failed to delete employee");
                }
            } catch (error) {
                console.error("Error deleting employee:", error);
            }
            
            setEmployeeToDelete(null);
        }
    };

    const handleSaveEmployee = async (employeeData: Omit<Employee, "id"> | Employee) => {
        try {
            if ('id' in employeeData) {
               
                const updateData = {
                    name: employeeData.name,
                    // email: employeeData.email,
                    position: employeeData.position || null,
                    phone: employeeData.phone || null,
                };
                
                const updatedEmployee = await updateEmployee(employeeData.id, updateData);
                if (updatedEmployee) {
                    if (updatedEmployee.id && typeof updatedEmployee.id === 'string') {
                        setEmployees((prev) =>
                            prev.map((emp) =>
                                emp.id === employeeData.id ? updatedEmployee : emp
                            )
                        );
                    } else {
                        console.error("Updated employee missing valid id:", updatedEmployee);
                    }
                } else {
                    console.error("Failed to update employee: No response from server");
                }
            } else {
               
                const newEmployeeData: CreateEmployeeRequest = {
                    ...employeeData,
                    password: "defaultPassword123", 
                    position: employeeData.position || null,
                    phone: employeeData.phone || null,
                };
                
                const newEmployee = await createEmployee(newEmployeeData);
                if (newEmployee) {
                    if (newEmployee.id && typeof newEmployee.id === 'string') {
                        setEmployees((prev) => [...prev, newEmployee]);
                    } else {
                        console.error("New employee missing valid id:", newEmployee);
                    }
                } else {
                    console.error("Failed to create employee: No response from server");
                }
            }
        } catch (error) {
            console.error("Error saving employee:", error);
        }
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setEmployeeToDelete(null);
    };

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 font-sans">
            <div className="mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                        <h1 className="text-2xl font-bold text-gray-800 flex items-center">
                            <UserIcon />
                            Manajemen Karyawan
                        </h1>
                        <Button onClick={handleAddEmployee}>
                            Tambah Karyawan
                        </Button>
                    </div>
                    
                    <EmployeeTable 
                        employees={employees} 
                        isLoading={loading}
                        onEdit={handleEditEmployee}
                        onDelete={handleDeleteClick}
                    />
                </div>
            </div>
            
            {/* Employee Modal */}
            <EmployeeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleSaveEmployee}
                employee={employeeToEdit}
            />
            
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onConfirm={handleConfirmDelete}
                title="Hapus Karyawan"
                message={employeeToDelete ? `Apakah Anda yakin ingin menghapus karyawan ${employeeToDelete.name}?` : ""}
                confirmText="Hapus"
                cancelText="Batal"
            />
        </div>
    );
}