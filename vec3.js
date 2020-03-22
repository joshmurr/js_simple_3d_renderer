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
     * * / -- scalar
     *
     * Dot : float
     *
     */

    let smallNum = 0.0000000001;

    constructor(_x, _y, _z){
        this.x = _x;
        this.y = _y;
        this.z = _z;
    }

    // SETTERS
    set x(_x){
        this.x = _x;
    }
    set y(_y){
        this.y = _y;
    }
    set z(_z){
        this.z = _z;
    }

    // GETTERS
    get x(){
        return this.x;
    }
    get y(){
        return this.y;
    }
    get z(){
        return this.z;
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
        return (1 - this.lengthSquared == 0)
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
            this.x /= m;
            this.y /= m;
            this.z /= m;
        }
    }

    dot(v){
        return this.x*v.x + this.y*v.y + this.z*v.z;
    }

    cross(v){
        return new Vec3( this.y*v.z - this.z*v.y, this.z*v.x - this.x*v.z, this.x*v.y - this.y*v.x );
    }

}
