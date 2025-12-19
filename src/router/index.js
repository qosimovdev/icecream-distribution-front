import { createRouter, createWebHistory } from "vue-router";
import StoreList from "../pages/store/StoreList.vue";
import CreateStore from "../pages/store/CreateStore.vue";
// import StoreEditView from "@/views/StoreEditView.vue";
import StoreDetail from "../pages/store/StoreDetails.vue";
import StockAddView from "../pages/StockAddView.vue";
import Dashboard from "../pages/Dashboard.vue";

const routes = [
    { path: "/", component: Dashboard },
    { path: "/stocks", component: StockAddView },
    // { path: "/stores", component: StoreListView },
    { path: "/stores/create", component: CreateStore },
    { path: "/stores", component: StoreList },
    // { path: "/stores/edit/:id", component: StoreEditView },
    { path: "/store/:id", component: StoreDetail } // distribution + hisobot
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router