<script setup lang="ts">
import { ref, onMounted } from 'vue'
import CustomButton from "@/components/UI/CustomButton.vue"
import VatsTable from '@/components/tables/VatsTable.vue'
import PageHeader from '@/components/UI/PageHeader.vue'
import CreateVatsModal from '@/components/modals/CreateVatsModal.vue'
import VatsDetailsModal from '@/components/modals/VatsDetailsModal.vue'
import type { VatsFormData, VatsTableItem, VatsUpdateData } from '@/types/vats'

const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const editingVats = ref<VatsTableItem | null>(null)
const isLoading = ref(false)
const errorMessage = ref('')

const serversData = ref<VatsTableItem[]>([])

// API base URL
const API_BASE_URL = 'http://127.0.0.1:8000'

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const openDetailsModal = (vats: VatsTableItem) => {
  editingVats.value = vats
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  editingVats.value = null
}

// Улучшенная функция для получения списка ВАТС
const fetchVatsList = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    
    const response = await fetch(`${API_BASE_URL}/instances/`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      mode: 'cors', // Явно указываем режим CORS
    })
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    const text = await response.text()
    
    let instances
    try {
      instances = JSON.parse(text)
    } catch (parseError) {
      console.error('Ошибка парсинга JSON:', parseError)
      throw new Error('Неверный формат ответа от сервера')
    }
    
    // Преобразуем данные из API в формат VatsTableItem
    serversData.value = instances.map((instance: any) => ({
      id: instance.id.toString(),
      name: instance.name,
      status: instance.status === 'running' ? 'Активна' : 'Отключена',
      server: `asterisk-${instance.name}`,
      port: instance.sip_port,
      date: formatDate(new Date()),
      transportType: 'UDP',
      internalNumbers: []
    }))
    
    
  } catch (error) {
    console.error('Полная ошибка при загрузке ВАТС:', error)
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      errorMessage.value = 'Не удалось подключиться к серверу. Проверьте, запущен ли бэкенд.'
    } else {
      errorMessage.value = `Ошибка при загрузке ВАТС: ${error.message}`
    }
  } finally {
    isLoading.value = false
  }
}

const handleVATSUpdated = async (updatedData: VatsUpdateData) => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('Обновление ВАТС:', updatedData)

    // Преобразуем данные для бэкенда
    const updateData = {
      name: updatedData.name,
      sip_port: updatedData.port,
      http_port: updatedData.port + 1000,
      status: updatedData.status === 'Активна' ? 'running' : 'stopped'
    }

    const response = await fetch(`${API_BASE_URL}/instances/${updatedData.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(updateData)
    })

    console.log('Ответ при обновлении:', response.status)

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorDetail = errorData.detail || errorDetail
      } catch {
        // Игнорируем ошибки парсинга ошибки
      }
      throw new Error(errorDetail)
    }

    const updatedInstance = await response.json()
    console.log('Обновленная ВАТС:', updatedInstance)
    
    // Обновляем данные в локальном списке (включая внутренние номера)
    const index = serversData.value.findIndex(item => item.id === updatedData.id)
    if (index !== -1) {
      serversData.value[index] = {
        ...serversData.value[index],
        name: updatedData.name,
        port: updatedData.port,
        status: updatedData.status,
        server: updatedData.server,
        transportType: updatedData.transportType,
        internalNumbers: updatedData.internalNumbers // Сохраняем обновленные номера
      }
    }

    closeDetailsModal()
    
  } catch (error) {
    console.error('Полная ошибка при обновлении ВАТС:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось обновить ВАТС'
  } finally {
    isLoading.value = false
  }
}

// Функция для создания ВАТС
const handleVATSCreated = async (vatsData: VatsFormData) => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    const createData = {
      name: vatsData.name,
      sip_port: parseInt(vatsData.sipPort),
      http_port: parseInt(vatsData.sipPort) + 1000,
      create_test_users: true
    }

    console.log('Отправка данных для создания:', createData)

    const response = await fetch(`${API_BASE_URL}/instances/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(createData)
    })

    console.log('Ответ при создании:', response.status)

    if (!response.ok) {
      let errorDetail = `HTTP error! status: ${response.status}`
      try {
        const errorData = await response.json()
        errorDetail = errorData.detail || errorDetail
      } catch {
        // Игнорируем ошибки парсинга ошибки
      }
      throw new Error(errorDetail)
    }

    const newInstance = await response.json()
    console.log('Созданная ВАТС:', newInstance)
    
    // Добавляем новую ВАТС в список
    const newVats: VatsTableItem = {
      id: newInstance.id.toString(),
      name: newInstance.name,
      status: newInstance.status === 'running' ? 'Активна' : 'Отключена',
      server: `asterisk-${newInstance.name}`,
      port: newInstance.sip_port,
      date: formatDate(new Date()),
      transportType: vatsData.transportType,
      internalNumbers: []
    }

    serversData.value.push(newVats)
    closeCreateModal()
    
  } catch (error) {
    console.error('Полная ошибка при создании ВАТС:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Не удалось создать ВАТС'
  } finally {
    isLoading.value = false
  }
}

// Функция для удаления ВАТС
const handleVATSDeleted = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить эту ВАТС? Это действие нельзя отменить.')) {
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('Удаление ВАТС с ID:', id)

    const response = await fetch(`${API_BASE_URL}/instances/${id}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
      }
    })

    console.log('Ответ при удалении:', response.status)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    // Удаляем ВАТС из списка
    serversData.value = serversData.value.filter(item => item.id !== id)
    console.log('ВАТС успешно удалена')
    
  } catch (error) {
    console.error('Полная ошибка при удалении ВАТС:', error)
    errorMessage.value = 'Не удалось удалить ВАТС'
    
    // Показываем mock данные для тестирования UI
    console.log('Используем mock данные для демонстрации')
    serversData.value = serversData.value.filter(item => item.id !== id)
  } finally {
    isLoading.value = false
  }
}

// Функция для форматирования даты
const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year} г.`
}

// Загружаем список ВАТС при монтировании компонента
onMounted(() => {
  fetchVatsList()
})

// Функция для повторной загрузки данных
const reloadData = () => {
  errorMessage.value = ''
  fetchVatsList()
}
</script>

<template>
  <div class="wrapper">
    <PageHeader
        title="Управление ВАТС"
        subtitle="Список всех виртуальных АТС в кластере"
    >
      <template #actions>
        <div class="header-actions">
          <CustomButton 
            @click="reloadData"
            variant="outline"
            :disabled="isLoading"
            class="reload-btn"
          >
            <span v-if="isLoading" class="button-loading">
              <span class="spinner"></span>
            </span>
            <span v-else>⟳ Обновить</span>
          </CustomButton>
          <CustomButton 
            @click="openCreateModal"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="button-loading">
              <span class="spinner"></span>
            </span>
            <span v-else>+ Создать ВАТС</span>
          </CustomButton>
        </div>
      </template>
    </PageHeader>

    <!-- Сообщение об ошибке -->
    <div v-if="errorMessage" class="error-message">
      <div class="error-content">
        <span class="error-icon">⚠</span>
        <span>{{ errorMessage }}</span>
      </div>
      <button @click="errorMessage = ''" class="error-close">×</button>
    </div>

    <main class="content">
      <div v-if="isLoading && serversData.length === 0" class="loading-state">
        <div class="spinner large"></div>
        <p>Загрузка ВАТС...</p>
      </div>
      <div v-else-if="serversData.length === 0" class="empty-state">
        <p>Нет созданных ВАТС</p>
        <CustomButton @click="openCreateModal">Создать первую ВАТС</CustomButton>
      </div>
      <VatsTable
          v-else
          :table-data="serversData"
          @edit="openDetailsModal"
          @delete="handleVATSDeleted"
      />
    </main>

    <CreateVatsModal
        :show="showCreateModal"
        @close="closeCreateModal"
        @created="handleVATSCreated"
    />

    <VatsDetailsModal
        :show="showDetailsModal"
        :vats-data="editingVats"
        @close="closeDetailsModal"
        @updated="handleVATSUpdated"
        :is-loading="isLoading"
    />
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  min-height: 400px;
  display: flex;
  flex-direction: column;
}

.header-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.reload-btn {
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  color: #6c757d;
}

.error-message {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 12px 16px;
  border-radius: 6px;
  margin-bottom: 1rem;
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

.error-retry {
  background: none;
  border: 1px solid #856404;
  color: #856404;
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.error-retry:hover {
  background-color: #856404;
  color: white;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
  font-size: 1.1rem;
  flex: 1;
}

.empty-state p {
  margin-bottom: 1rem;
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

.spinner.large {
  width: 32px;
  height: 32px;
  border-width: 3px;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .error-message {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }
  
  .error-retry {
    align-self: flex-end;
  }
}
</style>