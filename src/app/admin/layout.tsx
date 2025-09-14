// src/app/admin/layout.tsx

'use client'

import { useEffect } from 'react';
import AppNavbar from '@/components/hris/AppNavBar';
import { Sidebar } from '@/components/hris/Sidebar';
import { Protected } from '@/components/Protected';
import { useNotificationStore } from '@/libs/stores/notification';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const initializeFirebase = useNotificationStore(s => s.initializeFirebase);

  useEffect(() => {
    // Inisialisasi notifikasi sekali saat user berhasil login
    // dan komponen ini dimuat.
    initializeFirebase();
  }, [initializeFirebase]);

  return (
    <Protected>
      <div className="w-full min-h-screen bg-neutral-50">
        <AppNavbar />
        <div className="mx-auto grid grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)] lg:grid-cols-[288px_minmax(0,1fr)]">
          <Sidebar />
          <main className='w-autogrid-cols-[repeat(auto-fit,minmax(320px,1fr))]'>{children}</main>
        </div>
      </div>
    </Protected>
  );
}