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

export const fetchUserData = async (): Promise<AuthResponse> => {
    const token = getToken();
    if (!token) throw new Error("No token found");

    const response = await axios.get<AuthResponse>(`${API_BASE_URL}/users/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};


export const registerUser = async (name: string, email: string, password: string, role: string) => {
    const response = await axios.post(`${API_BASE_URL}/users/register`, { name, email, password, role });
    return response.data;
};

