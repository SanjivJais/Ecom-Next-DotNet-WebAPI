"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="container mx-auto flex flex-col gap-4 p-6">
        <span>Home page for unlogged users</span>

        <Link href={'/login'}><Button>Login</Button></Link>
      </div>
    </>
  );
}
