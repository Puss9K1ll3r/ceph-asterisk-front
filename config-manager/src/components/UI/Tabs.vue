<template>
  <div class="tabs">
    <div class="tabs-list">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        :class="['tabs-trigger', { 'tabs-trigger--active': modelValue === tab.value }]"
        @click="$emit('update:modelValue', tab.value)"
      >
        {{ tab.label }}
      </button>
    </div>
    <div class="tabs-content">
      <slot :name="modelValue"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Tab {
  value: string;
  label: string;
}

interface Props {
  modelValue: string;
  tabs: Tab[];
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: string];
}>();
</script>

<style scoped>
.tabs {
  width: 100%;
}

.tabs-list {
  display: flex;
  border-bottom: 1px solid #e2e8f0;
  margin-bottom: 1.5rem;
}

.tabs-trigger {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  color: #64748b;
  font-weight: 500;
}

.tabs-trigger--active {
  border-bottom-color: #3b82f6;
  color: #3b82f6;
}

.tabs-trigger:hover {
  color: #374151;
}

.tabs-content {
  width: 100%;
}
</style>
