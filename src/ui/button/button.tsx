import React from "react";
import './button.css'

type ButtonProps = {
    children: string,
    modifier?: 'danger' | 'outline'
}

export function Button({children}: ButtonProps) {
    return (
        <button className="btn">
            <span>
                {children}
            </span>
        </button>
    )
}