<script setup>
import { ref, onMounted } from "vue";
import { getProducts } from "../../api/product";
import { addStock } from "../../api/stock";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "vue-toastification";

const products = ref([]);
const productId = ref("");
const quantity = ref("");
const toast = useToast();
const loading = ref(false);

onMounted(async () => {
  const res = await getProducts();
  products.value = res.data.products;
});

const submit = async () => {
  try {
    if (!productId.value || !quantity.value) {
      toast.error("Iltimos, barcha maydonlarni to'ldiring");
      return;
    }
  } catch (error) {
    toast.error(getErrorMessage(error));
    return;
  }
  await addStock({
    productId: productId.value,
    quantity: Number(quantity.value),
  });
  toast.success("Omborga mahsulot muvaffaqiyatli qo'shildi");
};
</script>

<template>
  <div class="stock-add">
    <select v-model="productId">
      <option disabled value="">Product tanlang</option>
      <option v-for="p in products" :key="p._id" :value="p._id">
        {{ p.name }}
      </option>
    </select>

    <input type="number" v-model="quantity" placeholder="Nechta keldi" />

    <button :disabled="loading" @click="submit">
      {{ loading ? "Saqlanmoqda..." : "Saqlash" }}
    </button>
  </div>
</template>
<style>
.stock-add {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin: 80px auto;
  max-width: 900px;
}
.stock-add select,
.stock-add input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  outline: none;
}
.stock-add select:focus,
.stock-add input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
}
.stock-add button {
  padding: 10px 15px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
}
</style>
