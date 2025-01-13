// components/AuthProvider.tsx
"use client";

import { useEffect, useState } from "react";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";
import { fetchUserData } from "@/services/authService";
import { getToken } from "@/utils/token";

export default function AuthProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const { setUser, user, logout } = useAuthStore();
    const router = useRouter();
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = getToken();
                if (!token) {
                    logout()
                    router.push("/login");
                    return;
                }
                const userData = await fetchUserData(); // Fetch user details
                setUser(userData);
            } catch (err) {
                console.error("Authentication check failed:", err);
                logout()
                router.push("/login");
            } finally {
                setLoading(false)
            }
        };

        checkAuth();
    }, [logout, setUser, router]);

    if (loading) {
        return <div>Loading...</div>
    }

    return <>{children}</>;
}
