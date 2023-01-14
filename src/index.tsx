import { App } from './ui/app/app'
import React from 'react'
import { createRoot } from 'react-dom/client';

const root = createRoot(document.getElementById('root') as Element)
root.render(
    <React.StrictMode>
        <App></App>
    </React.StrictMode>
)
