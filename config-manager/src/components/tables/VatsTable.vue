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
          <th class="column-date">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in tableData" :key="index" class="table-row">
          <td class="cell-name">
            <div class="name-content">
              <span class="status-icon">○</span>
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
            <CustomButton>Просмотр</CustomButton>
            <CustomButton>Удалить</CustomButton>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VatsTableItem } from '@/types/vats'
import CustomButton from '@/components/UI/CustomButton.vue'

interface Props {
  tableData: VatsTableItem[]
}

defineProps<Props>()

const getStatusClass = (status: string) => {
  return status === 'Активно' ? 'status-active' : 'status-inactive'
}
</script>

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
  width: 30%;
}

.cell-name .name-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cell-actions {
  display: flex;
  gap: 5px;
}

.status-icon {
  color: #6c757d;
  font-size: 1.2rem;
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

.cell-server {
  font-family: 'Courier New', monospace;
  color: #495057;
}

.cell-port {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #2c3e50;
}

.cell-date {
  color: #6c757d;
}

@media (max-width: 768px) {
  .table-container {
    overflow-x: auto;
  }

  .custom-table {
    min-width: 800px;
  }
}
</style>
