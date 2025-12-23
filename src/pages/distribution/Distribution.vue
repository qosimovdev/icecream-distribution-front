<template>
  <section class="distribution">
    <h2>Mahsulotlarni taqsimlash</h2>

    <!-- Do'kon select -->
    <div class="stores">
      <label for="store">Do'konni tanlang: </label>
      <select class="select" v-model="selectedStore">
        <option disabled value="">Do'kon tanlang</option>
        <option v-for="store in stores" :key="store._id" :value="store._id">
          {{ store.name }}
        </option>
      </select>
    </div>

    <!-- Productlar ro'yxati -->
    <div v-for="p in products" :key="p._id" class="product-item">
      <input
        type="checkbox"
        :checked="isSelected(p._id)"
        @change="toggleProduct(p)"
      />
      <span class="name"
        >{{ p.name }}
        <span class="price"
          >({{ p.price.toLocaleString("en-US") }} so'm)</span
        ></span
      >

      <!-- Quantity -->
      <div v-if="isSelected(p._id)" class="qty">
        <button @click="decrease(p._id)">−</button>
        <span>{{ getQuantity(p._id) }}</span>
        <button @click="increase(p._id)">+</button>
      </div>
    </div>

    <!-- Paid amount -->
    <div class="paid">
      <label>To'langan summa: </label>
      <input
        class="paid-input"
        type="number"
        v-model="paidAmount"
        placeholder="Paid Amount"
        min="0"
      />
    </div>

    <!-- Total -->
    <div class="total">
      <strong>Jami summa: </strong> {{ totalAmount.toLocaleString("en-US") }}
      so'm
    </div>

    <!-- Submit -->
    <button :disabled="loading" @click="submit">
      {{ loading ? "Yuborilmoqda..." : "Yuborish" }}
    </button>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getStores } from "../../api/store";
import { getProducts } from "../../api/product";
import { postDistribute } from "../../api/supply";
import { useToast } from "vue-toastification";
import { getErrorMessage } from "../../utils/errorHandler";

const toast = useToast();

// State
const products = ref([]);
const stores = ref([]);
const selectedStore = ref("");
const selectedProducts = ref([]);
const paidAmount = ref("");
const loading = ref(false);

// Fetch data
onMounted(async () => {
  try {
    const resProducts = await getProducts();
    products.value = resProducts.data.products;

    const resStores = await getStores();
    stores.value = resStores.data.stores;
  } catch (e) {
    toast.error("Ma'lumotlarni olishda xatolik");
  }
});

// Helpers
const isSelected = (id) =>
  selectedProducts.value.some((p) => p.productId === id);
const getQuantity = (id) =>
  selectedProducts.value.find((p) => p.productId === id)?.quantity || 1;

const toggleProduct = (product) => {
  const index = selectedProducts.value.findIndex(
    (p) => p.productId === product._id
  );
  if (index === -1) {
    selectedProducts.value.push({
      productId: product._id,
      quantity: 1,
      price: product.price,
    });
  } else {
    selectedProducts.value.splice(index, 1);
  }
};
const increase = (id) => {
  const item = selectedProducts.value.find((p) => p.productId === id);
  if (item) item.quantity++;
};

const decrease = (id) => {
  const item = selectedProducts.value.find((p) => p.productId === id);
  if (item && item.quantity > 1) item.quantity--;
};

// Total amount
const totalAmount = computed(() =>
  selectedProducts.value.reduce((sum, p) => sum + p.quantity * p.price, 0)
);

// Submit
const submit = async () => {
  if (!selectedStore.value) {
    toast.error("Do'kon tanlanmadi");
    return;
  }
  if (!selectedProducts.value.length) {
    toast.error("Hech qanday mahsulot tanlanmadi");
    return;
  }

  loading.value = true;
  try {
    await postDistribute({
      storeId: selectedStore.value,
      paidAmount: Number(paidAmount.value) || 0,
      products: selectedProducts.value.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
        unitPrice: p.price,
        totalAmount: p.quantity * p.price,
      })),
    });

    toast.success("Mahsulotlar muvaffaqiyatli yuborildi");
    selectedProducts.value = [];
    paidAmount.value = "";
    selectedStore.value = "";
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.distribution {
  max-width: 900px;
  margin: 60px auto;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
.select,
option {
  padding: 8px;
  margin: 8px 0 10px 5px;
  border: 1px solid #ccc;
  color: #000000;
  /* background-color: #4a90e2; */
  font-weight: bold;
  font-size: 14px;
  border-radius: 4px;
  outline: none;
}
.select:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
}
.product-item {
  display: flex;
  align-items: start;
  gap: 10px;
  margin: 10px 0;
  padding: 2px 0;
}
.product-item input {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: end;
  justify-content: center;
}
.name {
  margin: 5px 0 0 0;
  font-size: 18px;
  font-weight: bold;
  color: #333;
}
.price {
  margin: 0;
  font-size: 14px;
  color: #888;
}
.qty {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.qty button {
  width: 30px;
  height: 30px;
  font-size: 18px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.paid-input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  margin: 16px 0 0 0;
}
.paid-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
}
.paid {
  margin: 20px 0;
}

.total {
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: bold;
}

button {
  padding: 10px 15px;
  background-color: #4caf50;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}
</style>
