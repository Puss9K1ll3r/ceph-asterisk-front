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
            <CustomButton variant="outline" @click="handleReload">
              Перечитать конфиг
            </CustomButton>
            <CustomButton @click="handleSave">
              Сохранить
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
                  <label for="port" class="label">SIP-порт</label>
                  <CustomInput
                    id="port"
                    type="number"
                    v-model="formData.port"
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
                <CustomButton @click="showAddNumber = !showAddNumber">
                  Добавить номер
                </CustomButton>
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
                    />
                  </div>
                  <div>
                    <label for="new-password" class="label">Пароль *</label>
                    <CustomInput
                      id="new-password"
                      type="password"
                      v-model="newNumber.password"
                      placeholder="••••••"
                    />
                  </div>
                  <div>
                    <label for="new-callerid" class="label">Caller ID *</label>
                    <CustomInput
                      id="new-callerid"
                      v-model="newNumber.callerId"
                      placeholder="Иванов И.И."
                    />
                  </div>
                  <div>
                    <label for="new-external" class="label">Внешний номер</label>
                    <CustomInput
                      id="new-external"
                      v-model="newNumber.externalNumber"
                      placeholder="+79161234567"
                    />
                  </div>
                  <div>
                    <label for="new-transport" class="label">Тип транспорта</label>
                    <CustomSelect
                      id="new-transport"
                      v-model="newNumber.transportType"
                      :options="numberTransportOptions"
                    />
                  </div>
                </div>
                <div class="flex justify-end gap-2">
                  <CustomButton variant="outline" @click="cancelAddNumber">
                    Отмена
                  </CustomButton>
                  <CustomButton @click="addNumber">
                    Добавить
                  </CustomButton>
                </div>
              </div>

              <!-- Таблица внутренних номеров -->
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
                    <CustomButton variant="outline" size="sm" @click="deleteNumber(number.id)">
                      Удалить
                    </CustomButton>
                  </td>
                </tr>
                </tbody>
              </table>

              <div v-if="formData.internalNumbers.length === 0" class="text-center py-8 text-gray-500">
                Нет добавленных внутренних номеров
              </div>
            </div>
          </div>
        </template>
      </Tabs>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import CustomInput from "@/components/UI/CustomInput.vue"
import CustomSelect from "@/components/UI/CustomSelect.vue"
import CustomButton from "@/components/UI/CustomButton.vue"
import Tabs from "@/components/UI/Tabs.vue"
import Badge from "@/components/UI/Badge.vue"
import type { VatsTableItem, VatsUpdateData, InternalNumber } from '@/types/vats'

interface Props {
  show: boolean
  vatsData: VatsTableItem | null
}

interface Emits {
  (e: 'close'): void
  (e: 'updated', vatsData: VatsUpdateData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const currentTab = ref('general')
const showAddNumber = ref(false)

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
  }
})

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  closeModal()
}

const handleReload = () => {
  console.log('Reload config')
  // В реальном приложении здесь был бы API запрос
}

const handleSave = () => {
  emit('updated', { ...formData })
  closeModal()
}

const cancelAddNumber = () => {
  showAddNumber.value = false
  resetNewNumber()
}

const resetNewNumber = () => {
  newNumber.number = ''
  newNumber.password = ''
  newNumber.callerId = ''
  newNumber.externalNumber = ''
  newNumber.transportType = 'local'
}

const addNumber = () => {
  if (!newNumber.number || !newNumber.password || !newNumber.callerId) {
    alert('Заполните все обязательные поля')
    return
  }

  const number: InternalNumber = {
    id: Date.now().toString(),
    number: newNumber.number,
    password: newNumber.password,
    callerId: newNumber.callerId,
    externalNumber: newNumber.externalNumber,
    transportType: newNumber.transportType!
  }

  formData.internalNumbers.push(number)
  resetNewNumber()
  showAddNumber.value = false
}

const deleteNumber = (id: string) => {
  formData.internalNumbers = formData.internalNumbers.filter(n => n.id !== id)
}
</script>

<style scoped>
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

.border {
  border: 1px solid #e2e8f0;
}

.rounded-lg {
  border-radius: 0.5rem;
}

.p-4 {
  padding: 1rem;
}

.p-6 {
  padding: 1.5rem;
}

.space-y-4 > * + * {
  margin-top: 1rem;
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
