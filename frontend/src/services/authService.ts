import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "../config";


export const loginUser = async (email: string, password: string) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/users/login`, {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        if (isAxiosError(error)) {
            // Include Axios error details in the thrown error
            throw new Error(error.response?.data.message || "Login failed!");
        }
        throw new Error("An unknown error occurred");
    }
};
