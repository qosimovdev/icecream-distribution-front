import api from "./axios";

export const getStores = () =>
    api.get("/store")

export const postStore = (data) =>
    api.post("/store", data)

export const getStoreById = (id) =>
    api.get(`/store/${id}`);

export const updateStore = (id, data) =>
    api.patch(`/store/${id}`, data);

export const deleteStore = (id) =>
    api.delete(`/store/${id}`);