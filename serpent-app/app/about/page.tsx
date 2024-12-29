import styles from "./about.module.css";
import Image from "next/image";
import Footer from '../components/Footer'
import Button from '../components/Button'


export default function Home() {
  return (
    <div className={styles.page}>
      <Image className={styles.logo}
          src="/serpent-logo-landscape.png"
          alt="landscape-logo"
          width={270}
          height={100}
          priority
        />
      <main className={styles.main}>
        Serpent is meant to be Strava for programmers.<br/><br/>
        I found it ironic that there is no tracking app for the people who make the tracking apps—so for my senior project I'm making just that.<br/><br/>
        Right now that's pretty much all there is too it.<br/><br/>
        Feel free to visit the links below to see more about me, and the repo itself.
      </main>
      <Footer gridArea={3}>

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

