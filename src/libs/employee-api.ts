'use client'

import { apiFetch } from '@/libs/http'

export type Employee = {
  id: string
  name: string
  email: string
  position: string | null
  phone?: string | null
  photoUrl?: string | null
  role?: string
  createdAt?: string
  updatedAt?: string
}

export type CreateEmployeeRequest = {
  name: string
  email: string
  password: string
  position: string | null
  phone?: string | null
}

export type UpdateEmployeeRequest = {
  name?: string
  email?: string
  position?: string | null
  phone?: string | null
}

// Get all employees
export async function getEmployees(): Promise<Employee[]> {
  try {
    const response: any = await apiFetch('/admin/employees')
    console.log('Get employees response:', response)
    return Array.isArray(response) ? response : response.data || []
  } catch (error) {
    console.error('Error fetching employees:', error)
    return []
  }
}

// Get employee by ID
export async function getEmployeeById(id: number): Promise<Employee | null> {
  try {
    const response: any = await apiFetch(`/admin/employees/${id}`)
    console.log(`Get employee with id ${id} response:`, response)
    return response || null
  } catch (error) {
    console.error(`Error fetching employee with id ${id}:`, error)
    return null
  }
}

// Create new employee
export async function createEmployee(employee: CreateEmployeeRequest): Promise<Employee | null> {
  try {
    const response: any = await apiFetch('/admin/employees', {
      method: 'POST',
      body: JSON.stringify(employee)
    })
    console.log('Create employee response:', response)
    return response.data || null
  } catch (error) {
    console.error('Error creating employee:', error)
    return null
  }
}

// Update employee
export async function updateEmployee(id: string, employee: UpdateEmployeeRequest): Promise<Employee | null> {
  try {
    const response: any = await apiFetch(`/admin/employees/${id}`, {
      method: 'PUT',
      body: JSON.stringify(employee)
    })
    console.log('Update employee response:', response)
    return response.data || null
  } catch (error) {
    console.error(`Error updating employee with id ${id}:`, error)
    return null
  }
}

// Delete employee
export async function deleteEmployee(id: string): Promise<boolean> {
  try {
    await apiFetch(`/admin/employees/${id}`, {
      method: 'DELETE'
    })
    console.log(`Employee with id ${id} deleted successfully`)
    return true
  } catch (error) {
    console.error(`Error deleting employee with id ${id}:`, error)
    return false
  }
}