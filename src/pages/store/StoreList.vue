<template>
  <div class="stores-container">
    <div class="head">
      <h2>Do'konlar</h2>
      <button @click="showCreateModal = true">+</button>
    </div>
    <!-- CreateStore modal -->
    <CreateStore
      v-if="showCreateModal"
      @close="showCreateModal = false"
      @store-created="handleStoreCreated"
    />
    <p v-else-if="stores.length === 0" class="empty">Yuklanmoqda...</p>

    <div v-for="s in stores" :key="s._id" class="store-card">
      <div class="store-info">
        <p>
          <b>{{ s.name }}</b>
        </p>
        <p>{{ s.address }}</p>
      </div>

      <div class="store-actions">
        <button class="view-btn" @click="router.push(`/store/${s._id}`)">
          Ko'rish
        </button>
        <button class="delete-btn" @click="remove(s._id)">O'chirish</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { getStores, deleteStore } from "../../api/store";
import { getErrorMessage } from "../../utils/errorHandler";
import { useRouter } from "vue-router";
import { useToast } from "vue-toastification";
import CreateStore from "./CreateStore.vue";
const showCreateModal = ref(false);
const router = useRouter();
const toast = useToast();
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
    if (!confirm("O'chirmoqchimisiz?")) return;
    await deleteStore(id);
    stores.value = stores.value.filter((s) => s._id !== id);
    toast.success("Do'kon muvaffaqiyatli o'chirildi");
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
</script>
