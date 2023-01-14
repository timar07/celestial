import * as THREE from 'three'

export class Clouds extends THREE.Mesh {
    private radius

    constructor(radius: number) {
        super()
        this.radius = radius
        this.geometry = this.createGeometry()
        this.material = this.createMaterial()
    }

    private createGeometry() {
        return new THREE.SphereGeometry(10, 35, 35);
    }

    private createMaterial() {
        return new THREE.MeshPhysicalMaterial( {
            color: 0xffffff,
            flatShading: true
        })
    }
}