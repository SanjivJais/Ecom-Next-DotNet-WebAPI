export interface User {
    userId: string;
    email: string;
    name: string;
    role: string;
    createdAt: string;
    cart: Cart // Adjust based on your actual `cart` structure.
}

export interface DecodedUser {
    role: string
    userId?: string
    email?: string
}

export interface AuthResponseUser extends User {
    token: string;
}

export interface Product {
    productId: string;
    categoryId: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    imageUrl: string;
    isDeleted: boolean;
    createdAt: string;
    category: Category;
}

export interface CartItem {
    productId: string;
    quantity: number;
    createdAt: string;
    product: Product;
    cart: Cart;
}

export interface Cart {
    cartId: string;
    items: CartItem[];
}

export interface Category {
    categoryId: string;
    name: string;
    description: string;
    isDeleted: boolean,
    createdAt: string;
}

export interface CustomError {
    response: {
        data: {
            message: string;
        }
    }
}

export interface SidebarMenuInterface {
    items: {
        title: string
        url: string
        icon?: string
        isActive?: boolean
        items?: {
            title: string
            url: string
        }[]
    }[]
}

