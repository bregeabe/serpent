"use client";

import Image from "next/image";
import pageStyles from "./login.module.css";
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import InputField from "../components/InputField";
import { useSession, signIn } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
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
    <div className={pageStyles.page}>

      <main className={pageStyles.main}>
      <Image className={pageStyles.logo}
          src="/serpent-logo-landscape.png"
          alt="landscape-logo"
          width={270}
          height={100}
          priority
        />
        <div className={pageStyles.textboxes}>
          <InputField placeholder="username"/>
          <InputField placeholder="password" type="password"/>
        </div>
        <div className={pageStyles.ctas}>
          <Button
            href="/api/setup/login" variant="primary" width="100px"
          >
            login
          </Button>
          <Button
            onClick={() => signIn("google")} variant="primary" width="100px"
          >
            login with google
          </Button>
        </div>
        <div className={pageStyles.ctasSecondary}>
          <Button
            href="/setup/signup" variant="secondary"
          >
          sign up
          </Button>
          <Button
            href="/" variant="secondary"
          >
          forgot password
          </Button>
        </div>
      </main>
      <Footer gridArea={4}>

        <Button
        href="https://github.com/abrege11/serpent/" isExternal variant="secondary">
          Serpent's repo
        </Button>

        <Button
        href="https://abrege11.github.io" isExternal variant="secondary">
          My portfolio
        </Button>

        <Button
        href="/contact" variant="secondary">
          Contact me
        </Button>

        <Button
        href="/" variant="secondary">
          Home
        </Button>

      </Footer>
    </div>
  );
}
