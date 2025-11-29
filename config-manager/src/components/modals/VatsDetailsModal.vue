<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content large" @click.stop>
      <!-- Шапка -->
      <div class="modal-header">
        <div class="flex items-center gap-4 mb-6">
          <CustomButton variant="outline" @click="closeModal">
            Назад
          </CustomButton>
          <div class="flex-1">
            <h1 class="modal-title">{{ vatsData?.name }}</h1>
            <div class="flex items-center gap-3">
              <Badge :variant="vatsData?.status === 'Активна' ? 'default' : 'secondary'">
                {{ vatsData?.status }}
              </Badge>
              <span class="text-gray-600">Сервер: {{ vatsData?.server }}</span>
              <span class="text-gray-600">Порт: {{ vatsData?.port }}</span>
            </div>
          </div>
          <div class="flex gap-2">
            <CustomButton variant="outline" @click="handleReload" :disabled="isLoading">
              Перечитать конфиг
            </CustomButton>
            <CustomButton @click="handleSave" :disabled="isLoading">
              <span v-if="isLoading" class="button-loading">
                <span class="spinner"></span>
                Сохранение...
              </span>
              <span v-else>Сохранить</span>
            </CustomButton>
          </div>
        </div>
      </div>

      <!-- Вкладки -->
      <Tabs v-model="currentTab" :tabs="tabs">
        <template #general>
          <div class="tab-content">
            <!-- Основные настройки -->
            <div class="card">
              <div class="grid grid-cols-2 gap-6">
                <div>
                  <label for="name" class="label">Название ВАТС *</label>
                  <CustomInput
                    id="name"
                    v-model="formData.name"
                    placeholder="Введите название"
                    :with-icon="false"
                  />
                </div>

                <div>
                  <label for="port" class="label">SIP-порт *</label>
                  <CustomInput
                    id="port"
                    type="number"
                    v-model="portString"
                    :with-icon="false"
                  />
                </div>

                <div>
                  <label for="transport" class="label">Тип транспорта</label>
                  <CustomSelect
                    id="transport"
                    v-model="formData.transportType"
                    :options="transportOptions"
                  />
                </div>

                <div>
                  <label for="server" class="label">Сервер</label>
                  <CustomSelect
                    id="server"
                    v-model="formData.server"
                    :options="serverOptions"
                  />
                </div>

                <div>
                  <label for="status" class="label">Статус</label>
                  <CustomSelect
                    id="status"
                    v-model="formData.status"
                    :options="statusOptions"
                  />
                </div>
              </div>
            </div>
          </div>
        </template>

        <template #numbers>
          <div class="tab-content">
            <!-- Внутренние номера -->
            <div class="card">
              <div class="flex justify-between items-center mb-4">
                <h3 class="numbers-page-header">Внутренние номера</h3>
                <CustomButton 
                  @click="showAddNumber = !showAddNumber" 
                  :disabled="isLoading || loadingNumbers"
                >
                  Добавить номер
                </CustomButton>
              </div>

              <!-- Сообщение об ошибке -->
              <div v-if="numbersError" class="error-message mb-4">
                <div class="error-content">
                  <span class="error-icon">⚠</span>
                  <span>{{ numbersError }}</span>
                </div>
                <button @click="numbersError = ''" class="error-close">×</button>
              </div>

              <!-- Форма добавления номера -->
              <div v-if="showAddNumber" class="card bg-gray-50 mb-4">
                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label for="new-number" class="label">Внутренний номер *</label>
                    <CustomInput
                      id="new-number"
                      v-model="newNumber.number"
                      placeholder="101"
                      :with-icon="false"
                      :disabled="creatingNumber"
                    />
                  </div>
                  <div>
                    <label for="new-password" class="label">Пароль *</label>
                    <CustomInput
                      id="new-password"
                      type="password"
                      v-model="newNumber.password"
                      placeholder="••••••"
                      :with-icon="false"
                      :disabled="creatingNumber"
                    />
                  </div>
                  <div>
                    <label for="new-callerid" class="label">Caller ID *</label>
                    <CustomInput
                      id="new-callerid"
                      v-model="newNumber.callerId"
                      placeholder="Иванов И.И."
                      :with-icon="false"
                      :disabled="creatingNumber"
                    />
                  </div>
                  <div>
                    <label for="new-external" class="label">Внешний номер</label>
                    <CustomInput
                      id="new-external"
                      v-model="newNumber.externalNumber"
                      placeholder="+79161234567"
                      :with-icon="false"
                      :disabled="creatingNumber"
                    />
                  </div>
                  <div>
                    <label for="new-transport" class="label">Тип транспорта</label>
                    <CustomSelect
                      id="new-transport"
                      v-model="newNumber.transportType"
                      :options="numberTransportOptions"
                      :disabled="creatingNumber"
                    />
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <CustomButton variant="outline" @click="cancelAddNumber" :disabled="creatingNumber">
                    Отмена
                  </CustomButton>
                  <CustomButton @click="addNumber" :disabled="creatingNumber">
                    <span v-if="creatingNumber" class="button-loading">
                      <span class="spinner"></span>
                      Создание...
                    </span>
                    <span v-else>Добавить</span>
                  </CustomButton>
                </div>
              </div>

              <!-- Таблица внутренних номеров -->
              <div class="overflow-x-auto">
                <div v-if="loadingNumbers" class="loading-state">
                  <div class="spinner"></div>
                  <p>Загрузка номеров...</p>
                </div>
                <template v-else>
                  <table class="table">
                    <thead>
                    <tr>
                      <th>Номер</th>
                      <th>Caller ID</th>
                      <th>Внешний номер</th>
                      <th>Транспорт</th>
                      <th class="text-right">Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="number in formData.internalNumbers" :key="number.id">
                      <td>{{ number.number }}</td>
                      <td>{{ number.callerId }}</td>
                      <td>{{ number.externalNumber || '—' }}</td>
                      <td>
                        <Badge variant="outline">
                          {{ number.transportType === 'local' ? 'Локальный' : 'Внешний' }}
                        </Badge>
                      </td>
                      <td class="text-right">
                        <CustomButton 
                          variant="outline" 
                          size="sm" 
                          @click="deleteNumber(number.id)" 
                          :disabled="deletingNumberId === number.id"
                        >
                          <span v-if="deletingNumberId === number.id" class="button-loading">
                            <span class="spinner"></span>
                          </span>
                          <span v-else>Удалить</span>
                        </CustomButton>
                      </td>
                    </tr>
                    </tbody>
                  </table>
                  
                  <div v-if="formData.internalNumbers.length === 0" class="text-center py-8 text-gray-500">
                    Нет добавленных внутренних номеров
                  </div>
                </template>
              </div>
            </div>
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'
import CustomInput from "@/components/UI/CustomInput.vue"
import CustomSelect from "@/components/UI/CustomSelect.vue"
import CustomButton from "@/components/UI/CustomButton.vue"
import Tabs from "@/components/UI/Tabs.vue"
import Badge from "@/components/UI/Badge.vue"
import type { VatsTableItem, VatsUpdateData, InternalNumber, SIPUserCreateRequest } from '@/types/vats'

interface Props {
  show: boolean
  vatsData: VatsTableItem | null
  isLoading?: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'updated', vatsData: VatsUpdateData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const API_BASE_URL = 'http://127.0.0.1:8000'

const currentTab = ref('general')
const showAddNumber = ref(false)
const loadingNumbers = ref(false)
const creatingNumber = ref(false)
const deletingNumberId = ref<string | null>(null)
const numbersError = ref('')

const tabs = [
  { value: 'general', label: 'Основные' },
  { value: 'numbers', label: 'Внутренние номера' }
]

const transportOptions = [
  { value: 'UDP', label: 'UDP' },
  { value: 'TCP', label: 'TCP' },
  { value: 'TLS', label: 'TLS' }
]

const serverOptions = [
  { value: 'asterisk-01', label: 'asterisk-01' },
  { value: 'asterisk-02', label: 'asterisk-02' }
]

const statusOptions = [
  { value: 'Активна', label: 'Активна' },
  { value: 'Отключена', label: 'Отключена' }
]

const numberTransportOptions = [
  { value: 'local', label: 'Локальный' },
  { value: 'external', label: 'Внешний' }
]

const newNumber = reactive<Partial<InternalNumber>>({
  number: '',
  password: '',
  callerId: '',
  externalNumber: '',
  transportType: 'local'
})

const formData = reactive<VatsUpdateData>({
  id: '',
  name: '',
  status: 'Активна',
  server: '',
  port: 5060,
  transportType: 'UDP',
  internalNumbers: []
})

// Computed property для преобразования порта в строку
const portString = computed({
  get: () => formData.port.toString(),
  set: (value: string) => {
    formData.port = Number(value) || 5060
  }
})

// Загрузка внутренних номеров при открытии модального окна
const loadInternalNumbers = async () => {
  if (!props.vatsData) return
  
  loadingNumbers.value = true
  numbersError.value = ''
  
  try {
    const instanceId = Number(props.vatsData.id)
    const response = await fetch(`${API_BASE_URL}/instances/${instanceId}/users`)
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки номеров: ${response.status}`)
    }
    
    const users = await response.json()
    
    // Преобразуем данные из API в InternalNumber
    formData.internalNumbers = users.map((user: any) => ({
      id: user.id.toString(),
      number: user.username,
      callerId: user.caller_id,
      externalNumber: user.account_code || undefined,
      transportType: 'local' // По умолчанию, т.к. в бэкенде нет этого поля
    }))
    
  } catch (error) {
    console.error('Ошибка при загрузке внутренних номеров:', error)
    numbersError.value = 'Не удалось загрузить внутренние номера'
  } finally {
    loadingNumbers.value = false
  }
}

watch(() => props.show, (newVal) => {
  if (newVal && props.vatsData) {
    Object.assign(formData, {
      id: props.vatsData.id,
      name: props.vatsData.name,
      status: props.vatsData.status,
      server: props.vatsData.server,
      port: props.vatsData.port,
      transportType: props.vatsData.transportType,
      internalNumbers: props.vatsData.internalNumbers || []
    })
    
    // Загружаем актуальные номера с сервера
    loadInternalNumbers()
  }
})

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (!props.isLoading) {
    closeModal()
  }
}

const handleReload = () => {
  console.log('Reload config')
  // В реальном приложении здесь был бы API запрос
}

const handleSave = () => {
  // Валидация обязательных полей
  if (!formData.name.trim()) {
    alert('Введите название ВАТС')
    return
  }

  if (!formData.port || formData.port <= 0) {
    alert('Введите корректный SIP-порт')
    return
  }

  emit('updated', { ...formData })
}

const cancelAddNumber = () => {
  showAddNumber.value = false
  resetNewNumber()
  numbersError.value = ''
}

const resetNewNumber = () => {
  newNumber.number = ''
  newNumber.password = ''
  newNumber.callerId = ''
  newNumber.externalNumber = ''
  newNumber.transportType = 'local'
}

// Создание нового внутреннего номера
const addNumber = async () => {
  if (!newNumber.number || !newNumber.password || !newNumber.callerId) {
    alert('Заполните все обязательные поля')
    return
  }

  if (!props.vatsData) return

  creatingNumber.value = true
  numbersError.value = ''
  
  try {
    const instanceId = Number(props.vatsData.id)
    const createData: SIPUserCreateRequest = {
      username: newNumber.number,
      password: newNumber.password!,
      caller_id: newNumber.callerId,
      account_code: newNumber.externalNumber || '',
      context: 'internal',
      instance_name: props.vatsData.name
    }

    const response = await fetch(`${API_BASE_URL}/instances/${instanceId}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(createData)
    })

    if (!response.ok) {
      let errorDetail = `Ошибка создания: ${response.status}`
      try {
        const errorData = await response.json()
        errorDetail = errorData.detail || errorDetail
      } catch {
        // Игнорируем ошибки парсинга ошибки
      }
      throw new Error(errorDetail)
    }

    const createdUser = await response.json()
    
    // Добавляем созданный номер в список
    const internalNumber: InternalNumber = {
      id: createdUser.id.toString(),
      number: createdUser.username,
      callerId: createdUser.caller_id,
      externalNumber: createdUser.account_code || undefined,
      transportType: 'local'
    }

    formData.internalNumbers.push(internalNumber)
    resetNewNumber()
    showAddNumber.value = false
    
  } catch (error) {
    console.error('Ошибка при создании внутреннего номера:', error)
    numbersError.value = error instanceof Error ? error.message : 'Не удалось создать внутренний номер'
  } finally {
    creatingNumber.value = false
  }
}

// Удаление внутреннего номера
const deleteNumber = async (id: string) => {
  if (!props.vatsData) return

  if (!confirm('Вы уверены, что хотите удалить этот внутренний номер?')) {
    return
  }

  deletingNumberId.value = id
  numbersError.value = ''
  
  try {
    const instanceId = Number(props.vatsData.id)
    const response = await fetch(`${API_BASE_URL}/instances/${instanceId}/users/${id}`, {
      method: 'DELETE'
    })

    if (!response.ok) {
      throw new Error(`Ошибка удаления: ${response.status}`)
    }

    // Удаляем номер из списка
    formData.internalNumbers = formData.internalNumbers.filter(n => n.id !== id)
    
  } catch (error) {
    console.error('Ошибка при удалении внутреннего номера:', error)
    numbersError.value = 'Не удалось удалить внутренний номер'
  } finally {
    deletingNumberId.value = null
  }
}
</script>

<style scoped>
/* Добавим стили для состояний загрузки */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  color: #666;
}

.loading-state .spinner {
  margin-bottom: 1rem;
}

.error-message {
  background-color: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 12px 16px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.error-icon {
  font-size: 1.2rem;
}

.error-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #c33;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Остальные стили остаются без изменений */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content.large {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-header {
  margin-bottom: 1rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-between {
  justify-content: space-between;
}

.justify-end {
  justify-content: flex-end;
}

.flex-1 {
  flex: 1;
}

.gap-2 {
  gap: 0.5rem;
}

.gap-3 {
  gap: 0.75rem;
}

.gap-4 {
  gap: 1rem;
}

.mb-4 {
  margin-bottom: 1rem;
}

.mb-6 {
  margin-bottom: 1.5rem;
}

.text-gray-600 {
  color: #6b7280;
}

.text-gray-500 {
  color: #6b7280;
}

.text-center {
  text-align: center;
}

.text-right {
  text-align: right;
}

.py-8 {
  padding-top: 2rem;
  padding-bottom: 2rem;
}

.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1.5rem;
}

.bg-gray-50 {
  background-color: #f9fafb;
}

.label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: black;
}

.numbers-page-header {
  color: black;
}

.grid {
  display: grid;
}

.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.gap-6 {
  gap: 1.5rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table th, .table td {
  padding: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
  text-align: left;
  color: black;
}

.table th {
  background-color: #f8fafc;
  font-weight: 600;
  color: #374151;
}
</style>