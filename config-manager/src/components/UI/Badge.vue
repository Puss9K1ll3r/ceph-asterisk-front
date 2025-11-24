<template>
  <span :class="['badge', `badge--${variant}`]">
    <slot />
  </span>
</template>

<script setup lang="ts">
interface Props {
  variant?: 'default' | 'secondary' | 'outline';
}

withDefaults(defineProps<Props>(), {
  variant: 'default'
});
</script>

<style scoped>
.badge {
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.75rem;
  font-weight: 500;
  line-height: 1;
}

.badge--default {
  background-color: #3b82f6;
  color: white;
}

.badge--secondary {
  background-color: #6b7280;
  color: white;
}

.badge--outline {
  background-color: transparent;
  color: #374151;
  border: 1px solid #d1d5db;
}
</style>
