<template>
  <div class="audio-table-container">
    <div class="table-wrapper">
      <table class="audio-table">
        <thead>
        <tr>
          <th class="column-name">Название файла</th>
          <th class="column-format">Формат</th>
          <th class="column-size">Размер</th>
          <th class="column-duration">Длительность</th>
          <th class="column-usage">Использование</th>
          <th class="column-vats">ВАТС</th>
          <th class="column-date">Дата загрузки</th>
          <th class="column-actions">Действия</th>
        </tr>
        </thead>
        <tbody>
        <tr
          v-for="(file, index) in audioFiles"
          :key="index"
          class="table-row"
        >
          <td class="cell-name">
            <div class="file-name">
              <span class="file-icon">🎵</span>
              {{ file.name }}
            </div>
          </td>
          <td class="cell-format">{{ file.format }}</td>
          <td class="cell-size">{{ file.size }}</td>
          <td class="cell-duration">{{ file.duration }}</td>
          <td class="cell-usage">
            <span class="usage-badge">{{ file.usage }}</span>
          </td>
          <td class="cell-vats">{{ file.vats }}</td>
          <td class="cell-date">{{ file.uploadDate }}</td>
          <td class="cell-actions">
            <div class="actions-wrapper">
              <button
                class="action-btn action-play"
                @click="playFile(file)"
                :title="`Прослушать ${file.name}`"
              >
                Прослушать
              </button>
              <button
                class="action-btn action-delete"
                @click="deleteFile(file)"
                :title="`Удалить ${file.name}`"
              >
                Удалить
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
interface AudioFile {
  name: string
  format: string
  size: string
  duration: string
  usage: string
  vats: string
  uploadDate: string
}

interface Props {
  audioFiles: AudioFile[]
}

interface Emits {
  (e: 'play', file: AudioFile): void
  (e: 'delete', file: AudioFile): void
}
defineProps<Props>()
const emit = defineEmits<Emits>()

const playFile = (file: AudioFile) => {
  emit('play', file)
}

const deleteFile = (file: AudioFile) => {
  emit('delete', file)
}
</script>

<style scoped>
.audio-table-container {
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

.audio-table {
  width: 100%;
  border-collapse: collapse;
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  min-width: 1000px;
}

.audio-table th {
  background-color: #f8f9fa;
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: #2c3e50;
  border-bottom: 2px solid #e9ecef;
  white-space: nowrap;
}

.audio-table td {
  padding: 14px 12px;
  border-bottom: 1px solid #e9ecef;
  color: #495057;
  white-space: nowrap;
}

.table-row:hover {
  background-color: #f8f9fa;
}

/* Ширины колонок */
.column-name {
  width: 18%;
  min-width: 180px;
}

.column-format {
  width: 15%;
  min-width: 150px;
}

.column-size {
  width: 10%;
  min-width: 100px;
}

.column-duration {
  width: 8%;
  min-width: 80px;
}

.column-usage {
  width: 12%;
  min-width: 120px;
}

.column-vats {
  width: 12%;
  min-width: 120px;
}

.column-date {
  width: 15%;
  min-width: 140px;
}

.column-actions {
  width: 10%;
  min-width: 160px;
}

/* Стили для ячеек */
.cell-name .file-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;
  color: #2c3e50;
}

.file-icon {
  font-size: 1rem;
}

.cell-format {
  color: #6c757d;
  font-family: 'Courier New', monospace;
  font-size: 0.85rem;
}

.cell-size {
  text-align: right;
  font-weight: 500;
  color: #495057;
}

.cell-duration {
  text-align: center;
  font-weight: 500;
  color: #495057;
}

.usage-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.cell-vats {
  color: #6c757d;
}

.cell-date {
  color: #6c757d;
  font-size: 0.85rem;
}

.cell-actions {
  text-align: center;
}

.actions-wrapper {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-play {
  background-color: #3498db;
  color: white;
}

.action-play:hover {
  background-color: #2980b9;
}

.action-delete {
  background-color: #e74c3c;
  color: white;
}

.action-delete:hover {
  background-color: #c0392b;
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
  .audio-table-container {
    border-radius: 0;
    margin: 0 -0.5rem;
  }

  .audio-table th,
  .audio-table td {
    padding: 12px 8px;
    font-size: 0.8rem;
  }

  .actions-wrapper {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    padding: 4px 8px;
    font-size: 0.75rem;
  }
}
</style>
