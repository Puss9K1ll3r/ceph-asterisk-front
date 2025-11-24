<template>
  <button
    :class="['switch', { 'switch--checked': modelValue }]"
    @click="$emit('update:modelValue', !modelValue)"
    type="button"
  >
    <span class="switch-thumb" />
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

defineProps<Props>();
defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>

<style scoped>
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  background-color: #d1d5db;
  border-radius: 12px;
  transition: background-color 0.2s;
  cursor: pointer;
  border: none;
}

.switch--checked {
  background-color: #3b82f6;
}

.switch-thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transition: transform 0.2s;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.switch--checked .switch-thumb {
  transform: translateX(20px);
}
</style>
