import { Category } from "@/lib/interfaces";
import apiClient from "../axios";

interface CategoriesResponse {
    success: boolean,
    data: Category[]
}

interface CategoryResponse {
    success: boolean,
    data: Category
}

export const fetchAllCategories = async (): Promise<CategoriesResponse> => {
    const response = await apiClient.get<CategoriesResponse>("/categories");
    return response.data;
}

export const createCategory = async (name: string, description: string): Promise<CategoryResponse> => {
    const response = await apiClient.post<CategoryResponse>("/categories", { name, description });
    return response.data;
}