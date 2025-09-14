'use client'

import { apiFetch } from '@/libs/http'
import { useAuthStore } from '@/libs/stores/auth'
import { TodayAttendance, HistoryRecord, MonthlyStats } from '@/libs/stores/attendance'





export async function getAttendanceHistory(
  startDate?: string,
  endDate?: string
): Promise<HistoryRecord[]> {
  const userId = useAuthStore.getState().user?.id;
  
  if (!userId) {
    return [];
  }
  
  const end = endDate ? new Date(endDate) : new Date();
  const start = startDate ? new Date(startDate) : (() => {
    const date = new Date();
    date.setDate(date.getDate() - 30);
    return date;
  })();
  
  const format = (date: Date) => {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }
  
  const params = new URLSearchParams({
    userId,
    startDate: format(start),
    endDate: format(end)
  });
  
  try {
    const response: any = await apiFetch(`/admin/attendance/all?${params.toString()}`);
    
    if (!Array.isArray(response)) {
      return [];
    }
    
    const recordsByDate: Record<string, any[]> = {};
    response.forEach((record: any) => {
      if (!record.timestamp || !record.status) {
        return;
      }
      
      const date = record.timestamp.split('T')[0];
      if (!recordsByDate[date]) {
        recordsByDate[date] = [];
      }
      recordsByDate[date].push(record);
    });
    
    const historyRecords: HistoryRecord[] = [];
    Object.keys(recordsByDate).forEach(date => {
      const records = recordsByDate[date];
      const clockInRecord = records.find((r: any) => r.status === 'CLOCK_IN');
      const clockOutRecord = records.find((r: any) => r.status === 'CLOCK_OUT');
      
      const formatTime = (timestamp: string) => {
        return new Date(timestamp).toLocaleTimeString('id-ID', { 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      };
      
      let status: 'Tepat Waktu' | 'Terlambat' | 'Alpa' = 'Alpa';
      if (clockInRecord) {
        const clockInTime = new Date(clockInRecord.timestamp);
        const workStartTime = new Date(clockInTime);
        workStartTime.setHours(8, 0, 0, 0);
        
        status = clockInTime <= workStartTime ? 'Tepat Waktu' : 'Terlambat';
      }
      
      historyRecords.push({
        id: historyRecords.length + 1,
        date,
        clockIn: clockInRecord ? formatTime(clockInRecord.timestamp) : '-',
        clockOut: clockOutRecord ? formatTime(clockOutRecord.timestamp) : '-',
        status,
        user: {
          id: clockInRecord?.user?.id || clockOutRecord?.user?.id || '',
          email: clockInRecord?.user?.email || clockOutRecord?.user?.email || '',
          name: clockInRecord?.user?.name || clockOutRecord?.user?.name || '',
          role: clockInRecord?.user?.role || clockOutRecord?.user?.role || '',
        }
      });
    });
    
    const sortedRecords = historyRecords.sort((a, b) => b.date.localeCompare(a.date));
    
    return sortedRecords;
  } catch (error) {
    return [];
  }
}

