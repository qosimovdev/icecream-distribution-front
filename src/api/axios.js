import axios from "axios";

const api = axios.create({
    // baseURL: "http://localhost:2000/api",
    baseURL: "https://icego.up.railway.app/api",

    headers: {
        "Content-Type": "application/json"
    }
})

export default api
