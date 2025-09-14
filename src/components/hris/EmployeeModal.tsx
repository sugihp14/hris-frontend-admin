'use client'

import React, { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

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

interface EmployeeModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (employee: Omit<Employee, 'id'> | Employee) => void
  employee?: Employee | null
}

const initialForm: Omit<Employee, 'id'> = {
  name: '',
  email: '',
  position: null,
  phone: null,
  photoUrl: null,
  role: undefined,
  createdAt: undefined,
  updatedAt: undefined,
}

export default function EmployeeModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  employee 
}: EmployeeModalProps) {
  const [form, setForm] = React.useState(initialForm)
  const [errors, setErrors] = React.useState<Record<string, string>>({})


  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name,
        email: employee.email,
        position: employee.position,
        phone: employee.phone,
        photoUrl: employee.photoUrl || null,
        role: employee.role,
        createdAt: employee.createdAt,
        updatedAt: employee.updatedAt,
      })
    } else {
      setForm(initialForm)
    }
    setErrors({})
  }, [employee, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedValue = value === '' ? null : value
    setForm(prev => ({ ...prev, [name]: updatedValue }))
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!form.name.trim()) {
      newErrors.name = 'Nama wajib diisi'
    }
    
    if (!form.email.trim()) {
      newErrors.email = 'Email wajib diisi'
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Format email tidak valid'
    }
    
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
   
    const employeeData = {
      ...form,
      position: form.position || null, 
      phone: form.phone || null, 
    }
    
    if (employee) {
      onSubmit({ ...employee, ...employeeData })
    } else {
      onSubmit(employeeData)
    }
    
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="px-6 py-4 border-b">
          <h2 className="text-xl font-semibold">
            {employee ? 'Edit Karyawan' : 'Tambah Karyawan Baru'}
          </h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="px-6 py-4 space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nama Karyawan
              </label>
              <Input
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Masukkan nama karyawan"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Masukkan email karyawan"
                className={errors.email ? 'border-red-500' : ''}
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            
            <div>
              <label htmlFor="position" className="block text-sm font-medium text-gray-700 mb-1">
                Posisi
              </label>
              <Input
                id="position"
                name="position"
                value={form.position || ''}
                onChange={handleChange}
                placeholder="Masukkan posisi karyawan"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Nomor Telepon
              </label>
              <Input
                id="phone"
                name="phone"
                value={form.phone || ''}
                onChange={handleChange}
                placeholder="Masukkan nomor telepon karyawan"
              />
            </div>
          </div>
          
          <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Batal
            </Button>
            <Button type="submit">
              {employee ? 'Update' : 'Tambah'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}