# Sistem Notifikasi

Sistem notifikasi di DEXA HRIS System memungkinkan pengguna untuk menerima dan mengelola notifikasi dalam aplikasi.

## Komponen

### 1. Badge Notifikasi
Badge notifikasi ditampilkan di AppNavbar sebagai indikator jumlah notifikasi yang belum dibaca.

### 2. Panel Notifikasi
Panel notifikasi menampilkan daftar notifikasi ketika ikon bel diklik.

### 3. Store Notifikasi
Store notifikasi menggunakan Zustand untuk mengelola state jumlah notifikasi di seluruh aplikasi.

## Cara Penggunaan

### Mengelola Jumlah Notifikasi
```typescript
import { useNotificationStore } from '@/libs/stores/notification'

export default function MyComponent() {
  const { 
    notificationCount, 
    incrementNotificationCount, 
    decrementNotificationCount,
    setNotificationCount,
    resetNotificationCount
  } = useNotificationStore()
  
  // Gunakan fungsi-fungsi ini untuk mengelola notifikasi
  // incrementNotificationCount() - Menambah jumlah notifikasi
  // decrementNotificationCount() - Mengurangi jumlah notifikasi
  // setNotificationCount(number) - Mengatur jumlah notifikasi
  // resetNotificationCount() - Mereset jumlah notifikasi menjadi 0
}
```

### Menampilkan Notifikasi
Notifikasi secara otomatis akan muncul di navbar. Untuk menampilkan panel notifikasi, klik ikon bel di kanan navbar.

## Kustomisasi
- Ubah tampilan badge di `src/components/ui/badge.tsx`
- Modifikasi panel notifikasi di `src/components/hris/NotificationPanel.tsx`
- Sesuaikan store di `src/libs/stores/notification.ts`

## Demo
Lihat demo sistem notifikasi di [Notification Demo Page](/notification-demo)
Lihat dokumentasi lengkap di [Notification Documentation](/docs/notification)