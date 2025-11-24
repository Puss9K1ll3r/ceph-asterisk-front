<template>
  <div class="logs-table-container">
    <div class="table-wrapper">
      <table class="logs-table">
        <tbody>
        <tr
          v-for="(log, index) in logsData"
          :key="index"
          class="log-row"
        >
          <td class="log-timestamp">{{ log.timestamp }}</td>
          <td class="log-level">
              <span class="level-badge" :class="getLevelClass(log.level)">
                {{ log.level }}
              </span>
          </td>
          <td class="log-message">{{ log.message }}</td>
        </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
interface LogEntry {
  timestamp: string
  level: string
  message: string
}

interface Props {
  logsData: LogEntry[]
}
defineProps<Props>();
const getLevelClass = (level: string): string => {
  const levelClasses: { [key: string]: string } = {
    'TUFO': 'level-tufo',
    'WARN': 'level-warn',
    'ERROR': 'level-error',
    'DEBUG': 'level-debug'
  }
  return levelClasses[level] || 'level-default'
}
</script>

<style scoped>
.logs-table-container {
  width: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  font-family: 'Courier New', monospace;
}

.table-wrapper {
  width: 100%;
  overflow-x: auto;
}

.logs-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
  min-width: 600px;
}

.log-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.log-row:hover {
  background-color: #f8f9fa;
}

.log-row:last-child {
  border-bottom: none;
}

.log-timestamp {
  padding: 12px 16px;
  color: #6c757d;
  white-space: nowrap;
  width: 120px;
  border-right: 1px solid #f0f0f0;
  font-weight: 500;
}

.log-level {
  padding: 12px 16px;
  white-space: nowrap;
  width: 80px;
  border-right: 1px solid #f0f0f0;
}

.log-message {
  padding: 12px 16px;
  color: #2c3e50;
  word-break: break-word;
}

.level-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
  min-width: 50px;
  text-align: center;
}

.level-tufo {
  background-color: #e3f2fd;
  color: #1976d2;
  border: 1px solid #bbdefb;
}

.level-warn {
  background-color: #fff3e0;
  color: #f57c00;
  border: 1px solid #ffe0b2;
}

.level-error {
  background-color: #ffebee;
  color: #d32f2f;
  border: 1px solid #ffcdd2;
}

.level-debug {
  background-color: #f5f5f5;
  color: #616161;
  border: 1px solid #e0e0e0;
}

.level-default {
  background-color: #f5f5f5;
  color: #616161;
  border: 1px solid #e0e0e0;
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
  .logs-table-container {
    border-radius: 0;
    margin: 0 -0.5rem;
  }

  .log-timestamp,
  .log-level,
  .log-message {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .level-badge {
    font-size: 0.7rem;
    min-width: 45px;
  }
}
</style>
