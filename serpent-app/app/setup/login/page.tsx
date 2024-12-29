"use client";
import Image from "next/image";
import pageStyles from "./login.module.css";
import Button from '../../components/Button'
import Footer from '../../components/Footer'
import InputField from "../components/InputField";

export default function Home() {
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
            href="/setup/login" variant="primary" width="100px"
          >
            login
          </Button>
        </div>
        <div className={pageStyles.ctasSecondary}>
          <Button
            href="/setup/login" variant="secondary"
          >
          sign up
          </Button>
          <Button
            href="/setup/login" variant="secondary"
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
