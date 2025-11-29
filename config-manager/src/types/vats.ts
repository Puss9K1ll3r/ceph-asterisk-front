export interface VatsFormData {
  name: string
  sipPort: string
  server: string
  transportType: string
}

export interface InternalNumber {
  id: string
  number: string
  password?: string  // Сделаем опциональным, т.к. при получении с бэкенда пароль не возвращается
  callerId: string
  externalNumber?: string
  transportType: 'local' | 'external'
}

export interface SIPUserCreateRequest {
  username: string
  password: string
  caller_id: string
  account_code?: string
  context?: string
  instance_name: string
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
  status: 'Активна' | 'Отключена'
  server: string
  port: number
  transportType: string
  internalNumbers: InternalNumber[]
}
