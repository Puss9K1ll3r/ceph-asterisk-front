<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from "@/components/UI/CustomButton.vue"
import VatsTable from '@/components/tables/VatsTable.vue'
import PageHeader from '@/components/UI/PageHeader.vue'
import CreateVatsModal from '@/components/modals/CreateVatsModal.vue'
import VatsDetailsModal from '@/components/modals/VatsDetailsModal.vue'
import type { VatsFormData, VatsTableItem, VatsUpdateData } from '@/types/vats'

const showCreateModal = ref(false)
const showDetailsModal = ref(false)
const editingVats = ref<VatsTableItem | null>(null)

// Упрощенные данные
const serversData = ref<VatsTableItem[]>([
  {
    id: '1',
    name: 'Головной офис',
    status: 'Активна',
    server: 'asterisk-01',
    port: 5060,
    date: '15 октября 2025 г. в 10:30',
    transportType: 'UDP',
    internalNumbers: [
      {
        id: '1-1',
        number: '101',
        password: 'pass101',
        callerId: 'Иванов И.И.',
        externalNumber: '+79161234567',
        transportType: 'local'
      },
      {
        id: '1-2',
        number: '102',
        password: 'pass102',
        callerId: 'Петров П.П.',
        transportType: 'local'
      }
    ]
  },
  {
    id: '2',
    name: 'Филиал Москва',
    status: 'Активна',
    server: 'asterisk-02',
    port: 5061,
    date: '20 октября 2025 г. в 14:15',
    transportType: 'TCP',
    internalNumbers: [
      {
        id: '2-1',
        number: '201',
        password: 'pass201',
        callerId: 'Сидоров С.С.',
        transportType: 'local'
      }
    ]
  },
  {
    id: '3',
    name: 'Техподдержка',
    status: 'Отключена',
    server: 'asterisk-01',
    port: 5062,
    date: '10 сентября 2025 г. в 09:00',
    transportType: 'UDP',
    internalNumbers: []
  }
])

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

const handleVATSCreated = (vatsData: VatsFormData) => {
  console.log('Создана новая ВАТС:', vatsData)

  const newVats: VatsTableItem = {
    id: Date.now().toString(),
    name: vatsData.name,
    status: 'Активна',
    server: vatsData.server,
    port: parseInt(vatsData.sipPort),
    date: new Date().toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }),
    transportType: vatsData.transportType,
    internalNumbers: []
  }

  serversData.value.push(newVats)
}

const handleVATSUpdated = (updatedData: VatsUpdateData) => {
  console.log('Обновлена ВАТС:', updatedData)

  const index = serversData.value.findIndex(item => item.id === updatedData.id)
  if (index !== -1) {
    serversData.value[index] = {
      ...serversData.value[index],
      ...updatedData
    }
  }
}

const handleVATSDeleted = (id: string) => {
  if (confirm('Вы уверены, что хотите удалить эту ВАТС?')) {
    serversData.value = serversData.value.filter(item => item.id !== id)
  }
}
</script>

<template>
  <div class="wrapper">
    <PageHeader
      title="Управление ВАТС"
      subtitle="Список всех виртуальных АТС в кластере"
    >
      <template #actions>
        <CustomButton @click="openCreateModal">+ Создать ВАТС</CustomButton>
      </template>
    </PageHeader>

    <main class="content">
      <VatsTable
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
}
</style>
