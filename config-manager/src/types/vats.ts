export interface VatsFormData {
  name: string
  sipPort: string
  server: string
  transportType: string
}

export interface InternalNumber {
  id: string
  number: string
  password: string
  callerId: string
  externalNumber?: string
  transportType: 'local' | 'external'
}

export interface VatsTableItem {
  id: string
  name: string
  status: 'Активна' | 'Отключена'
  server: string
  port: number
  date: string
  transportType: string
  internalNumbers: InternalNumber[]
}

export interface VatsUpdateData {
  id: string
  name: string
  server: string
  port: number
  transportType: string
  internalNumbers: InternalNumber[]
}
