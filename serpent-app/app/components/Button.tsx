import styles from "./styles/Button.module.css";
import Link from 'next/link'

type ButtonProps = {
    children: React.ReactNode;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    isExternal?: boolean;
}

export default function Button({ children, onClick, href, variant = 'primary', isExternal = false }: ButtonProps) {
    if (href) {
        if (isExternal) {
            return (
                <a
                    href={href}
                    className={`${styles.button} ${styles[variant]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={`${styles.button} ${styles[variant]}`}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`${styles.button} ${styles[variant]}`} onClick={onClick}>
            {children}
        </button>
    );
}