import Mesh from './mesh.js';

default export class Icosahedron extends Mesh{
    constructor(){
        super();
        this.faces = [
            (0, 1, 2),
            (0, 2, 3),
            (0, 3, 4),
            (0, 4, 5),
            (0, 5, 1),
            (11, 7, 6),
            (11, 8, 7),
            (11, 9, 8),
            (11, 10, 9),
            (11, 6, 10),
            (1, 6, 2),
            (2, 7, 3),
            (3, 8, 4),
            (4, 9, 5),
            (5, 10, 1),
            (6, 7, 2),
            (7, 8, 3),
            (8, 9, 4),
            (9, 10, 5),
            (10, 6, 1) ];
        this.verts = [
            (0.000, 0.000, 1.000),
            (0.894, 0.000, 0.447),
            (0.276, 0.851, 0.447),
            (-0.724, 0.526, 0.447),
            (-0.724, -0.526, 0.447),
            (0.276, -0.851, 0.447),
            (0.724, 0.526, -0.447),
            (-0.276, 0.851, -0.447),
            (-0.894, 0.000, -0.447),
            (-0.276, -0.851, -0.447),
            (0.724, -0.526, -0.447),
            (0.000, 0.000, -1.000),
        ];
        console.log("Icosahedron Created");
    }
}


