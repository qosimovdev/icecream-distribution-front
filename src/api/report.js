import api from "./axios";

export const getDailyReport = (date) => {
    return api.get(`/report/daily?date=${date}`);
};