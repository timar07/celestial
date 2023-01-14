import React, { useState, useEffect, useRef } from 'react'
import Button from '../button'
import './context-menu.css'

export function ContextMenu({}) {
    const [active, setActive] = useState(false)
    const [pos, setPos] = useState({x: 0, y: 0})
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleContextMenu = (e: MouseEvent) => {
            e.preventDefault()
            setActive(true)
            setPos({
                x: e.clientX,
                y: e.clientY
            })
        }

        const handleClose = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setActive(false)
            }
        }

        document.addEventListener('contextmenu', handleContextMenu)
        document.addEventListener('click', handleClose)

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu)
            document.removeEventListener('click', handleClose)
        }
    }, [])
    return (
        <div ref={ref} className='context-menu' style={{
            display: active ? 'block': 'none',
            top: pos.y + 'px',
            left: pos.x + 'px',
        }}>
            <Button>hello</Button>
        </div>
    )
}