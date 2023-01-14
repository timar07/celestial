import React from 'react'
import ContextMenu from '../context-menu'
import { useEffect } from 'react'
import { SceneManager } from '../../scene-manager'
import './app.css'
import { ObjectLabel } from '../object-label/object-label'

export class App extends React.Component {
    // @ts-ignore
    private manager: SceneManager

    constructor(props: {}) {
        super(props)
        this.manager = new SceneManager(document.createElement('canvas'))
        this.animate(this.manager)
    }

    render() {
        return (
            <>
                <ContextMenu/>
                <ObjectLabel manager={this.manager} />
            </>
        )
    }

    animate(manager: SceneManager) {
        manager.update()
        requestAnimationFrame(() => this.animate(manager))
    }
}