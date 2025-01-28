import { Product } from '@/lib/interfaces'
import { create } from 'zustand'

interface ProductState {
    products: Product[]
    setProducts: (products: Product[]) => void
}

const useProductStore = create<ProductState>((set) => ({
    products: [],
    setProducts: (products) => set({ products })
}))

export default useProductStore