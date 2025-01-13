// services/authService.ts
import { API_BASE_URL } from "@/config";
import { AuthResponseUser } from "@/utils/interfaces";
import { getToken } from "@/utils/token";
import axios from "axios";

interface AuthResponse {
    success: boolean;
    data: AuthResponseUser
}

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>(`${API_BASE_URL}/users/login`, { email, password });
    return response.data;
};

export const fetchUserData = async (): Promise<AuthResponse["data"]> => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await axios.get<AuthResponse["data"]>(`${API_BASE_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
