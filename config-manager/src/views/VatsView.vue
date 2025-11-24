<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from "@/components/UI/CustomButton.vue"
import VatsTable from '@/components/tables/VatsTable.vue'
import PageHeader from '@/components/UI/PageHeader.vue'
import CreateVatsModal from '@/components/modals/CreateVatsModal.vue'
import type { VatsFormData, VatsTableItem } from '@/types/vats'

const showCreateModal = ref(false)

const serversData = ref<VatsTableItem[]>([
  {
    name: 'Головной офис',
    status: 'Активно',
    server: 'asterisk-01',
    port: 5060,
    date: '15 октября 2025 г. в 10:30'
  },
  {
    name: 'Филиал Москва',
    status: 'Активно',
    server: 'asterisk-02',
    port: 5061,
    date: '20 октября 2025 г. в 14:15'
  },
  {
    name: 'Техподдержка',
    status: 'Отключена',
    server: 'asterisk-01',
    port: 5062,
    date: '10 сентября 2025 г. в 09:00'
  }
])

const openCreateModal = () => {
  showCreateModal.value = true
}

const closeCreateModal = () => {
  showCreateModal.value = false
}

const handleVATSCreated = (vatsData: VatsFormData) => {
  console.log('Создана новая ВАТС:', vatsData)

  serversData.value.push({
    name: vatsData.name,
    status: 'Активно',
    server: `asterisk-01`,
    port: parseInt(vatsData.sipPort),
    date: new Date().toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  })
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
      <VatsTable :table-data="serversData" />
    </main>

    <CreateVatsModal
      :show="showCreateModal"
      @close="closeCreateModal"
      @created="handleVATSCreated"
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
