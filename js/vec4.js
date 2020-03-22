class Vec4{

    /*
     * Length : float
     * LengthSquared : float
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

    constructor(_x, _y, _z, _w=1){
        this.x = _x;
        this.y = _y;
        this.z = _z;
        this.w = _w;
    }
}
