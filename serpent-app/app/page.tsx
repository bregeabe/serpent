import Image from "next/image";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image className={styles.logo}
          src="/serpent-logo-landscape.png"
          alt="landscape-logo"
          width={300}
          height={100}
          priority
        />
        <div className={styles.ctas}>
          <a
            className={styles.primary}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/setup/login`}
          >
            Get started
          </a>
          <a
            className={styles.primary}
            href={`${process.env.NEXT_PUBLIC_BASE_URL}/about`}
          >
            About Serpent
          </a>
        </div>
      </main>
      <footer className={styles.footer}>
        <a
          href="https://github.com/abrege11/serpent/"
          target="_blank"
        >
          Serpent's repo
        </a>
        <a
          href="https://abrege11.github.io"
          target="_blank"
        >
          My portfolio
        </a>
        <a
          href={`${process.env.NEXT_PUBLIC_BASE_URL}/contact`}
          target="_blank"
        >
         Contact me
        </a>
      </footer>
    </div>
  );
}
