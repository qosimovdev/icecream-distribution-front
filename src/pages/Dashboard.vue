<template>
  <div class="dashboard">
    <h1>📊 Dashboard</h1>

    <p v-if="loading">Yuklanmoqda...</p>

    <!-- Ombor summary -->
    <div class="stats">
      <!-- <StatCard title="Mahsulotlar" :value="warehouse.totalProducts">
        <template #icon>📦</template>
      </StatCard> -->
      <StatCard title="Omborda qoldi" :value="warehouse.totalQuantity">
        <template #icon>📦</template>
      </StatCard>
      <StatCard
        title="Jami sotilgan dona"
        :value="daily.totalQuantity + ' dona'"
      >
        <template #icon>📈</template>
      </StatCard>
      <StatCard title="Bugungi savdo" :value="daily.totalSales + ' so\'m'">
        <template #icon>💵</template>
      </StatCard>
      <StatCard title="Bugungi qarz" :value="daily.totalDebt + ' so\'m'">
        <template #icon>🧾</template>
      </StatCard>
      <!-- <StatCard title="Jami summa" :value="warehouse.totalAmount + ' so\'m'">
        <template #icon>💰</template>
      </StatCard> -->
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import StatCard from "../components/StatCard.vue";
import { getWarehouseSummary } from "../api/stock";
import { getDailyReport } from "../api/report";
import { getErrorMessage } from "../utils/errorHandler";
import { useToast } from "vue-toastification";

const toast = useToast();
const loading = ref(true);
const errorMsg = ref("");
const successMsg = ref("");

// const warehouse = ref({ totalProducts: 0, totalQuantity: 0, totalAmount: 0 });
const warehouse = ref({ totalQuantity: 0 });

const daily = ref({ totalQuantity: 0, totalSales: 0, totalDebt: 0 });

onMounted(async () => {
  loading.value = true;
  errorMsg.value = "";
  successMsg.value = "";

  try {
    // Ombor
    const wRes = await getWarehouseSummary();
    const wData = wRes.data.data;
    // warehouse.value.totalProducts = wData.length;
    warehouse.value.totalQuantity = wData.reduce(
      (sum, item) => sum + item.totalQuantity,
      0
    );
    // warehouse.value.totalAmount = wData.reduce(
    //   (sum, item) => sum + item.totalAmount,
    //   0
    // );

    // Kunlik savdo
    const today = new Date().toISOString().slice(0, 10);
    const dRes = await getDailyReport(today);
    daily.value = dRes.data.data;

    toast.success("Ma'lumot muvaffaqiyatli yuklandi");
  } catch (error) {
    toast.error(getErrorMessage(error));
  } finally {
    loading.value = false;
  }
});
</script>

<style scoped>
.dashboard {
  margin-top: 40px;
  width: 100%;
}

.stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.error {
  color: red;
}
.success {
  color: green;
}
</style>
