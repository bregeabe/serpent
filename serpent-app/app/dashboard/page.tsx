"use client";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Button from '../components/Button';


export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return (
    <div>
      {session?.user ? (
        <>
          <h1>Welcome, {session.user.name}</h1>
          <p>Email: {session.user.email}</p>
        </>
      ) : (
        <Button
        href='/setup/login' variant="primary" width="100px"
        > back to home</Button>
      )}
    <Button
    onClick={() => signOut()} variant="primary" width="100px"
    > log out</Button>
    </div>
  );
}
