import { createRouter, createWebHistory } from "vue-router";
import StoreList from "../pages/store/StoreList.vue";
import CreateStore from "../pages/store/CreateStore.vue";
import StoreDetail from "../pages/store/StoreDetails.vue";
import Dashboard from "../pages/Dashboard.vue";
import ProductsList from "../pages/products/ProductsList.vue";
import Distribution from "../pages/distribution/Distribution.vue";
import StockAdd from "../pages/stock/StockAdd.vue";

const routes = [
    { path: "/", component: Dashboard },
    { path: "/products", component: ProductsList },
    { path: "/distribution", component: Distribution },
    { path: "/stock", component: StockAdd },
    { path: "/stores", component: StoreList },
    { path: "/store/:id", component: StoreDetail },
    { path: "/stores/create", component: CreateStore },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router