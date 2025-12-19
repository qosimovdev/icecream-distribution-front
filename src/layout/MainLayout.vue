<template>
  <Header @toggleSidebar="isSidebarOpen = !isSidebarOpen" />
  <Sidebar :open="isSidebarOpen" />
  <main :class="{ shifted: isSidebarOpen }">
    <router-view />
  </main>
</template>

<script setup>
import { ref } from "vue";
import Header from "../components/Header.vue";
import Sidebar from "../components/Sidebar.vue";

const isSidebarOpen = ref(false);
</script>

<style scoped>
main {
  margin-left: 220px; /* desktop sidebar width */
  padding: 20px;
  transition: margin-left 0.3s;
}

main.shifted {
  margin-left: 0; /* sidebar yopilganda */
}

@media (max-width: 768px) {
  main {
    margin-left: 0;
  }
}
</style>
