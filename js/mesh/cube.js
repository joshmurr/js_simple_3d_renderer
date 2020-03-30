import Vec4 from '../math/vec4.js';
import Mesh from './mesh.js';

export default class Cube extends Mesh{
    constructor(){
        super();
        this.faces = [
            [3,0,7],[7,0,4],
            [6,2,3],[6,3,7],
            [7,4,6],[4,5,6],
            [4,0,1],[4,1,5],
            [5,2,6],[5,1,2],
            [2,1,3],[3,1,0]
        ];
        this.verts = [
            new Vec4( 1, 1, 1, 1), // A-0
            new Vec4( 1, 1,-1, 1), // B-1
            new Vec4(-1, 1,-1, 1), // C-2
            new Vec4(-1, 1, 1, 1), // D-3
            new Vec4( 1,-1, 1, 1), // E-4
            new Vec4( 1,-1,-1, 1), // F-5
            new Vec4(-1,-1,-1, 1), // G-6
            new Vec4(-1,-1, 1, 1), // H-7
        ];
    }
}

