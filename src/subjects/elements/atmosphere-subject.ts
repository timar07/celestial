import * as THREE from "three"
import { CelestialObject } from "../../model/celestial-object"
import { SceneSubject } from "../../scene-subject"
import { CelestialSubject } from "../celestial-subject"

export interface AtmosphereObject {
    radius: number
}

export class Atmosphere extends SceneSubject<AtmosphereObject> {
    constructor(
        scene: THREE.Scene,
        model: AtmosphereObject
    ) {
        super(scene, model)
    }

    protected updateGeometry() {}
    protected updateMaterial() {}
    protected updateChildren() {}

    protected override createGeometry() {
        const geo = new THREE.SphereGeometry(this.model.radius, 35, 35)
        return geo
    }

    protected override createMaterial() {
        const mat = new THREE.MeshLambertMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.2
        })
        return mat
    }
}
