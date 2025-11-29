<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CustomButton from '@/components/UI/CustomButton.vue'
import CustomInput from '@/components/UI/CustomInput.vue'
import CustomSelect from '@/components/UI/CustomSelect.vue'
import CDRTable from '@/components/tables/CDRTable.vue'
import PageHeader from '@/components/UI/PageHeader.vue'
import type { CDRRecord, CallRecord, CDRFilter } from '@/types/cdr'

const API_BASE_URL = 'http://127.0.0.1:8000'

// Состояния
const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedDate = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const cdrData = ref<CDRRecord[]>([])
const allCdrData = ref<CDRRecord[]>([]) // Все загруженные данные для клиентской фильтрации

// Дебаунс для поиска
let searchDebounce: number | null = null

// Фильтры
const statusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'ANSWERED', label: 'Отвечен' },
  { value: 'NO ANSWER', label: 'Не отвечен' },
  { value: 'BUSY', label: 'Занято' },
  { value: 'FAILED', label: 'Неуспешный' }
]

// Загрузка всех данных CDR с API (без фильтров)
const loadAllCDRData = async () => {
  isLoading.value = true
  errorMessage.value = ''
  
  try {
    console.log('📥 Загрузка всех данных CDR...')

    const response = await fetch(`${API_BASE_URL}/cdr/?limit=1000`)
    
    if (!response.ok) {
      throw new Error(`Ошибка загрузки данных: ${response.status}`)
    }

    const data = await response.json()
    console.log('✅ Получено записей:', data.length)
    if (data.length > 0) {
      console.log('📋 Пример записи:', data[0])
      console.log('📊 Статусы в данных:', [...new Set(data.map((item: CDRRecord) => item.disposition))])
    }
    
    // Сохраняем все данные для клиентской фильтрации
    allCdrData.value = data
    applyAllFilters()
    
  } catch (error) {
    console.error('❌ Ошибка при загрузке CDR:', error)
    errorMessage.value = 'Не удалось загрузить историю звонков'
  } finally {
    isLoading.value = false
  }
}

// Функция для фильтрации данных по номеру на клиенте
const filterDataByNumber = (data: CDRRecord[], query: string): CDRRecord[] => {
  if (!query.trim()) return data
  
  const searchLower = query.trim().toLowerCase()
  return data.filter(record => 
    record.src.toLowerCase().includes(searchLower) ||
    record.dst.toLowerCase().includes(searchLower)
  )
}

// Функция для фильтрации данных по статусу на клиенте
const filterDataByStatus = (data: CDRRecord[], status: string): CDRRecord[] => {
  if (status === 'all') return data
  
  return data.filter(record => record.disposition === status)
}

// Функция для фильтрации данных по дате на клиенте
const filterDataByDate = (data: CDRRecord[], date: string): CDRRecord[] => {
  if (!date) return data
  
  const targetDate = new Date(date)
  const targetDateString = targetDate.toISOString().split('T')[0] // YYYY-MM-DD
  
  return data.filter(record => {
    const recordDate = new Date(record.calldate)
    const recordDateString = recordDate.toISOString().split('T')[0]
    return recordDateString === targetDateString
  })
}

// Применение всех фильтров
const applyAllFilters = () => {
  let filteredData = [...allCdrData.value]
  
  console.log('🔄 Применение фильтров...')
  console.log('   - Исходное количество:', allCdrData.value.length)
  
  // Применяем фильтр по номеру
  if (searchQuery.value.trim()) {
    filteredData = filterDataByNumber(filteredData, searchQuery.value)
    console.log('   - После фильтра по номеру:', filteredData.length)
  }
  
  // Применяем фильтр по статусу
  if (selectedStatus.value !== 'all') {
    filteredData = filterDataByStatus(filteredData, selectedStatus.value)
    console.log('   - После фильтра по статусу:', filteredData.length)
  }
  
  // Применяем фильтр по дате
  if (selectedDate.value) {
    filteredData = filterDataByDate(filteredData, selectedDate.value)
    console.log('   - После фильтра по дате:', filteredData.length)
  }
  
  cdrData.value = filteredData
  console.log('✅ Финальное количество:', filteredData.length)
}

// Обработчик изменения поискового запроса
const handleSearchInput = (value: string) => {
  searchQuery.value = value
  
  // Очищаем предыдущий таймер
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
  
  // Устанавливаем новый таймер с задержкой 300ms
  searchDebounce = setTimeout(() => {
    applyAllFilters()
  }, 300)
}

// Обработчик изменения статуса
const handleStatusChange = (value: string) => {
  selectedStatus.value = value
  applyAllFilters()
}

// Обработчик изменения даты
const handleDateChange = (value: string) => {
  selectedDate.value = value
  applyAllFilters()
}

// Преобразование данных CDR в формат для таблицы
const transformCDRToCallRecord = (cdr: CDRRecord): CallRecord => {
  // Форматируем дату из "2025-11-29T18:51:16" в "29.11.2025, 18:51"
  const date = new Date(cdr.calldate)
  const formattedDate = `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`

  // Форматируем длительность (секунды в MM:SS)
  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }

  // Маппинг статусов из API в русские названия
  const statusMap: { [key: string]: string } = {
    'ANSWERED': 'Отвечен',
    'NO ANSWER': 'Не отвечен', 
    'BUSY': 'Занято',
    'FAILED': 'Неуспешный'
  }

  return {
    dateTime: formattedDate,
    from: cdr.src,
    to: cdr.dst,
    duration: formatDuration(cdr.duration),
    status: statusMap[cdr.disposition] || cdr.disposition,
    vats: cdr.instance_name
  }
}

// Отфильтрованные данные для таблицы
const callsData = computed(() => {
  return cdrData.value.map(transformCDRToCallRecord)
})

const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedDate.value = ''
  // Восстанавливаем все данные
  cdrData.value = allCdrData.value
  console.log('🔄 Сброс фильтров, показываем все записи:', allCdrData.value.length)
}

// Функция для экспорта данных в JSON
const exportToJson = () => {
  if (callsData.value.length === 0) {
    alert('Нет данных для экспорта')
    return
  }

  try {
    const exportData = {
      metadata: {
        exportDate: new Date().toLocaleString('ru-RU'),
        totalRecords: callsData.value.length,
        filters: {
          searchQuery: searchQuery.value,
          status: selectedStatus.value,
          date: selectedDate.value
        }
      },
      data: callsData.value
    }

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url

    const date = new Date().toISOString().split('T')[0]
    link.download = `cdr_export_${date}.json`

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    console.log('Экспорт завершен успешно. Скачано записей:', callsData.value.length)
  } catch (error) {
    console.error('Ошибка при экспорте данных:', error)
    alert('Произошла ошибка при экспорте данных')
  }
}

// Загружаем данные при монтировании компонента
onMounted(() => {
  loadAllCDRData()
})

// Очищаем таймер при уничтожении компонента
import { onUnmounted } from 'vue'
onUnmounted(() => {
  if (searchDebounce) {
    clearTimeout(searchDebounce)
  }
})
</script>

<template>
  <div class="wrapper">
    <PageHeader
      title="Детализация звонков (CDR)"
      subtitle="Все ВАТС"
    >
      <template #actions>
        <div class="header-actions">
          <CustomButton 
            @click="loadAllCDRData" 
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
            class="export-button" 
            @click="exportToJson"
            :disabled="isLoading || callsData.length === 0"
          >
            Экспорт
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

    <div class="search-filters">
      <div class="filter-item">
        <CustomInput
          :modelValue="searchQuery"
          @update:modelValue="handleSearchInput"
          label="Поиск по номеру"
          placeholder="Введите номер..."
          :with-icon="false"
          :disabled="isLoading"
        />
      </div>
      <div class="filter-item">
        <CustomSelect
          :modelValue="selectedStatus"
          @update:modelValue="handleStatusChange"
          label="Статус"
          placeholder="Все статусы"
          :options="statusOptions"
          :disabled="isLoading"
        />
      </div>
      <div class="filter-item">
        <CustomInput
          class="custom-input--date"
          :modelValue="selectedDate"
          @update:modelValue="handleDateChange"
          label="Дата"
          type="date"
          :with-icon="false"
          :disabled="isLoading"
        />
      </div>
    </div>

    <div class="filter-info">
      <span class="results-count">
        Найдено записей: {{ callsData.length }}
        <span v-if="searchQuery || selectedStatus !== 'all' || selectedDate" class="client-filter-note">
          (фильтрация на клиенте)
        </span>
      </span>
      <span
        v-if="searchQuery || selectedStatus !== 'all' || selectedDate"
        class="active-filters"
      >
        (активные фильтры)
      </span>
      <CustomButton
        class="reset-button"
        variant="outline"
        @click="resetFilters"
        :disabled="isLoading"
      >
        Сбросить фильтры
      </CustomButton>
    </div>

    <main class="content">
      <div v-if="isLoading" class="loading-state">
        <div class="spinner large"></div>
        <p>Загрузка истории звонков...</p>
      </div>
      <div v-else-if="callsData.length === 0" class="empty-state">
        <p>Нет данных о звонках</p>
        <CustomButton @click="loadAllCDRData">Обновить</CustomButton>
      </div>
      <CDRTable v-else :calls-data="callsData" />
    </main>
  </div>
</template>

<style scoped>
.client-filter-note {
  font-size: 0.8rem;
  color: #666;
  font-style: italic;
  margin-left: 8px;
}
.wrapper {
  width: 100%;
  padding: 0 1rem;
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

.search-filters {
  padding: 1rem;
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
  background: var(--color-background-mute);
  border-radius: 8px;
  gap: 1rem;
}

.filter-item {
  flex: 1;
  min-width: 200px;
}

.filter-info {
  padding: 0 1rem;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.reset-button {
  margin: 0;
}

.results-count {
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
}

.active-filters {
  font-size: 0.8rem;
  color: #3498db;
  font-style: italic;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1rem;
  min-height: 400px;
  display: flex;
  flex-direction: column;
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

.error-close {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #856404;
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
  .search-filters {
    flex-direction: column;
  }
  
  .header-actions {
    flex-direction: column;
    width: 100%;
  }
  
  .filter-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>