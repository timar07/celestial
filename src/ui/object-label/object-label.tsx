import React, { useEffect, useRef, useState } from "react";
import { SceneManager } from "../../scene-manager";
import './object-label.css'

type ObjectLabelProps = {
    manager: SceneManager
}

export function ObjectLabel(props: ObjectLabelProps) {
    const [pos, setPos] = useState({x: 0, y: 0})
    const [isActive, setActive] = useState(false)
    const [label, setLabel] = useState("")
    const ref = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const handleMouseMovement = (e: MouseEvent) => {
            e.preventDefault()

            if(false) {
                setPos({x: e.clientX, y: e.clientY})
                setActive(true)
                // setLabel(hoveredObject.userData?.getName())
            } else {
                setActive(false)
            }
        }
        document.addEventListener('mousemove', handleMouseMovement)

        return () => {
            document.removeEventListener('mousemove', handleMouseMovement)
        }
    }, [])
    return (
        <span
            className="object-label"
            style={{
                display: isActive ? 'block': 'none',
                top: pos.y,
                left: pos.x
            }}
        >
            {label}
        </span>
    )
}