<template>
  <div class="store-details">
    <h2>Do‘kon tafsilotlari</h2>
    <p v-if="loading">Yuklanmoqda...</p>
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
import { getStoreById } from "../../api/store";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "vue-toastification";

const toast = useToast();
const route = useRoute();
const storeId = route.params.id;

const store = ref(null);
const loading = ref(true);
const errorMsg = ref("");
const successMsg = ref("");

onMounted(async () => {
  errorMsg.value = "";
  successMsg.value = "";
  try {
    const res = await getStoreById(storeId);
    store.value = res.data.data;
    toast.success("Ma'lumot muvaffaqiyatli yuklandi");
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.store-details {
  max-width: 800px;
  margin: 50px auto 20px;
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
  /* margin-bottom: 15px; */
  color: #4a90e2;
}

.details-card p {
  margin: 6px 0;
  color: #333;
}

@media (max-width: 600px) {
  .details-card {
    padding: 1px 10px 15px 15px;
    /* padding: 10px; */
  }
}
</style>
