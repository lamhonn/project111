import axios, { AxiosInstance } from "axios";
import { store } from "../../state/store";
import { tokenAtom } from "../../state/authStore";

export function registerInterceptors(axiosInstance: AxiosInstance) {
    // Add a request interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            const accessToken = localStorage.getItem("accessToken");

            if (accessToken) {
                config.headers["Authorization"] = `Bearer ${accessToken}`;
            }

            return config;
        },
        (error) => {
            console.error("Request error:", error);
            return Promise.reject(error);
        }
    );

    // Add a response interceptor
    axiosInstance.interceptors.response.use(
        (response) => {
            return response;
        },
        async (error) => {
            const originalRequest = error.config;

            // TODO: remove console errors for security
            switch (error.response?.status) {
                case 401:
                    console.error("Unauthorized");

                    if (!originalRequest.retryRequest) {
                        originalRequest.retryRequest = true;

                        try {
                            const response = await axios.post(`${originalRequest.baseURL}/tablet/refresh`);
                            
                            store.set(tokenAtom, response.data.accessToken);

                            originalRequest.headers['Authorization'] = `Bearer ${response.data.accessToken}`;
                            
                            return axiosInstance(originalRequest);
                        } 
                        catch (refreshError) {
                            // TODO: add forced logout
                            store.set(tokenAtom, null);
                            return Promise.reject(refreshError);
                        }
                    }
                    break;
                case 403:
                    console.error("Forbidden");
                    break;
                case 404:
                    console.error("Resource");
                    break;
                case 500:
                    console.error("Internal");
                    break;
                default:
                    console.error(`Unexpected error: ${error.response?.status}`);
            }

            return Promise.reject(error);
        }
    );
}