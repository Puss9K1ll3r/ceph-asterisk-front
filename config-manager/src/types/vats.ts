export interface VatsFormData {
  name: string
  sipPort: string,
  server: string,
  transportType: string
}

export interface VatsTableItem {
  name: string
  status: 'Активно' | 'Отключена'
  server: string
  port: number
  date: string
}
