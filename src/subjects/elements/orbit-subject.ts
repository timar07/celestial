import * as THREE from "three"
import { Vector3 } from "three"
import { CelestialObject } from "../../model/celestial-object"
import { SceneSubject } from "../../scene-subject"

export class PredictableOrbitsSubject extends SceneSubject<CelestialObject> {
    private objects
    private predictedPoints: Vector3[][] = [[]]

    constructor(
        scene: THREE.Scene,
        objects: CelestialObject[]
    ) {
        super(scene, undefined)
        this.objects = objects
        this.scene.add(this.mesh)
    }

    public getPoints() { return this.predictedPoints }

    protected updateGeometry() {
        this.predictPoints(100)

        const curve = new THREE.CatmullRomCurve3(
            this.predictedPoints[1]
        )
        const points = curve.getPoints(200)
        this.mesh.geometry.setFromPoints(
            points
        )
    }
    protected updateMaterial() {}
    protected updateChildren() {}

    // @ts-ignore
    protected override createMesh(): THREE.Line<any, any> {
        return new THREE.Line(
            this.createGeometry(),
            this.createMaterial()
        )
    }

    protected createGeometry() {
        const geo = new THREE.BufferGeometry()
        return geo
    }

    protected createMaterial() {
        const mat = new THREE.LineDashedMaterial({
            color: 0xffffff,
            linewidth: 1,
            scale: 1,
            dashSize: 100,
            gapSize: 300,
        })
        return mat
    }

    private predictPoints(n: number): Vector3[][] {
        for (let i = 0; i < n; i ++) {
            for(let a of this.objects) {
                let current = []
                for (let b of this.objects) {
                    if (a !== b) {
                        a.influence(b)
                        let pos = a.getPos()
                        current.push(new Vector3(
                            pos.x,
                            pos.y,
                            pos.z,
                        ))
                    }
                }
                this.predictedPoints.push(current)
            }
        }

        return this.predictedPoints
    }

    // private getHeaviestObject(): CelestialObject {
    //     let heaviest: CelestialObject = this.objects[0]

    //     this.objects.forEach(_ => {
    //         if (_.getMass() < (heaviest.getMass() || 0))
    //             return

    //         heaviest = _
    //     })

    //     return heaviest
    // }
}
