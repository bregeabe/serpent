import styles from './styles/InputField.module.css'
import React, { useState } from 'react';

type InputProps = {
    children?: React.ReactNode;
    placeholder?: string;
    type?: 'text' | 'password';
}

export default function InputField({ placeholder, type = 'text' }: InputProps) {
    const [inputType, setInputType] = useState(type);

    const toggleVisibility = () => {
        setInputType(inputType === 'password' ? 'text' : 'password');
    };

    return (
        <div className={styles.inputContainer}>
            <input
                type={inputType}
                className={styles.inputBox}
                placeholder={placeholder}
            />
            {type === 'password' && (
                <button
                    type="button"
                    className={styles.toggleButton}
                    onClick={toggleVisibility}
                >
                    {inputType === 'password' ? 'Show' : 'Hide'}
                </button>
            )}
        </div>
    );
}