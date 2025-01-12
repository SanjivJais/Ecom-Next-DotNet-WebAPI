export interface User {
    userId: string;
    email: string;
    name: string;
    role: string;
    token: string;
    createdAt: string;
    cart: Cart // Adjust based on your actual `cart` structure.
}

export interface Product {
    productId: string;
    name: string;
    description: string;
    price: number;
    image: string;
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
    createdAt: string;
}

