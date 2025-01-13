"use client";
import Navbar from "@/components/navbar";
import ToastProvider from "@/context/toast-provider";
import useAuthStore from "@/stores/authStore";

export default function Home() {

  const { user } = useAuthStore();

  return (
    <>
      <ToastProvider />
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mt-10">Home</h1>
        <p className="mt-4">Welcome, {user?.name}!</p>
      </div>

    </>
  );
}
