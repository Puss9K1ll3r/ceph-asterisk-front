<template>
  <button class="custom-button">
    <slot></slot>
  </button>
</template>

<style scoped>
.custom-button {
  font-family: Arial, sans-serif;
  font-size: 0.9rem;
  color: var(--color-text);
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 0.7rem;
  margin-top: 1rem;
}

.custom-button:hover {
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.3);
}
</style>
