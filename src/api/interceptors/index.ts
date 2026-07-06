import { AxiosInstance } from "axios";

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

            switch (error.response?.status) {
                case 401:
                    // TODO: remove token?
                    console.error("Unauthorized access - perhaps the token is invalid or expired.");
                    break;
                case 403:
                    console.error("Forbidden access - you don't have permission to access this resource.");
                    break;
                case 404:
                    console.error("Resource not found - the requested resource does not exist.");
                    break;
                case 500:
                    console.error("Internal server error - something went wrong on the server.");
                    break;
                default:
                    console.error(`Unexpected error: ${error.response?.status}`);
            }

            return Promise.reject(error);
        }
    );
}