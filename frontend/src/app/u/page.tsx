"use client"
import useAuthStore from '@/stores/authStore';
import React from 'react'

const page = () => {
    const { user } = useAuthStore();
    return (
        <div>Welcome {user?.name}</div>
    )
}

export default page