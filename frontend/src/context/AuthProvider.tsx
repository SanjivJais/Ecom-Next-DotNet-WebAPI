"use client";
import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/services/authService";
import { getToken, removeToken } from "@/lib/token";
import { BarLoader } from "react-spinners"
import decodeToken from "@/lib/decodeToken";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setUser, clearUser } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getToken();
                
                if (!token) {
                    clearUser()
                    return;
                }
                const userData = await fetchUserData(); // Fetch user details
                setUser(userData.data);
            } catch (err) {
                console.error("Authentication check failed:", err);
                clearUser()
                removeToken();
                router.push("/login");
            } finally {
                setLoading(false)
            }
        };

        checkAuth();
    }, [clearUser, setUser, router]);

    if (loading) {
        return <div className="min-h-screen w-full flex items-center justify-center"><BarLoader color="#16a34a" /></div>
    }

    return <>{children}</>;
}
