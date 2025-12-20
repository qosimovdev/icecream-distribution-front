<script setup>
import { ref } from "vue";
import { postStore } from "../../api/store";
import { useRouter } from "vue-router";
import { getErrorMessage } from "../../utils/errorHandler";
import { useToast } from "vue-toastification";

const toast = useToast();
const router = useRouter();
const name = ref("");
const address = ref("");
const errorMsg = ref("");
const successMsg = ref("");

const emit = defineEmits(["close", "store-created"]);

const submit = async () => {
  errorMsg.value = "";
  successMsg.value = "";
  try {
    const res = await postStore({
      name: name.value,
      address: address.value,
    });
    toast.success("Do'kon muvaffaqiyatli qo'shildi");
    emit("store-created", res.data);
  } catch (error) {
    toast.error(getErrorMessage(error));
  }
};
</script>

<template>
  <div class="modal-backdrop">
    <div class="add-store">
      <h3>Yangi do‘kon qo‘shish</h3>
      <form class="form">
        <input v-model="name" type="text" placeholder="Do'kon nomi" />
        <input v-model="address" type="text" placeholder="Manzil" />
        <input type="text" placeholder="Telefon raqam" />
        <button @click.prevent="submit" type="submit">Qo'shish</button>
        <button @click.prevent="emit('close')">Bekor qilish</button>
      </form>
    </div>
  </div>
</template>
<style scoped>
h3 {
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}
.form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.form input {
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
}
.form input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 3px rgba(74, 144, 226, 0.5);
}
.form button {
  padding: 10px 15px;
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}
.add-store {
  padding: 15px 25px;
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s, box-shadow 0.2s;
}
.add-store h3 {
  margin: 8px 0;
}
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
</style>
