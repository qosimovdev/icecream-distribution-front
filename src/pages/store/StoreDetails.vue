<template>
  <div class="store-details">
    <h2>Do‘kon tafsilotlari</h2>

    <p v-if="loading">Yuklanmoqda...</p>
    <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

    <div v-if="store" class="details-card">
      <h3>{{ store.name }}</h3>
      <p><b>Manzil:</b> {{ store.address }}</p>
      <p><b>Telefon:</b> {{ store.phone || "Yo‘q" }}</p>
      <!-- <p><b>Qo‘shimcha ma’lumot:</b> {{ store.description || "Yo‘q" }}</p> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { getStoreById } from "../../api/store"; // API funksiyani yozing

const route = useRoute();
const storeId = route.params.id;

const store = ref(null);
const loading = ref(true);
const errorMsg = ref("");

onMounted(async () => {
  try {
    const res = await getStoreById(storeId);
    store.value = res.data.store;
  } catch (error) {
    errorMsg.value =
      error.response?.data?.message || "Server bilan bog‘lanib bo‘lmadi";
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.store-details {
  max-width: 800px;
  margin: 80px auto 20px; /* header balandligi uchun 80px margin-top */
  padding: 0 20px;
}

.error {
  color: #e74c3c;
  margin-bottom: 15px;
}

.details-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}

.details-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.details-card h3 {
  margin-bottom: 15px;
  color: #4a90e2;
}

.details-card p {
  margin: 6px 0;
  color: #333;
}

/* Mobil moslashuv */
@media (max-width: 600px) {
  .details-card {
    padding: 15px;
  }
}
</style>
