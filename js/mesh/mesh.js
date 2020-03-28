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

    getModelMatrix(_guiValues){

        let scaleMat = new Mat44();
        scaleMat.setMat([_guiValues["xScale"], 0, 0, 0, 0, _guiValues["yScale"], 0, 0, 0, 0, _guiValues["zScale"], 0, 0, 0, 0, 1]);

        let rotXMat = new Mat44();
        rotXMat.setMat([1, 0, 0, 0, 0, Math.cos(_guiValues["xRot"]), Math.sin(_guiValues["xRot"]), 0, 0, -Math.sin(_guiValues["xRot"]), Math.cos(_guiValues["xRot"]), 0, 0, 0, 0, 1]);

        let rotYMat = new Mat44();
        rotYMat.setMat([Math.cos(_guiValues["yRot"]), 0, -Math.sin(_guiValues["yRot"]), 0, 0, 1, 0, 0, Math.sin(_guiValues["yRot"]), 0, Math.cos(_guiValues["yRot"]), 0, 0, 0, 0, 1]);

        let rotZMat = new Mat44();
        rotZMat.setMat([Math.cos(_guiValues["zRot"]),-Math.sin(_guiValues["zRot"]),0,0, Math.sin(_guiValues["zRot"]),Math.cos(_guiValues["zRot"]),0,0, 0,0,1,0, 0,0,0,1]);

        let transMat = new Mat44();
        transMat.setMat([1,0,0,0, 0,1,0,0, 0,0,1,0, _guiValues["xTrans"],_guiValues["yTrans"],_guiValues["zTrans"],1]);

        let modelMatrix = new Mat44();
        modelMatrix.setIdentity();

        modelMatrix.multiplyMat(transMat);
        modelMatrix.multiplyMat(rotXMat);
        modelMatrix.multiplyMat(rotYMat);
        modelMatrix.multiplyMat(rotZMat);
        modelMatrix.multiplyMat(scaleMat);
        return modelMatrix;
    }
}
