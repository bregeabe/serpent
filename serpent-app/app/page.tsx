import Image from "next/image";
import pageStyles from "./page.module.css";
import Button from './components/Button'
import Footer from './components/Footer'

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

        <div className={pageStyles.ctas}>
          <Button
            href="/dashboard" variant="primary"
          >
            Use Serpent
          </Button>
          <Button
            href="/about" variant="primary"
          >
            About Serpent
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

      </Footer>
    </div>
  );
}
