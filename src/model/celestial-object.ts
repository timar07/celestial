export class CelestialObject {
    private settings
    private pos
    private vel

    constructor(
        settings: ObjectSettings,
    ) {
        this.settings = settings
        this.pos = settings.pos
        this.vel = settings.vel
    }

    public getRadius(): number {
        return this.settings.radius ?? this.calculateRadius();
    }
    public getPos(): ObjectPosition { return this.pos }
    public getName(): string { return this.settings.name }
    public getColor(): number { return this.settings.color }
    public getMass(): number { return this.settings.mass }

    public influence(b: CelestialObject): void {
        const a = this
        a.vel = this.getVelocity(a, b);
        a.pos = this.getPosition(a.pos, a.vel)
    }

    private getPosition(a: ObjectPosition, v: ObjectVelocity) {
        const k = 1;
        return {
            x: a.x + v.x*k,
            y: a.y + v.y*k,
            z: a.z + v.z*k,
        }
    }

    private getVelocity(
        a: CelestialObject,
        b: CelestialObject,
    ): Vec3 {
        const d = this.getPositionDifference(a.pos, b.pos)
        const r = this.getDistance(d)
        const acc = this.getAcceleration(b.settings.mass, r)

        return {
            x: a.vel.x + d.x/r*acc,
            y: a.vel.y + d.y/r*acc,
            z: a.vel.z + d.z/r*acc
        }
    }

    private getAcceleration(
        mass: number,
        distanceBetween: number
    ): number {
        return mass / distanceBetween**2
    }

    private calculateRadius(): number {
        return 5 * Math.sqrt(this.settings.mass / Math.PI)
    }

    private getDistance(d: ObjectPosition): number {
        return Math.hypot(d.x, d.y, d.z);
    }

    private getPositionDifference(
        a: ObjectPosition,
        b: ObjectPosition
    ): ObjectPosition {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }
}

export interface ObjectSettings {
    name: string,
    mass: number,
    radius?: number,
    color: number,
    palette?: number[],
    pos: ObjectPosition,
    vel: ObjectVelocity,
}

interface Vec3 {
    x: number,
    y: number,
    z: number
}

export interface ObjectPosition extends Vec3 {}
export interface ObjectVelocity extends Vec3 {}
