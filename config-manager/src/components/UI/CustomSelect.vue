<template>
  <div class="select-container">
    <label v-if="label" class="select-label">{{ label }}</label>
    <div
      class="select-wrapper"
      :class="{
        'select--open': isOpen,
        'select--disabled': disabled
      }"
    >
      <div
        class="select-trigger"
        @click="toggleDropdown"
        @blur="onBlur"
        tabindex="0"
      >
        <span class="select-value">
          {{ selectedOption?.label || placeholder }}
        </span>
        <svg
          class="select-arrow"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          :class="{ 'select-arrow--open': isOpen }"
        >
          <path
            d="M6 9L12 15L18 9"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>

      <transition name="dropdown">
        <div v-show="isOpen" class="select-dropdown">
          <div
            v-for="option in options"
            :key="option.value"
            class="select-option"
            :class="{
              'select-option--selected': isSelected(option),
              'select-option--disabled': option.disabled
            }"
            @click="selectOption(option)"
          >
            {{ option.label }}
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface SelectOption {
  value: string | number
  label: string
  disabled?: boolean
}

interface Props {
  modelValue?: string | number
  options: SelectOption[]
  label?: string
  placeholder?: string
  disabled?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string | number): void
  (e: 'change', value: string | number): void
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Выберите опцию...',
  disabled: false
})

const emit = defineEmits<Emits>()

const isOpen = ref(false)

const selectedOption = computed(() => {
  return props.options.find(option => option.value === props.modelValue)
})

const isSelected = (option: SelectOption) => {
  return option.value === props.modelValue
}

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const selectOption = (option: SelectOption) => {
  if (option.disabled) return

  emit('update:modelValue', option.value)
  emit('change', option.value)
  isOpen.value = false
}

const onBlur = () => {
  setTimeout(() => {
    isOpen.value = false
  }, 150)
}

// Закрытие dropdown при клике вне компонента
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.select-container')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.select-container {
  margin-bottom: 1rem;
  width: 80%;
  position: relative; /* Добавляем для правильного позиционирования */
}

.select-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: gray;
  font-size: 0.9rem;
}

.select-wrapper {
  position: relative;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  background: white;
  transition: all 0.3s ease;
}

.select-wrapper:focus-within {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
}

.select-wrapper.select--open {
  border-color: #3498db;
}

.select-wrapper.select--disabled {
  background-color: #f8f9fa;
  cursor: not-allowed;
  opacity: 0.6;
}

.select-trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  cursor: pointer;
  user-select: none;
}

.select-wrapper.select--disabled .select-trigger {
  cursor: not-allowed;
}

.select-value {
  color: #2c3e50;
  font-size: 1rem;
}

.select-arrow {
  color: #95a5a6;
  transition: transform 0.3s ease;
  flex-shrink: 0;
  margin-left: 8px;
}

.select-arrow--open {
  transform: rotate(180deg);
}

.select-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #dcdfe6;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
  margin-top: 4px;
}

.select-option {
  padding: 8px 10px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  color: #2c3e50;
  border-bottom: 1px solid #f8f9fa;
}

.select-option:last-child {
  border-bottom: none;
}

.select-option:hover {
  background-color: #f8f9fa;
}

.select-option--selected {
  background-color: #e3f2fd;
  color: #1976d2;
  font-weight: 500;
}

.select-option--disabled {
  color: #95a5a6;
  cursor: not-allowed;
  background-color: #f8f9fa;
}

.select-option--disabled:hover {
  background-color: #f8f9fa;
}

/* Анимации */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.3s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
