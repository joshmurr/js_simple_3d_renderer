class Mat33{

    /*
     * mV[9]
     *
     * SET rows
     * SET columns
     * GET rows
     * GET columns
     *
     * Transpose
     * Translation
     * Rotation (Mat33)
     * Rotation (z, y, x)
     * Rotation (axis, angle)
     * RoatationX(angle)
     * RoatationY(angle)
     * RoatationZ(angle)
     * Scaling (vec3 scale)
     *
     * + - * /
     *
     * Transform : vec3
     *
     * [i, j] : mV[i + 4*j]
     *
     */

    /*
     * SHAPE: COLUMN MAJOR
     *
     * M = [ 0 3 6
     *       1 4 7
     *       2 5 8 ]
     *
     */

    M = []; // Matrix

    constructor(){
        this.zero();
    }

    get M(){
        return this.M;
    }

    setMat(_M){
        try{
            checkLength(_M, 9); // Throws error if wrong length
            for(let i=0; i<9; i++){
                this.M[i] = _M[i];
            }
        } catch(e){
            console.warn(e.message);
        }
    }

    setRows(row0, row1, row2){
        this.M[0] = row0.x;
        this.M[3] = row0.y;
        this.M[6] = row0.z;

        this.M[1] = row1.x;
        this.M[4] = row1.y;
        this.M[7] = row1.z;

        this.M[2] = row2.x;
        this.M[5] = row2.y;
        this.M[8] = row2.z;
    }

    getRow(i){
        try{
            checkSize(i, 3);
            return new Vec3(this.M[i], this.M[i+3], this.M[i+6]);
        } catch(e){
            console.warn(e.message);
        }
    }

    setCols(col0, col1, col2){
        this.M[0] = col0.x;
        this.M[1] = col0.y;
        this.M[2] = col0.z;

        this.M[3] = col1.x;
        this.M[4] = col1.y;
        this.M[5] = col1.z;

        this.M[6] = col2.x;
        this.M[7] = col2.y;
        this.M[8] = col2.z;
    }

    getCol(i){
        try{
            checkSize(i, 3);
            return new Vec3(this.M[3*i], this.M[3*i+1], this.M[3*i+2]);
        } catch(e){
            console.warn(e.message);
        }
    }

    clean(){
        for(let i=0; i<9; i++){
            if(isZero(this.M[i])) this.M[i] = 0;
        }
    }

    setIdentity(){
        this.M[0] = 1;
        this.M[1] = 0;
        this.M[2] = 0;
        this.M[3] = 0;
        this.M[4] = 1;
        this.M[5] = 0;
        this.M[6] = 0;
        this.M[7] = 0;
        this.M[8] = 1;
    }

    zero(){
        for(let i=0; i<9; i++){
            this.M[i] = 0;
        }
    }

    isIdentity(){
        return areEqual(this.M[0], 1) &&
               areEqual(this.M[4], 1) &&
               areEqual(this.M[8], 1) &&
               isZero(this.M[1]) &&
               isZero(this.M[2]) &&
               isZero(this.M[3]) &&
               isZero(this.M[5]) &&
               isZero(this.M[6]) &&
               isZero(this.M[7]);
    }

    isZero(){
        for(let i=0; i<9; i++){
            if(!isZero(this.M[i])) return false;
        }
        return true;
    }


}
