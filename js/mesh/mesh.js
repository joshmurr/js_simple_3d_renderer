import Mat44 from '../math/mat44.js';

export default class Mesh{
    // TODO: createTransformationMatrix : scale -> rotate -> translate

    verts = [];
    faces = [];

    constructor(){

    }

    get verts(){
        return this.verts;
    }

    get faces(){
        return this.faces;
    }

    set verts(v){
        for(let i=0; i<v.length; i++){
            this.verts[i] = v[i];
        }
    }

    set faces(f){
        for(let i=0; i<f.length; i++){
            this.faces[i] = f[i];
        }
    }

    set origin(_M){
        this.Mat = _M;
    }

    get origin(){
        return this.Mat;
    }

    set scale(s){
        this.s = s;
    }

    getModelMatrix(theta){
        let scaleMat = new Mat44();
        scaleMat.setMat([10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 10, 0, 0, 0, 0, 1]);

        let rotXMat = new Mat44();
        rotXMat.setMat([1, 0, 0, 0, 0, Math.cos(theta), Math.sin(theta), 0, 0, -Math.sin(theta), Math.cos(theta), 0, 0, 0, 0, 1]);

        let rotYMat = new Mat44();
        rotYMat.setMat([Math.cos(theta), 0, -Math.sin(theta), 0, 0, 1, 0, 0, Math.sin(theta), 0, Math.cos(theta), 0, 0, 0, 0, 1]);

        let transMat = new Mat44();
        transMat.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, Math.sin(theta)*100,Math.cos(theta)*100,((Math.sin(theta)-2)/2)*-100,1]);

        let modelMatrix = new Mat44();
        modelMatrix.setIdentity();

        modelMatrix.multiplyMat(transMat);
        modelMatrix.multiplyMat(rotXMat);
        // modelMatrix.multiplyMat(rotYMat);
        modelMatrix.multiplyMat(scaleMat);
        return modelMatrix;
    }
}
