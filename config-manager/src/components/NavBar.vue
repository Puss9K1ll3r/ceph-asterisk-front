<template>
  <nav class="navbar">
    <div class="navbar-header">
      <div class="navbar-header-icon">
        <img class="asterisk-icon" src="../assets/dns_icon.svg" alt="icon">
      </div>
      <div class="navbar-titles">
        <h1 class="navbar-title">Asterisk BATC</h1>
        <div class="navbar-subtitle">Управление</div>
      </div>
    </div>

    <ul class="navbar-menu">
      <li
        v-for="item in menuItems"
        :key="item.id"
        class="navbar-item"
        :class="{ 'navbar-item--active': isActive(item.route) }"
        @click="navigateTo(item.route)"
      >
        <span class="navbar-item__main">{{ item.main }}</span>
        <span v-if="item.sub" class="navbar-item__sub">{{ item.sub }}</span>
      </li>
    </ul>

    <div class="navbar-footer">
      <div class="navbar-admin">
        <span class="navbar-admin__label">Администратор</span>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

interface MenuItem {
  id: string
  main: string
  sub: string
  route: string
}

const router = useRouter()
const route = useRoute()

const menuItems: MenuItem[] = [
  { id: 'vats', main: 'BATC', sub: '', route: '/' },
  { id: 'cdr', main: 'Детализация', sub: '(CDR)', route: '/details' },
  { id: 'logs', main: 'Логи', sub: '', route: '/logs' },
  { id: 'audio', main: 'Аудиофайлы', sub: '', route: '/audio' },
  //{ id: 'constructor', main: 'Конструктор', sub: '', route: '/constructor' },
]

const isActive = (menuRoute: string): boolean => {
  return route.path === menuRoute
}

const navigateTo = (routePath: string): void => {
  router.push(routePath)
}
</script>

<style scoped>
.navbar {
  height: 100vh;
  min-width: 23vw;
  background-color: var(--color-background-soft);
  color: var(--color-text);
  display: flex;
  flex-direction: column;
  font-family: Arial, sans-serif;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);

  /* Стили для липкой позиции */
  position: sticky;
  top: 0;
  left: 0;
  align-self: flex-start;
  overflow-y: auto; /* Добавляем скролл если контент не помещается */
}

.navbar-header {
  display: flex;
  border-bottom: 1px solid var(--vt-c-indigo);
  position: sticky;
  top: 0;
  background-color: var(--color-background-soft);
  z-index: 10;
  flex-shrink: 0; /* Запрещаем сжатие хедера */
}

.asterisk-icon {
  margin: 0.7rem;
  width: 3vw;
  flex-shrink: 0; /* Запрещаем сжатие иконки */
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-heading);
  display: flex;
  align-items: center;
  gap: 8px;
}

.navbar-subtitle {
  font-size: 0.9rem;
  color: var(--color-text);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.navbar-menu {
  list-style: none;
  padding: 0;
  margin: 0;
  flex: 1;
  overflow-y: auto; /* Добавляем скролл для меню если нужно */
}

.navbar-item {
  padding: 15px 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  border-left: 4px solid transparent;
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex-shrink: 0; /* Запрещаем сжатие пунктов меню */
}

.navbar-item:hover {
  background-color: var(--vt-c-indigo);
}

.navbar-item--active {
  background-color: #3498db;
  border-left-color: #2980b9;
}

.navbar-item__main {
  font-size: 1rem;
  font-weight: 500;
}

.navbar-item__sub {
  font-size: 0.85rem;
  color: #ecf0f1;
  opacity: 0.8;
}

.navbar-footer {
  padding: 20px;
  border-top: 1px solid var(--vt-c-indigo);
  position: sticky;
  bottom: 0;
  background-color: var(--color-background-soft);
  z-index: 10;
  flex-shrink: 0; /* Запрещаем сжатие футера */
}

.navbar-admin {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.navbar-admin__label {
  font-size: 0.9rem;
  font-weight: 500;
}

/* Стили для скроллбара */
.navbar::-webkit-scrollbar,
.navbar-menu::-webkit-scrollbar {
  width: 4px;
}

.navbar::-webkit-scrollbar-track,
.navbar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.navbar::-webkit-scrollbar-thumb,
.navbar-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.navbar::-webkit-scrollbar-thumb:hover,
.navbar-menu::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Адаптивность */
@media (max-width: 768px) {
  .navbar {
    min-width: 280px; /* Фиксированная минимальная ширина на мобильных */
    position: fixed; /* На мобильных можно сделать фиксированным */
    z-index: 1000;
  }
}
</style>
