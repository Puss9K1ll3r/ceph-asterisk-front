<template>
  <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <!-- Шаг 1: Ввод названия -->
      <div v-if="currentStep === 1" class="modal-step">
        <h2 class="modal-title">Создание новой ВАТС</h2>
        <p class="modal-subtitle">Шаг 1: Введите наименование ВАТС</p>

        <div class="form-group">
          <CustomInput
            v-model="formData.name"
            label="Наименование ВАТС"
            placeholder="Например: Головной офис"
            :with-icon="false"
            :disabled="isLoading"
          />
        </div>

        <div class="modal-actions">
          <CustomButton
            variant="outline"
            @click="closeModal"
            :disabled="isLoading"
            class="cancel-btn"
          >
            Отмена
          </CustomButton>
          <CustomButton
            @click="nextStep"
            :disabled="!formData.name.trim() || isLoading"
            class="next-btn"
          >
            <span v-if="isLoading" class="button-loading">
              <span class="spinner"></span>
              Загрузка...
            </span>
            <span v-else>Далее</span>
          </CustomButton>
        </div>
      </div>

      <!-- Шаг 2: Базовая настройка -->
      <div v-if="currentStep === 2" class="modal-step">
        <h2 class="modal-title">Создание новой ВАТС</h2>
        <p class="modal-subtitle">Шаг 2: Базовая настройка</p>

        <div class="success-message">
          ВАТС "{{ formData.name }}" успешно инициализирована
        </div>

        <div class="form-group">
          <CustomInput
            v-model="formData.sipPort"
            label="SIP-порт для внутренней связи"
            type="number"
            :with-icon="false"
            :disabled="isLoading"
          />
          <CustomInput
            v-model="formData.server"
            label="Имя сервера"
            type="text"
            :with-icon="false"
            :disabled="isLoading"
          />
        </div>

        <div class="form-group">
          <CustomSelect
            v-model="formData.transportType"
            label="Тип транспорта"
            :options="transportOptions"
            :disabled="isLoading"
          />
        </div>

        <div class="modal-actions">
          <CustomButton
            variant="outline"
            @click="prevStep"
            :disabled="isLoading"
            class="back-btn"
          >
            Назад
          </CustomButton>
          <CustomButton
            variant="outline"
            @click="closeModal"
            :disabled="isLoading"
            class="cancel-btn"
          >
            Отмена
          </CustomButton>
          <CustomButton
            @click="finishCreation"
            :disabled="isLoading"
            class="finish-btn"
          >
            <span v-if="isLoading" class="button-loading">
              <span class="spinner"></span>
              Создание...
            </span>
            <span v-else>Завершить создание</span>
          </CustomButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import CustomInput from "@/components/UI/CustomInput.vue"
import CustomSelect from "@/components/UI/CustomSelect.vue"
import CustomButton from "@/components/UI/CustomButton.vue"
import type { VatsFormData } from '@/types/vats'

interface Props {
  show: boolean
}

interface Emits {
  (e: 'close'): void
  (e: 'created', vatsData: VatsFormData): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// Состояние модального окна
const currentStep = ref(1)
const isLoading = ref(false)

// Данные формы
const formData = reactive<VatsFormData>({
  name: '',
  sipPort: '5060',
  server: 'asterisk-01',
  transportType: 'UDP'
})

// Опции для типа транспорта
const transportOptions = [
  { value: 'UDP', label: 'UDP' },
  { value: 'TCP', label: 'TCP' },
  { value: 'TLS', label: 'TLS' }
]

// Сброс формы при открытии/закрытии модального окна
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm()
  }
})

const resetForm = () => {
  currentStep.value = 1
  formData.name = ''
  formData.sipPort = '5060'
  formData.transportType = 'UDP'
  isLoading.value = false
}

const closeModal = () => {
  emit('close')
}

const handleOverlayClick = () => {
  if (!isLoading.value) {
    closeModal()
  }
}

const nextStep = async () => {
  if (!formData.name.trim()) return

  isLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    currentStep.value = 2
  } catch (error) {
    console.error('Ошибка при инициализации ВАТС:', error)
  } finally {
    isLoading.value = false
  }
}

const prevStep = () => {
  currentStep.value = 1
}

const finishCreation = async () => {
  isLoading.value = true
  try {
    // Имитация создания ВАТС
    await new Promise(resolve => setTimeout(resolve, 1500))

    emit('created', { ...formData })
    closeModal()
  } catch (error) {
    console.error('Ошибка при создании ВАТС:', error)
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
/* Стили остаются такими же как в предыдущей версии */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 12px;
  padding: 1rem;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.modal-step {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.modal-subtitle {
  font-size: 1rem;
  color: #6c757d;
  margin: 0;
}

.success-message {
  width: 80%;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
  border-radius: 6px;
  font-weight: 500;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  flex-wrap: wrap;
}

.cancel-btn {
  background-color: transparent;
  border: 1px solid #dcdfe6;
  color: #606266;
}

.cancel-btn:hover:not(:disabled) {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.next-btn,
.finish-btn {
  background-color: #3498db;
  color: white;
}

.next-btn:hover:not(:disabled),
.finish-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.back-btn {
  background-color: transparent;
  border: 1px solid #dcdfe6;
  color: #606266;
  margin-right: auto;
}

.back-btn:hover:not(:disabled) {
  background-color: #f5f7fa;
  border-color: #c0c4cc;
}

.button-loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  border: 2px solid transparent;
  border-top: 2px solid currentColor;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

:deep(.input-wrapper:disabled),
:deep(.select-wrapper:disabled) {
  opacity: 0.6;
  cursor: not-allowed;
}

:deep(.input-field:disabled),
:deep(.select-trigger:disabled) {
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .modal-content {
    padding: 1.5rem;
    margin: 1rem;
    width: calc(100% - 2rem);
  }

  .modal-actions {
    flex-direction: column;
  }

  .back-btn {
    margin-right: 0;
    order: 1;
  }

  .cancel-btn {
    order: 2;
  }

  .next-btn,
  .finish-btn {
    order: 3;
  }
}
</style>
