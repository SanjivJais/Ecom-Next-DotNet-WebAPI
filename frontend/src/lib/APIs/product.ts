import { Product } from "@/lib/interfaces";
import apiClient from "../axios";

interface ProductsResponse {
    success: boolean,
    data: Product[]
}

interface ProductResponse {
    success: boolean,
    data: Product
}

interface ProductRequest {
    categoryId: string,
    name: string,
    description: string,
    price: number,
    stock: number,
    imageUrl: string
}

export const fetchAllProducts = async (): Promise<ProductsResponse> => {
    const response = await apiClient.get<ProductsResponse>("/products");
    return response.data;
}

export const createProduct = async ({ name, description, categoryId, price, stock, imageUrl }: ProductRequest): Promise<ProductResponse> => {
    const response = await apiClient.post<ProductResponse>("/products", { name, description, categoryId, price, stock, imageUrl });
    return response.data;
}

export const updateProduct = async (id: string, { name, description, categoryId, price, stock, imageUrl }: ProductRequest): Promise<ProductResponse> => {
    const response = await apiClient.put<ProductResponse>(`/products/${id}`, { name, description, categoryId, price, stock, imageUrl });
    return response.data;
}

export const deleteProduct = async (id: string): Promise<ProductResponse> => {
    const response = await apiClient.delete<ProductResponse>(`/products/${id}`);
    return response.data;
}