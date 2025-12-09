import axiosInstance from './axiosConfig'
import { API_CONFIG } from '@/config/api'
import type { CDRRecord } from '@/types/cdr'

export const cdrApi = {
  // Получение CDR записей
  async getCDR(limit?: number): Promise<CDRRecord[]> {
    const params = limit ? { limit } : {}
    const response = await axiosInstance.get<CDRRecord[]>(API_CONFIG.ENDPOINTS.CDR, { params })
    return response.data
  },

  // Экспорт CDR в JSON (опционально, если нужно на сервере)
  async exportCDR(filters?: {
    searchQuery: string
    status: string
    date: string
  }) {
    const response = await axiosInstance.post(`${API_CONFIG.ENDPOINTS.CDR}/export`, {
      filters,
    })
    return response.data
  },
}
