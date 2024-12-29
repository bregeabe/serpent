import styles from './styles/Footer.module.css';

type FooterProps = {
    children: React.ReactNode;
    gridArea?: number;
}

export default function Footer({ children, gridArea }: FooterProps) {
    return (
        <footer className={styles.footer} style={{ gridArea }}>
            {children}
        </footer>
    );
}