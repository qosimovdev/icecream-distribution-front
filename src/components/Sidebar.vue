<template>
  <aside :class="{ open: open }">
    <nav>
      <ul>
        <li><router-link to="/">Dashboard</router-link></li>
        <li><router-link to="/products">Mahsulotlar</router-link></li>
        <li><router-link to="/distribution">Tarqatish</router-link></li>
        <li><router-link to="/debts">Qarzlar</router-link></li>
        <li><router-link to="/reports">Hisobotlar</router-link></li>
        <li><router-link to="/stores">Do'konlar</router-link></li>
      </ul>
    </nav>
  </aside>
</template>

<script setup>
defineProps({
  open: Boolean,
});
</script>

<style scoped>
aside {
  width: 220px;
  height: 100vh;
  background-color: #34495e;
  color: #fff;
  position: fixed;
  top: 0;
  left: 0;
  transform: translateX(-100%);
  transition: transform 0.3s;
  z-index: 1000;
}
aside nav ul {
  list-style: none;
  padding: 0;
  margin: 80px 20px 0 20px;
}
aside nav li {
  margin-bottom: 20px;
}
aside nav li a {
  color: #fff;
  text-decoration: none;
  font-weight: 500;
  font-size: 18px;
}
aside nav li a.router-link-active {
  color: #4a90e2;
}
aside.open {
  transform: translateX(0);
}

@media (min-width: 769px) {
  aside {
    transform: translateX(0);
  }
}
</style>
