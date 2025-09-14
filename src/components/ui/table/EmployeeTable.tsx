'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface Employee {
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

interface EmployeeTableProps {
  employees: Employee[]
  isLoading?: boolean
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}

const EmployeeTable: React.FC<EmployeeTableProps> = ({ 
  employees, 
  isLoading = false,
  onEdit,
  onDelete
}) => {
  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Nama</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Email</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Posisi</th>
              <th className="text-left font-medium text-gray-500 px-4 py-3">Telepon</th>
              <th className="text-center font-medium text-gray-500 px-4 py-3">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {[...Array(5)].map((_, index) => (
              <tr key={index} className="animate-pulse">
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="h-8 bg-gray-200 rounded w-16 mx-auto"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (employees.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="font-semibold text-gray-500">Tidak ada data karyawan</p>
        <p className="text-sm text-gray-400 mt-1">Silakan tambahkan karyawan baru.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Nama</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Email</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Posisi</th>
            <th className="text-left font-medium text-gray-500 px-4 py-3">Telepon</th>
            <th className="text-center font-medium text-gray-500 px-4 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee) => (
            <tr key={employee.id} className="hover:bg-gray-50">
              <td className="px-4 py-3 text-gray-700 font-medium">{employee.name}</td>
              <td className="px-4 py-3 text-gray-700">{employee.email}</td>
              <td className="px-4 py-3 text-gray-700">{employee.position || '-'}</td>
              <td className="px-4 py-3 text-gray-700">{employee.phone || '-'}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex justify-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onEdit(employee.id)}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => onDelete(employee.id)}
                  >
                    Hapus
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default EmployeeTable