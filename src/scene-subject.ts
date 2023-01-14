import * as THREE from 'three'

export abstract class SceneSubject<T> {
    protected scene: THREE.Scene
    protected mesh: THREE.Mesh
    protected model: T

    constructor(scene: THREE.Scene, model: any) {
        this.model = model
        this.scene = scene
        this.mesh = this.createMesh()
    }

    /**
     * Updators
     */
    update(): void {
        this.updateMesh()
        this.updateChildren()
    }

    protected updateMesh() {
        this.updateGeometry()
        this.updateMaterial()
    }

    protected abstract updateChildren(): void
    protected abstract updateGeometry(): void
    protected abstract updateMaterial(): void

    /**
     * Creators
     */
    protected createMesh() {
        const geo = this.createGeometry()
        const mat = this.createMaterial()
        return new THREE.Mesh(geo, mat)
    }

    protected abstract createGeometry(): any
    protected abstract createMaterial(): any
}
