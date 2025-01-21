"use client";

import { Button } from "@/components/ui/button";
import decodeToken from "@/lib/decodeToken";
import { getToken } from "@/lib/token";

export default function Home() {
  const decodeJwt = () => {
    const token = getToken();
    console.log(token)
    if (token)
      console.log(decodeToken(token))
  }
  return (
    <>
      <div className="container mx-auto">
        Home page for unlogged users

        <Button onClick={decodeJwt}>Decode JWT</Button>
      </div>
    </>
  );
}
