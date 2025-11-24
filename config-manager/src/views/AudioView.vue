<script setup lang="ts">
import { ref } from 'vue'
import CustomButton from "@/components/UI/CustomButton.vue"
import PageHeader from '@/components/UI/PageHeader.vue'
import AudioFilesTable from '@/components/tables/AudioFilesTable.vue'

const audioFiles = ref([
  {
    name: 'welcome_greeting.wav',
    format: 'WAV (16-bit PCM, 8kHz)',
    size: '239.3 KB',
    duration: '15s',
    usage: 'IVR',
    vats: 'Головной офис',
    uploadDate: '20.10.2025, 10:00'
  },
  {
    name: 'hold_music.gsm',
    format: 'GSM',
    size: '175.8 KB',
    duration: '120s',
    usage: 'МОН',
    vats: 'Головной офис',
    uploadDate: '21.10.2025, 14:30'
  },
  {
    name: 'ivr_menu.wav',
    format: 'WAV (16-bit PCM, 8kHz)',
    size: '312.5 KB',
    duration: '20s',
    usage: 'IVR',
    vats: 'Филиал Москва',
    uploadDate: '22.10.2025, 09:15'
  },
  {
    name: 'voicemail_intro.wav',
    format: 'WAV (16-bit PCM, 8kHz)',
    size: '125.0 KB',
    duration: '8s',
    usage: 'Голосовая почта',
    vats: 'Головной офис',
    uploadDate: '23.10.2025, 11:00'
  }
])

const handleUploadFile = () => {
  console.log('Загрузка нового файла')
}

const handlePlayFile = (file: any) => {
  console.log('Прослушивание файла:', file.name)
  // Логика проигрывания файла
  // Например, открытие аудиоплеера или воспроизведение через Web Audio API
}

const handleDeleteFile = (file: any) => {
  console.log('Удаление файла:', file.name)
  if (confirm(`Вы уверены, что хотите удалить файл "${file.name}"?`)) {
    audioFiles.value = audioFiles.value.filter(f => f.name !== file.name)
  }
}
</script>

<template>
  <div class="wrapper">
    <PageHeader
      title="Библиотека аудиофайлов"
      subtitle="Все ВАТС"
    >
      <template #actions>
        <CustomButton @click="handleUploadFile">+ Загрузить файл</CustomButton>
      </template>
    </PageHeader>

    <main class="content">
      <AudioFilesTable
        :audio-files="audioFiles"
        @play="handlePlayFile"
        @delete="handleDeleteFile"
      />
    </main>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.content {
  background: white;
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Адаптивность */
@media (max-width: 768px) {
  .wrapper {
    padding: 0 0.5rem;
  }

  .content {
    padding: 0.5rem;
    border-radius: 0;
    margin: 0 -0.5rem;
  }
}
</style>
