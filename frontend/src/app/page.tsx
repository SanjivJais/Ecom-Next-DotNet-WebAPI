"use client";
import Navbar from "@/components/navbar";
import useAuthStore from "@/stores/authStore";

export default function Home() {

  const { user } = useAuthStore();

  return (
    <>
      <Navbar />
      <div className="container mx-auto">
        <p className="mt-4">Welcome, {user?.name}!</p>
      </div>
    </>
  );
}
