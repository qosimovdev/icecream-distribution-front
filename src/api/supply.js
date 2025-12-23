import api from "./axios";

export const postDistribute = (data) => api.post("/storeSupply/distribute", data);
export const getStoreTotalDebt = (id) => api.get(`/storeSupply/${id}`);