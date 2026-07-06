import axios from "axios";
import { registerInterceptors } from "./interceptors";

// TODO: placeholder
const ENV = {
    apiBaseUrl: "https://api.example.com",
};

export const api = axios.create({
    baseURL: ENV.apiBaseUrl,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    },
});

registerInterceptors(api);