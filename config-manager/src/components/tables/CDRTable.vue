<template>
  <div class="cdr-table-container">
    <div class="table-wrapper">
      <table class="cdr-table">
        <thead>
        <tr>
          <th class="column-date">Дата и время</th>
          <th class="column-from">От</th>
          <th class="column-to">Кому</th>
          <th class="column-duration">Длительность</th>
          <th class="column-status">Статус</th>
          <th class="column-vats">ВАТС</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(call, index) in callsData"
          :key="index"
          class="table-row"
        >
          <td class="cell-date">{{ call.dateTime }}</td>
          <td class="cell-from">{{ call.from }}</td>
          <td class="cell-to">{{ call.to }}</td>
          <td class="cell-duration">{{ call.duration }}</td>
          <td class="cell-status">
              <span class="status-badge" :class="getStatusClass(call.status)">
                {{ call.status }}
              </span>
          </td>
          <td class="cell-vats">{{ call.vats }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CallRecord } from '@/types/cdr'

interface Props {
  callsData: CallRecord[]
}

defineProps<Props>()

const getStatusClass = (status: string): string => {
  const statusClasses: { [key: string]: string } = {
    'Отвечен': 'status-success',
    'Не отвечен': 'status-warning',
    'Занято': 'status-error',
    'Неуспешный': 'status-error'
  }
  return statusClasses[status] || 'status-default'
}
</script>

<style scoped>
.cdr-table-container {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.cdr-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  min-width: 800px;
}

.cdr-table th {
  background-color: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
}

.cdr-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  white-space: nowrap;
}

.table-row:hover {
  background-color: #f8f9fa;
}

/* Ширины колонок */
.column-date {
  width: 15%;
  min-width: 140px;
}

.column-from {
  width: 15%;
  min-width: 120px;
}

.column-to {
  width: 15%;
  min-width: 120px;
}

.column-duration {
  width: 10%;
  min-width: 80px;
}

.column-status {
  width: 15%;
  min-width: 120px;
}

.column-vats {
  width: 20%;
  min-width: 150px;
}

/* Стили для ячеек */
.cell-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.cell-from,
.cell-to {
  font-weight: 500;
  color: #2c3e50;
}

.cell-duration {
  text-align: center;
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #495057;
}

.cell-status {
  text-align: center;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  min-width: 80px;
}

.status-success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.status-warning {
  background-color: #fff3cd;
  color: #856404;
  border: 1px solid #ffeaa7;
}

.status-error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.status-default {
  background-color: #e2e3e5;
  color: #383d41;
  border: 1px solid #d6d8db;
}

.cell-vats {
  color: #6c757d;
  font-size: 0.85rem;
}

/* Стили для скроллбара */
.table-wrapper::-webkit-scrollbar {
  height: 8px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 4px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .cdr-table-container {
    border-radius: 0;
    margin: 0 -0.5rem;
  }

  .cdr-table th,
  .cdr-table td {
    padding: 12px 8px;
    font-size: 0.8rem;
  }
}
</style>
