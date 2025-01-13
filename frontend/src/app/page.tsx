"use client";
import Navbar from "@/components/navbar";
import ToastProvider from "@/context/ToastProvider";
import useAuthStore from "@/stores/authStore";

export default function Home() {

  const { user } = useAuthStore();

  return (
    <>
      <ToastProvider />
      <Navbar />
      <div className="container mx-auto">
        <p className="mt-4">Welcome, {user?.name}!</p>
      </div>

    </>
  );
}
