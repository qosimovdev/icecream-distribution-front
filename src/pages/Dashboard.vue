<template>
  <div class="dashboard">
    <h1>📊 Dashboard</h1>

    <p v-if="loading">Yuklanmoqda...</p>

    <div class="stats" v-else>
      <StatCard title="Omborda qoldi" :value="warehouse.totalQuantity">
        <template #icon>📦</template>
      </StatCard>

      <StatCard title="Bugun sotildi" :value="daily.totalQuantity + ' dona'">
        <template #icon>📈</template>
      </StatCard>

      <StatCard
        title="Bugungi savdo"
        :value="daily.totalSales.toLocaleString() + ' so‘m'"
      >
        <template #icon>💵</template>
      </StatCard>

      <StatCard
        title="Bugungi qarz"
        :value="daily.totalDebt.toLocaleString() + ' so‘m'"
      >
        <template #icon>🧾</template>
      </StatCard>
    </div>

    <div class="chart-container">
      <canvas id="salesChart"></canvas>
    </div>

    <div class="progress-bar">
      <div class="filled" :style="{ width: soldPercent + '%' }"></div>
      <span>{{ soldPercent }}% sotildi</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import StatCard from "../components/StatCard.vue";
import { getWarehouseSummary } from "../api/stock";
import { getDailyReport } from "../api/report";
import { useToast } from "vue-toastification";
import Chart from "chart.js/auto";

const toast = useToast();
const loading = ref(true);

const warehouse = ref({ totalQuantity: 0 });
const daily = ref({
  totalQuantity: 0,
  totalSales: 0,
  totalPaid: 0,
  totalDebt: 0,
});

const soldPercent = ref(0);
let chartInstance = null;
let intervalId = null;

const fetchData = async () => {
  loading.value = true;
  try {
    /* 📦 Warehouse */
    const wRes = await getWarehouseSummary();
    const wData = wRes.data.data;

    warehouse.value.totalQuantity = wData.reduce(
      (sum, item) => sum + (item.totalQuantity || 0),
      0
    );

    /* 📊 Daily report */
    const today = new Date().toISOString().slice(0, 10);
    const dRes = await getDailyReport(today);

    // const data = dRes.data.data;

    daily.value = {
      totalQuantity: dRes.data.data.totalQuantity || 0,
      totalSales: dRes.data.data.totalSales || 0,
      totalPaid: dRes.data.data.totalPaid || 0,
      totalDebt: dRes.data.data.totalDebt || 0,
    };

    /* 📈 Percent */
    soldPercent.value =
      daily.value.totalQuantity + warehouse.value.totalQuantity > 0
        ? Math.round(
            (daily.value.totalQuantity /
              (daily.value.totalQuantity + warehouse.value.totalQuantity)) *
              100
          )
        : 0;

    renderChart();
  } catch (err) {
    console.error(err);
    toast.error("Maʼlumotni yuklashda xatolik");
  } finally {
    loading.value = false;
  }
};

const renderChart = () => {
  const canvas = document.getElementById("salesChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");

  if (chartInstance) {
    chartInstance.destroy();
  }

  chartInstance = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Sotilgan", "Qoldiq", "Qarz"],
      datasets: [
        {
          label: "Bugungi holat",
          data: [
            daily.value.totalQuantity,
            warehouse.value.totalQuantity,
            daily.value.totalDebt,
          ],
          backgroundColor: ["#4caf50", "#2196f3", "#f44336"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  });
};

onMounted(() => {
  fetchData();
  intervalId = setInterval(fetchData, 120000); // 2 daqiqa
});

onBeforeUnmount(() => {
  if (intervalId) clearInterval(intervalId);
  if (chartInstance) chartInstance.destroy();
});
</script>

<style scoped>
.dashboard {
  margin-top: 40px;
}

.stats {
  display: flex;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
}

.chart-container {
  margin-top: 30px;
  max-width: 600px;
  height: 300px;
}

.progress-bar {
  margin-top: 20px;
  width: 100%;
  height: 25px;
  background-color: #eee;
  border-radius: 5px;
  position: relative;
  overflow: hidden;
}

.progress-bar .filled {
  height: 100%;
  background-color: #4caf50;
  transition: width 0.4s ease;
}

.progress-bar span {
  position: absolute;
  left: 50%;
  top: 0;
  transform: translateX(-50%);
  font-weight: bold;
  color: #000;
}
</style>
