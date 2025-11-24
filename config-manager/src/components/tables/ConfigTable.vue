<template>
  <div class="config-section">
    <h3 class="section-title">{{ title }}</h3>
    <div class="table-wrapper">
      <table class="config-table">
        <thead>
        <tr>
          <th class="column-parameter">Параметр</th>
          <th class="column-name">Имя (name)</th>
          <th class="column-type">Тип</th>
          <th class="column-default">Значение по умолчанию</th>
          <th class="column-description">Описание</th>
          <th class="column-actions">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(param, index) in parameters"
          :key="index"
          class="table-row"
        >
          <td class="cell-parameter">{{ param.parameter }}</td>
          <td class="cell-name">
            <code class="name-code">{{ param.name }}</code>
          </td>
          <td class="cell-type">
            <span class="type-badge">{{ param.type }}</span>
          </td>
          <td class="cell-default">
              <span v-if="param.type === 'boolean'" class="boolean-value">
                {{ param.defaultValue ? '✅ true' : '❌ false' }}
              </span>
            <span v-else class="default-value">{{ param.defaultValue }}</span>
          </td>
          <td class="cell-description">{{ param.description }}</td>
          <td class="cell-actions">
            <div class="actions-wrapper">
              <button
                class="action-btn action-edit"
                @click="editParam(param)"
                title="Изменить параметр"
              >
                Изменить
              </button>
              <button
                class="action-btn action-save"
                @click="saveParam(param)"
                title="Сохранить параметр"
              >
                Сохранить
              </button>
            </div>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface ConfigParameter {
  parameter: string
  name: string
  type: string
  defaultValue: string | boolean
  description: string
}

interface Props {
  title: string
  parameters: ConfigParameter[]
}

interface Emits {
  (e: 'edit', param: ConfigParameter): void
  (e: 'save', param: ConfigParameter): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const editParam = (param: ConfigParameter) => {
  emit('edit', param)
}

const saveParam = (param: ConfigParameter) => {
  emit('save', param)
}
</script>

<style scoped>
.config-section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e9ecef;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.config-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 0.85rem;
  min-width: 900px;
}

.config-table th {
  background-color: #f8f9fa;
  padding: 14px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
}

.config-table td {
  padding: 12px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  white-space: nowrap;
}

.table-row:hover {
  background-color: #f8f9fa;
}

/* Ширины колонок */
.column-parameter {
  width: 18%;
  min-width: 160px;
}

.column-name {
  width: 12%;
  min-width: 120px;
}

.column-type {
  width: 10%;
  min-width: 100px;
}

.column-default {
  width: 12%;
  min-width: 120px;
}

.column-description {
  width: 35%;
  min-width: 250px;
  white-space: normal !important;
}

.column-actions {
  width: 13%;
  min-width: 140px;
}

/* Стили для ячеек */
.cell-parameter {
  font-weight: 500;
  color: #2c3e50;
}

.cell-name .name-code {
  background-color: #f8f9fa;
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.8rem;
  color: #e83e8c;
  border: 1px solid #e9ecef;
}

.cell-type .type-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
  font-family: 'Courier New', monospace;
}

.cell-default .default-value {
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: #28a745;
}

.cell-default .boolean-value {
  font-family: 'Courier New', monospace;
  font-weight: 500;
  color: #495057;
}

.cell-description {
  color: #6c757d;
  line-height: 1.4;
  white-space: normal;
}

.cell-actions {
  text-align: center;
}

.actions-wrapper {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.action-btn {
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-edit {
  background-color: #3498db;
  color: white;
}

.action-edit:hover {
  background-color: #2980b9;
}

.action-save {
  background-color: #28a745;
  color: white;
}

.action-save:hover {
  background-color: #218838;
}

/* Стили для скроллбара */
.table-wrapper::-webkit-scrollbar {
  height: 6px;
}

.table-wrapper::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.table-wrapper::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .config-section {
    margin-bottom: 1.5rem;
  }

  .section-title {
    font-size: 1.1rem;
  }

  .config-table th,
  .config-table td {
    padding: 10px 8px;
    font-size: 0.8rem;
  }

  .actions-wrapper {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    padding: 4px 8px;
    font-size: 0.7rem;
  }
}
</style>
