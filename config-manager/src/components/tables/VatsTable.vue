<script setup lang="ts">
import type { VatsTableItem } from '@/types/vats'
import CustomButton from '@/components/UI/CustomButton.vue'

interface Props {
  tableData: VatsTableItem[]
}

interface Emits {
  (e: 'edit', vats: VatsTableItem): void
  (e: 'delete', id: string): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const getStatusClass = (status: string) => {
  return status === 'Активна' ? 'status-active' : 'status-inactive'
}

const getStatusIconClass = (status: string) => {
  return status === 'Активна' ? 'status-icon-active' : 'status-icon-inactive'
}
</script>

<template>
  <div class="table-container">
    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
        <tr>
          <th class="column-name">Наименование</th>
          <th class="column-status">Статус</th>
          <th class="column-server">Сервер</th>
          <th class="column-port">Порт</th>
          <th class="column-date">Дата создания</th>
          <th class="column-actions">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="item in tableData" :key="item.id" class="table-row">
          <td class="cell-name">
            <div class="name-content">
              <span class="status-icon" :class="getStatusIconClass(item.status)">●</span>
              {{ item.name }}
            </div>
          </td>
          <td class="cell-status">
              <span class="status-badge" :class="getStatusClass(item.status)">
                {{ item.status }}
              </span>
          </td>
          <td class="cell-server">{{ item.server }}</td>
          <td class="cell-port">{{ item.port }}</td>
          <td class="cell-date">{{ item.date }}</td>
          <td class="cell-actions">
            <CustomButton
              class="cell-actions--edit_btn"
              @click="emit('edit', item)"
            >
              Просмотр
            </CustomButton>
            <CustomButton
              class="cell-actions--delete_btn"
              @click="emit('delete', item.id)"
            >
              Удалить
            </CustomButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.table-container {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  min-width: 800px;
}

.custom-table th {
  background-color: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  font-size: 0.9rem;
}

.custom-table td {
  padding: 16px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.column-name {
  width: 25%;
}

.column-status {
  width: 15%;
}

.column-server {
  width: 20%;
}

.column-port {
  width: 10%;
}

.column-date {
  width: 20%;
}

.column-actions {
  width: 200px;
}

.cell-name .name-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cell-actions {
  display: flex;
  gap: 8px;
}

.status-icon {
  font-size: 1rem;
}

.status-icon-active {
  color: #27ae60;
}

.status-icon-inactive {
  color: #e74c3c;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 500;
}

.status-active {
  background-color: #d4edda;
  color: #155724;
}

.status-inactive {
  background-color: #f8d7da;
  color: #721c24;
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }

  .custom-table {
    min-width: 800px;
  }

  .cell-actions {
    flex-direction: column;
  }

  .cell-actions--edit_btn,
  .cell-actions--delete_btn {
    font-size: 0.75rem;
    padding: 4px 8px;
  }
}
</style>
