<template>
  <div class="stores-container">
    <!-- <CreateStore /> -->
    <div class="head">
      <h2>Do‘konlar</h2>
      <button @click="showCreateModal = true">+</button>
    </div>
    <!-- CreateStore modal -->
    <CreateStore
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @store-created="handleStoreCreated"
    />

    <div v-for="s in stores" :key="s._id" class="store-card">
      <div class="store-info">
        <p>
          <b>{{ s.name }}</b>
        </p>
        <p>{{ s.address }}</p>
      </div>

      <div class="store-actions">
        <button class="view-btn" @click="router.push(`/store/${s._id}`)">
          Ko‘rish
        </button>
        <button class="delete-btn" @click="remove(s._id)">O‘chirish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getStores, deleteStore, postStore } from "../../api/store";
import { useRouter } from "vue-router";
const showCreateModal = ref(false);
import CreateStore from "./CreateStore.vue";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const stores = ref([]);

const fetchStores = async () => {
  const res = await getStores();
  stores.value = res.data.stores;
};

onMounted(fetchStores);

const handleStoreCreated = async () => {
  await fetchStores();
  showCreateModal.value = false;
};

const remove = async (id) => {
  try {
    if (!confirm("O‘chirmoqchimisiz?")) return;
    await deleteStore(id);
    stores.value = stores.value.filter((s) => s._id !== id);
    toast.success("Do'kon muvaffaqiyatli o'chirildi");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
</script>

<style scoped>
.head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.head button {
  width: 50px;
  height: 36px;
  border-radius: 6px;
  font-size: 24px;
  font-weight: bold;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  cursor: pointer;
}
.stores-container {
  max-width: 900px;
  margin: 50px auto 20px;
}
h3 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
.store-card {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  padding: 15px 20px;
  margin-bottom: 15px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
/* .store-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
} */
.store-info p {
  margin: 5px 0;
  color: #444;
}
.store-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}
.store-actions button {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;
}
.view-btn {
  background-color: #4a90e2;
  color: #fff;
}
/* .view-btn:hover {
  background-color: #357ab8;
} */
.delete-btn {
  background-color: #e74c3c;
  color: #fff;
}
/* .delete-btn:hover {
  background-color: #c0392b;
} */
/* Mobil uchun moslashuv */
@media (max-width: 600px) {
  .store-card {
    padding: 15px;
  }
  .store-actions {
    flex-direction: column;
  }
  .store-actions button {
    width: 100%;
  }
}
</style>
