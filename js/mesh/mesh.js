default export class Mesh{
    constructor(){
        this.verts = [];
        this.faces = [];
        console.log("Mesh Created");
    }

    get verts(){
        return this.verts;
    }

    get faces(){
        return this.faces();
    }

}
