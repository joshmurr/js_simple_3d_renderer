class Vec3{

    /*
     * Length : float
     * LengthSquared : float
     * Distance : float
     * DistanceSquared : float
     * Cross : vec3
     *
     * IsUnit : bool
     * IsZero : bool
     *
     * Clean : void - sets near 0 elements to 0
     * Zero : void - sets all elements to 0
     * Normalize : void
     *
     * + -
     * * / (scalar)
     *
     * Dot : float
     *
     */

    x = 0;
    y = 0;
    z = 0;

    constructor(_x, _y, _z){
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    get lengthSquared(){
        return this.x*this.x + this.y*this.y + this.z*this.z;
    }

    get length(){
        return Math.sqrt(this.lengthSquared);
    }

    add(v){
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
    }

    subtract(v){
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
    }

    multiply(s){
        this.x *= s;
        this.y *= s;
        this.z *= s;
    }

    divide(s){
        this.x /= s;
        this.y /= s;
        this.z /= s;
    }

    distanceToSquared(v){
        let x = this.x - v.x;
        let y = this.y - v.y;
        let z = this.z - v.z;

        return x*x + y*y + z*z;
    }

    distanceTo(v){
        return Math.sqrt(this.distanceToSquared(v));
    }

    isUnit(){
        // Checks against small num for lack of precision in normalisation
        return (1 - this.lengthSquared <= smallNum);
    }

    isZero(){
        // If basically 0, set x,y,z to 0
        let ret = this.x <= smallNum && this.y <= smallNum && this.z <= smallNum;
        if(ret) this.zero();
        return ret;
    }

    clean(){
        // Sets values to 0 if nearly 0
        this.x = this.x < smallNum ? 0 : this.x;
        this.y = this.y < smallNum ? 0 : this.y;
        this.z = this.z < smallNum ? 0 : this.z;
    }

    zero(){
        this.x = 0;
        this.y = 0;
        this.z = 0;
    }

    normalize(){
        let lSq = this.lengthSquared;
        if(lSq < smallNum) this.zero();
        else {
            let l = Math.sqrt(lSq);
            this.x /= l;
            this.y /= l;
            this.z /= l;
        }
    }

    dot(v){
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    cross(v){
        return new Vec3( this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x );
    }

}
