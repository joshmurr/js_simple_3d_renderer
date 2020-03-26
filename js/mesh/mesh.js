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
}
