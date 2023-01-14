import * as THREE from "three"
import { CelestialObject } from "../../model/celestial-object"
import { CelestialSubject } from "../celestial-subject"

export class Atmosphere extends CelestialSubject {
    constructor(
        scene: THREE.Scene,
        model: CelestialObject
    ) {
        super(scene, model)
    }

    protected updateGeometry() {}
    protected updateMaterial() {}
    protected updateChildren() {}

    protected override createGeometry() {
        const geo = new THREE.SphereGeometry(this.model.getRadius()+10, 35, 35)
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
