<template>
  <div class="input-container">
    <label v-if="label" class="input-label">{{ label }}</label>
    <div class="input-wrapper">
      <div v-if="withIcon" class="icon-wrapper">
        <slot name="icon">
          <svg
            class="search-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </div>
      <input
        :type="type"
        :placeholder="placeholder"
        :value="stringValue"
        @input="handleInput"
        class="input-field"
        :class="{ 'with-icon': withIcon }"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  modelValue: string | number
  label?: string
  placeholder?: string
  type?: string
  disabled?: boolean
  withIcon?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  withIcon: true
})

const emit = defineEmits<Emits>()

// Преобразуем значение в строку для отображения в input
const stringValue = computed(() => {
  return String(props.modelValue)
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  const value = target.value
  
  // Для number полей преобразуем обратно в число
  if (props.type === 'number') {
    const numValue = value === '' ? 0 : Number(value)
    emit('update:modelValue', isNaN(numValue) ? 0 : numValue)
  } else {
    emit('update:modelValue', value)
  }
}
</script>

<style scoped>
.input-container {
  margin-bottom: 1rem;
  width: 80%;
}

.input-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: gray;
  font-size: 0.9rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  transition: all 0.3s ease;
  overflow: hidden;
}

.input-wrapper:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.input-wrapper:disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  color: #95a5a6;
}

.search-icon {
  flex-shrink: 0;
}

.input-field {
  flex: 1;
  border: none;
  outline: none;
  padding: 12px;
  font-size: 1rem;
  color: #2c3e50;
  background: transparent;
}

.input-field.with-icon {
  padding-left: 0;
}

.input-field:disabled {
  cursor: not-allowed;
}

.input-field::placeholder {
  color: #95a5a6;
  font-size: 0.9rem;
}

.input-field::-webkit-outer-spin-button,
.input-field::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.input-field[type='number'] {
  -moz-appearance: textfield;
}
</style>
