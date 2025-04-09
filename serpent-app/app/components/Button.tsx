import styles from "./styles/Button.module.css";
import Link from 'next/link';

type ButtonProps = {
    children: React.ReactNode;
    onClick?: (e?: React.MouseEvent<HTMLButtonElement>) => void;
    href?: string;
    variant?: 'primary' | 'secondary';
    isExternal?: boolean;
    width?: string | number,
    type?: "button" | "submit";
}

export default function Button({ children, onClick, href, variant = 'primary', isExternal = false, width, type="button" }: ButtonProps) {
    const buttonStyle = {
        width: typeof width === 'number' ? `${width}px` : width,
    };

    if (onClick) {
        return (
          <button
            type={type}
            className={`${styles.button} ${styles[variant]}`}
            onClick={(e) => {
              e.preventDefault();
              onClick(e);
            }}
            style={buttonStyle}
          >
            {children}
          </button>
        );
      }

    if (href) {
        if (isExternal) {
            return (
                <a
                    href={href}
                    className={`${styles.button} ${styles[variant]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={buttonStyle}
                >
                    {children}
                </a>
            );
        }
        return (
            <Link href={href} className={`${styles.button} ${styles[variant]}`} style={buttonStyle}>
                {children}
            </Link>
        );
    }

    return (
        <button className={`${styles.button} ${styles[variant]}`} onClick={onClick} style={buttonStyle}>
            {children}
        </button>
    );
}
