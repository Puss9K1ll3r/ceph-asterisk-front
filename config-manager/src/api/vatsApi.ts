import axiosInstance from './axiosConfig'
import type {
  VatsFormData,
  VatsUpdateData,
  SIPUserCreateRequest,
  VatsInstanceFromAPI,
  SIPUserFromAPI
} from '@/types/vats'
import { API_CONFIG } from '@/config/api'

export const vatsApi = {
  // Получение списка ВАТС
  async getVatsList(): Promise<VatsInstanceFromAPI[]> {
    const response = await axiosInstance.get<VatsInstanceFromAPI[]>(API_CONFIG.ENDPOINTS.INSTANCES)
    return response.data
  },

  // Создание ВАТС
  async createVats(vatsData: VatsFormData): Promise<VatsInstanceFromAPI> {
    const createData = {
      name: vatsData.name,
      sip_port: parseInt(vatsData.sipPort),
      http_port: parseInt(vatsData.sipPort) + 1000,
      create_test_users: true,
    }
    const response = await axiosInstance.post<VatsInstanceFromAPI>(
      API_CONFIG.ENDPOINTS.INSTANCES,
      createData
    )
    return response.data
  },

  // Обновление ВАТС
  async updateVats(id: string, updateData: VatsUpdateData): Promise<VatsInstanceFromAPI> {
    const data = {
      name: updateData.name,
      sip_port: updateData.port,
      http_port: updateData.port + 1000,
      status: updateData.status === 'Активна' ? 'running' : 'stopped',
    }
    const response = await axiosInstance.put<VatsInstanceFromAPI>(
      `${API_CONFIG.ENDPOINTS.INSTANCES}${id}`,
      data
    )
    return response.data
  },

  // Удаление ВАТС
  async deleteVats(id: string): Promise<void> {
    await axiosInstance.delete(`${API_CONFIG.ENDPOINTS.INSTANCES}${id}`)
  },

  // Получение внутренних номеров ВАТС
  async getVatsUsers(instanceId: number): Promise<SIPUserFromAPI[]> {
    const response = await axiosInstance.get<SIPUserFromAPI[]>(
      `${API_CONFIG.ENDPOINTS.INSTANCES}${instanceId}/users`
    )
    return response.data
  },

  // Создание внутреннего номера
  async createVatsUser(instanceId: number, userData: SIPUserCreateRequest): Promise<SIPUserFromAPI> {
    const response = await axiosInstance.post<SIPUserFromAPI>(
      `${API_CONFIG.ENDPOINTS.INSTANCES}${instanceId}/users`,
      userData
    )
    return response.data
  },

  // Удаление внутреннего номера
  async deleteVatsUser(instanceId: number, userId: string): Promise<void> {
    await axiosInstance.delete(
      `${API_CONFIG.ENDPOINTS.INSTANCES}${instanceId}/users/${userId}`
    )
  },
}
