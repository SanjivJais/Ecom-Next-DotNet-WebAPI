"use client"
import { useEffect, useState } from "react"
import { columns } from "./columns"
import { DataTable } from "./data-table"
import { CustomError } from "@/lib/interfaces";
import { fetchAllCategories } from "@/lib/APIs/category";
import { toast } from "sonner";
import useCategoryStore from "@/stores/categoryStore";

export default function DemoPage() {

  const { categories, setCategories } = useCategoryStore();
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

  return (
    <div className="container mx-auto py-10">
      {loading ? <h1>Loading...</h1> : <DataTable columns={columns} data={categories.toSorted((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())} />}
    </div>
  )
}
