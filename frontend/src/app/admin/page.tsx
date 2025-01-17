"use client";
import useAuthStore from '@/stores/authStore';
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation';


const page = () => {
    const { user } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!user || user.role.toLowerCase() !== "admin") {
            router.replace("/unauthorized"); // Redirect to a dedicated unauthorized page
        }
    }, [user, router]);

    if (!user || user.role.toLowerCase() !== "admin") {
        // Render a loader while redirecting or validating
        return (
            <div className="min-h-screen w-full flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div>This is Admin Dashboard</div>
    );

}

export default page