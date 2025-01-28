"use client"
import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { CustomError } from "@/lib/interfaces";
import { fetchAllCategories } from "@/lib/APIs/category";
import { toast } from "sonner";
import useCategoryStore from "@/stores/categoryStore";
import useProductStore from "@/stores/productStore";
import { fetchAllProducts } from "@/lib/APIs/product";

export default function page() {

  const { categories, setCategories } = useCategoryStore();
  const { products, setProducts } = useProductStore();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const cats = await fetchAllCategories();
        setCategories(cats.data);
      } catch (error) {
        toast.error((error as CustomError).response?.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const prods = await fetchAllProducts();
        setProducts(prods.data);
      } catch (error) {
        toast.error((error as CustomError).response?.data.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [])

  return (
    <div className="container mx-auto py-10">
      {loading ? <h1>Loading...</h1> : <DataTable columns={columns} data={products.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />}
    </div>
  )
}
