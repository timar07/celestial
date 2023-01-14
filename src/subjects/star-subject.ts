import { CelestialObject } from "../model/celestial-object"
import * as THREE from "three"
import { CelestialSubject } from "./celestial-subject"

export class StarSubject extends CelestialSubject {
    constructor(
        scene: THREE.Scene,
        model: CelestialObject
    ) {
        super(scene, model)
        this.addLights()
    }

    private addLights() {
        const pos = this.model.getPos()
        let light = new THREE.PointLight(this.model.getColor())
        light.position.set(pos.x, pos.y, pos.z)
        this.scene.add(light)
    }

    protected updateGeometry(): void {}

    protected updateMaterial(): void {
    }

    protected updateChildren(): void {
        // this.atmosphere.update()
    }

    protected createMaterial() {
        let mat = new THREE.MeshBasicMaterial( {
            color: 0xffffff,
        })
        return mat
    }

    protected createGeometry() {
        const geo = new THREE.SphereGeometry(
            this.model.getRadius(),
            this.getGeometryDetail()
        )
        geo.computeVertexNormals();
        return geo
    }

    private getGeometryDetail() {
        return Math.floor(this.model.getRadius()*0.1)
    }
}
