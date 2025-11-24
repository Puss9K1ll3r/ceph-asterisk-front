<script setup lang="ts">
import { ref, computed } from 'vue'
import CustomButton from '@/components/UI/CustomButton.vue'
import CustomInput from '@/components/UI/CustomInput.vue'
import CustomSelect from '@/components/UI/CustomSelect.vue'
import CDRTable from '@/components/tables/CDRTable.vue'
import PageHeader from '@/components/UI/PageHeader.vue'

const searchQuery = ref('')
const selectedStatus = ref('all')
const selectedDate = ref('')

const statusOptions = [
  { value: 'all', label: 'Все' },
  { value: 'answered', label: 'Отвечен' },
  { value: 'not_answered', label: 'Не отвечен' },
  { value: 'busy', label: 'Занято' }
]

const callsData = ref([
  {
    dateTime: '29.10.2025, 10:30',
    from: '101',
    to: '+79161234567',
    duration: '2:05',
    status: 'Отвечен',
    vats: 'Головной офис'
  },
  {
    dateTime: '29.10.2025, 11:15',
    from: '+79167654321',
    to: '102',
    duration: '0:00',
    status: 'Не отвечен',
    vats: 'Головной офис'
  },
  {
    dateTime: '29.10.2025, 12:00',
    from: '201',
    to: '+79165555555',
    duration: '5:20',
    status: 'Отвечен',
    vats: 'Филиал Москва'
  },
  {
    dateTime: '29.10.2025, 13:45',
    from: '+79163333333',
    to: '101',
    duration: '0:45',
    status: 'Отвечен',
    vats: 'Головной офис'
  },
  {
    dateTime: '29.10.2025, 14:20',
    from: '102',
    to: '+79162222222',
    duration: '0:00',
    status: 'Занято',
    vats: 'Головной офис'
  }
])

const filteredCalls = computed(() => {
  return callsData.value.filter(call => {
    const searchLower = searchQuery.value.toLowerCase()
    const matchesSearch = !searchQuery.value ||
      call.from.toLowerCase().includes(searchLower) ||
      call.to.toLowerCase().includes(searchLower)

    const matchesStatus = selectedStatus.value === 'all' ||
      call.status.toLowerCase() === statusOptions.find(opt => opt.value === selectedStatus.value)?.label.toLowerCase()

    const matchesDate = !selectedDate.value ||
      call.dateTime.startsWith(selectedDate.value.split('-').reverse().join('.'))

    return matchesSearch && matchesStatus && matchesDate
  })
})
const resetFilters = () => {
  searchQuery.value = ''
  selectedStatus.value = 'all'
  selectedDate.value = ''
}
</script>

<template>
  <div class="wrapper">
    <PageHeader
      title="Детализация звонков (CDR)"
      subtitle="Все ВАТС"
    >
      <template #actions>
        <CustomButton class="export-button">
          + Экспорт
        </CustomButton>
      </template>
    </PageHeader>

    <div class="search-filters">
      <div class="filter-item">
        <CustomInput
          v-model="searchQuery"
          label="Поиск по номеру"
          placeholder="Введите номер..."
        />
      </div>
      <div class="filter-item">
        <CustomSelect
          v-model="selectedStatus"
          label="Статус"
          placeholder="Все статусы"
          :options="statusOptions"
        />
      </div>
      <div class="filter-item">
        <CustomInput
          class="custom-input--date"
          v-model="selectedDate"
          label="Дата"
          type="date"
          :with-icon="false"
        />
      </div>
    </div>

    <div class="filter-info">
      <span class="results-count">
        Найдено записей: {{ filteredCalls.length }}
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
      >
        Сбросить фильтры
      </CustomButton>
    </div>

    <main class="content">
      <CDRTable :calls-data="filteredCalls" />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0 1rem;
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
}
</style>
