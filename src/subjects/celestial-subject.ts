import { CelestialObject } from "../model/celestial-object"
import { SceneSubject } from "../scene-subject"
import * as THREE from "three"

export abstract class CelestialSubject extends SceneSubject<CelestialObject> {
    constructor(
        scene: THREE.Scene,
        model: CelestialObject
    ) {
        super(scene, model)
        this.mesh.userData = model
        this.scene.add(this.mesh);
    }

    public update(): void {
        this.model = this.mesh.userData as CelestialObject
        this.updatePosition()
        this.updateMesh()
    }

    private updatePosition() {
        const pos = this.model.getPos()
        this.mesh.position.x = pos.x;
        this.mesh.position.y = pos.y;
        this.mesh.position.z = pos.z;
    }
}
