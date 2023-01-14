import { CelestialObject } from "./model/celestial-object"
import { PlanetSubject } from "./subjects/planet-subject"
import { StarSubject } from "./subjects/star-subject"
import * as THREE from "three"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass"
import { Vector2, Vector3 } from "three";
// import { OrbitSubject } from "./subjects/entities/orbit-subject"

export class SceneManager {
    private objects: CelestialObject[] = [
        new CelestialObject({
            name: 'Star',
            mass: 333*333,
            radius: 51.5*3,
            color: 0x76f0f7,
            pos: {
                x: -300,
                y: 0,
                z: -300
            },
            vel: {
                x: 0,
                y: 0,
                z: 0
            }
        }),
        new CelestialObject({
            name: 'Kepler',
            mass: 500*3,
            palette: [0x76f0f7],
            color: 0x76f0f7,
            pos: {
                x: 2000,
                y: 0,
                z: 1000
            },
            vel: {
                x: -4,
                y: 0,
                z: 4
            }
        }),
        new CelestialObject({
            name: 'Kepler',
            mass: 333,
            palette: [0x76f0f7],
            color: 0x76f0f7,
            pos: {
                x: 800,
                y: 0,
                z: 1000
            },
            vel: {
                x: -2,
                y: 0,
                z: 2
            }
        }),
    ]
    private subjects: (PlanetSubject | StarSubject)[]
    private canvas: HTMLCanvasElement
    private scene: THREE.Scene
    private camera: THREE.PerspectiveCamera
    private renderer: THREE.WebGLRenderer
    private controls: OrbitControls

    private composer: EffectComposer
    // @ts-ignore
    private outlinePass: OutlinePass

    // private orbit

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas
        this.renderer = this.buildRender()
        this.camera = this.buildCamera()
        this.scene = this.buildScene()
        this.subjects = this.createSubjects()
        this.controls = this.buildControls()
        this.composer = this.buildComposer()
        this.addLights()
        this.composeEffects()
        // this.orbit = new PridictableOrbitSubject(
        //     this.scene,
        //     this.calculateOrbit()
        // )
    }

    public update() {
        this.updateModel()
        this.updateSubjects()
        this.controls.update()
        this.renderer.render(this.scene, this.camera);
        this.composer.render();
    }

    private updateModel() {
        for(let a of this.objects) {
            for (let b of this.objects) {
                if (a !== b) {
                    a.influence(b)
                }
            }
        }
    }

    private updateSubjects() {
        // this.orbit.update()
        this.subjects.map((_) => _.update())
    }

    private composeEffects() {
        const resolution = new Vector2(window.innerWidth, window.innerHeight)
        this.composer.addPass(new RenderPass(this.scene, this.camera))
        const bloomPass = new UnrealBloomPass(
            resolution,
            2,
            1,
            0
        )
        this.outlinePass = new OutlinePass(
            resolution,
            this.scene,
            this.camera
        )
        this.outlinePass.visibleEdgeColor.set('#ffffff')
        this.outlinePass.hiddenEdgeColor.set('#fefefe')
        this.outlinePass.edgeStrength = 8
        this.outlinePass.edgeThickness = 1.0
        this.outlinePass.pulsePeriod = 0
        this.outlinePass.usePatternTexture = false

        this.composer.addPass( bloomPass )
        this.composer.addPass( this.outlinePass )
    }

    private addLights() {
        let globalLight = new THREE.AmbientLight(0xffffff,0.1);
        globalLight.position.set(-200,-200,-200);
        this.scene.add(globalLight);
    }

    private buildComposer() {
        return new EffectComposer( this.renderer )
    }

    private buildControls() {
        return new OrbitControls( this.camera, this.renderer.domElement );
    }

    private buildScene() {
        let scene = new THREE.Scene();
        scene.background = new THREE.Color(0x000000);
        this.renderer.domElement.id = 'rendererCanvas';
        this.renderer.domElement.addEventListener(
            'mousemove',
            this.handlePlanetHover.bind(this),
            false
        )
        this.renderer.setSize(window.innerWidth,window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        return scene
    }

    private buildRender() {
        let renderer = new THREE.WebGLRenderer({alpha:true,antialias:true});
        renderer.setSize(window.innerWidth,window.innerHeight);
        return renderer
    }

    private buildCamera() {
        let camera = new THREE.PerspectiveCamera(50,window.innerWidth/window.innerHeight,1,10000);
        camera.position.set(0,0,700);
        return camera
    }

    private createSubjects() {
        return this.objects.map(_ => {
            return _.getName() == 'Star' ?
                new StarSubject(this.scene, _):
                new PlanetSubject(this.scene, _)
        })
    }

    private handlePlanetHover(e: MouseEvent) {
        const intersectedObject = this.getIntersectedObject(e)
        this.outlinePass.selectedObjects = intersectedObject ? [intersectedObject] : []
        this.renderer.render(this.scene, this.camera)
    }

    private getIntersectedObject(e: MouseEvent): THREE.Object3D<THREE.Event> | undefined {
        let raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(
            this.getMouseVector(e),
            this.camera
        )
        let mouse = this.getMouseVector(e)
        let intersects = raycaster.intersectObject(this.scene, true);
        return intersects.length > 0 ?
               intersects[0].object:
               undefined
    }

    /**
     * Calculate orbit relative to the heavies object in the scene
     */
    private calculateOrbit(): Vector3[] {
        let a = Object.assign(Object.create(Object.getPrototypeOf(this.objects[1])), this.objects[1])
        let b = this.getHeaviestObject()
        let points: Vector3[] = []

        for (let i = 0; i < 5000; i ++) {
            a.influence(b)
            let pos = a.getPos()
            points.push(new Vector3(
                pos.x,
                pos.y,
                pos.z,
            ))
        }

        return points
    }

    private getHeaviestObject(): CelestialObject {
        let heaviest: CelestialObject = this.objects[0]

        this.objects.forEach(_ => {
            if (_.getMass() < (heaviest.getMass() || 0))
                return

            heaviest = _
        })

        return heaviest
    }

    private getMouseVector(
        event: MouseEvent
    ): THREE.Vector2 {
        let mouse = new THREE.Vector2()
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
        return mouse
    }
}
