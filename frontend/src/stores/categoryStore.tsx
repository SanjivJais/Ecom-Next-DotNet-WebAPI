// Zustand store to manage categories
import { Category } from "@/lib/interfaces";
import { create } from "zustand";

interface CategoryState {
    categories: Category[];
    setCategories: (categories: Category[]) => void;
}

const useCategoryStore = create<CategoryState>((set) => ({
    categories: [],
    setCategories: (categories) => set({ categories }),
}));

export default useCategoryStore;