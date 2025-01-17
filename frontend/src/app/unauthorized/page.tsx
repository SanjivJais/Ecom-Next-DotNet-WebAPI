import { Button } from '@/components/ui/button'
import React from 'react'
import Link from 'next/link';

const page = () => {

    return (
        <div className='flex flex-col items-center justify-center h-screen gap-3'>
            <h1>Oopss..! You don't have permission to access this page</h1>
            <Link href={'/'}><Button>Go Home</Button></Link>
        </div>
    )
}

export default page