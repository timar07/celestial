import { CelestialObject } from "../model/celestial-object"
import * as THREE from "three"
import { Vector3 } from "three"
import alea from 'alea'
const { createNoise3D } = require('simplex-noise')
import { Atmosphere } from "./elements/atmosphere-subject"
import { Clouds } from "./elements/clouds-mesh"
import { CelestialSubject } from "./celestial-subject"

export class PlanetSubject extends CelestialSubject {
    // private atmosphere
    // private orbit

    constructor(
        scene: THREE.Scene,
        model: CelestialObject
    ) {
        super(scene, model)
        // this.atmosphere = new Atmosphere(scene, model)
        // this.orbit = new OrbitSubject()
    }

    protected updateGeometry(): void {}

    protected updateMaterial(): void {
        // this.mesh.material.color.setHex(
        //     this.model.getColor()
        // );
    }

    protected updateChildren(): void {
        // this.atmosphere.update()
    }

    protected createMaterial() {
        let mat = new THREE.MeshPhysicalMaterial( {
            color: 0xffffff,
            vertexColors: true,
        })
        return mat
    }

    protected createGeometry() {
        const geo = new THREE.IcosahedronGeometry(
            this.model.getRadius(),
            this.getGeometryDetail()
        )
        geo.computeVertexNormals();
        this.modifyGeometry(geo)
        return geo
    }

    private getGeometryDetail() {
        return Math.floor(this.model.getRadius()*0.1)
    }

    private modifyGeometry(geo: any) {
        let vertices = geo.attributes.position.array;
        geo.setAttribute( 'color', new THREE.BufferAttribute( new Float32Array( vertices.length * 3 ), 3 ) );

        this.modifyVertices(geo, vertices)
    }

    private modifyVertices(geo: any, vertices: any) {
        for (let i = 0; i < vertices.length; i += 3) {
            this.modifyVertex(geo, vertices, i)
        }
    }

    private modifyVertex(geo: any, vertices: any, i: number) {
        const vertex = new Vector3(vertices[i], vertices[i+1], vertices[i+2])
        const newVertex = this.transformVertex(vertex)
        vertices[i+0] = newVertex.x
        vertices[i+1] = newVertex.y
        vertices[i+2] = newVertex.z

        this.modifyVertexColor(geo, i, vertex, newVertex)
    }

    private modifyVertexColor(
        geo: any,
        index: number,
        originalVertex: THREE.Vector3,
        newVertex: THREE.Vector3
    ) {
        const heightDelta = this.getHeightDelta(originalVertex, newVertex)
        let color: THREE.Color = this.getLayerColor(heightDelta)
        geo.attributes.color.setXYZ(index+0, color.r, color.g, color.b);
        geo.attributes.color.setXYZ(index+1, color.r, color.g, color.b);
        geo.attributes.color.setXYZ(index+2, color.r, color.g, color.b);
    }

    private getLayerColor(height: number) {
        if (height > 2 && height < 3)
            return new THREE.Color(0xed5364) // Red
        else if (height > 0.6 && height < 2)
            return new THREE.Color(0x63ea48) // Green
        else if (height > 0.4 && height < 0.6)
            return new THREE.Color(0x7156B8) // Violet
        else if (height > 0.2 && height < 0.4)
            return new THREE.Color(0x4E8199) // Gray
        else if (height > -0.5 && height < 0.2)
            return new THREE.Color(0xef5f26) // Orange
        else
            return new THREE.Color(this.model.getColor())
    }

    private getHeightDelta(v1: Vector3, v2: Vector3): number {
        return Math.hypot(
            v1.x - v2.x,
            v1.y - v2.y,
            v1.z - v2.z
        )
    }

    private transformVertex(
        vertex: Vector3,
    ): Vector3 {
        const distortion = this.getVertexDistortion(vertex)
        const norm = this.getNormalizedVector(vertex)
        return new Vector3(
            vertex.x + norm.x * distortion,
            vertex.y + norm.y * distortion,
            vertex.z + norm.z * distortion
        )
    }

    private getVertexDistortion(vec: Vector3) {
       return this.model.getRadius()*this.getRandomHeight('seed', vec, 0.09)
    }

    private getNormalizedVector(vec: Vector3): Vector3 {
        const mag = this.getMagnitude(vec);
        return new THREE.Vector3(vec.x / mag, vec.y / mag, vec.z / mag);
    }

    private getMagnitude(vec: Vector3): number {
        return Math.sqrt(vec.x * vec.x + vec.y * vec.y + vec.z * vec.z)
    }

    private getRandomHeight(
        seed: string,
        vec: Vector3,
        amplitude: number
    ) {
        const noise3d = createNoise3D(alea(seed));
        return noise3d(vec.x/10, vec.y/10, vec.z/10)*amplitude;
    }
}
