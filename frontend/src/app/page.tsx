"use client";
import Navbar from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { API_BASE_URL } from "@/config";
import ToastProvider from "@/context/toast-provider";
import useUserStore from "@/stores/user-store";
import axios from "axios";
import { useEffect } from "react";
import toast from "react-hot-toast";

export default function Home() {

  const { user, setUser } = useUserStore();

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  //       const response = await axios.get(`${API_BASE_URL}/api/user`, {
  //         withCredentials: true, // Include cookies
  //       });
  //       setUser(response.data);
  //     } catch (error) {
  //       console.error('Failed to fetch user:', error);
  //     }
  //   };

  //   if (!user) {
  //     fetchUser();
  //   }
  // }, [user, setUser]);

  // if (!user) {
  //   return <div>Loading...</div>; // Optional loading state
  // }


  return (
    <>
      <ToastProvider />
      <Navbar />
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mt-10">Home</h1>
        <p className="mt-4">Welcome, {user?.name}!</p>
      </div>

      <Button onClick={() => toast.error("This is an error toast")}>Error toast</Button>
    </>
  );
}
