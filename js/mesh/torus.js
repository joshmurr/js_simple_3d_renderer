import ParametricMesh from './parametricMesh.js';

export default class Torus extends ParametricMesh {
    constructor(_slices, _segments, _uMin, _uMax, _vMin, _vMax, _c, _a){
        // c - Radius from centre of hole to centre of torus
        // a - Radius of tube
        super(_slices, _segments, _uMin, _uMax, _vMin, _vMax);
        this._c = _c;
        this._a = _a;
    }

    createX(_u, _v){
        let x = (this._c + this._a * Math.cos(_v))*Math.cos(_u);
        return x;
    }
    createY(_u, _v){
        return (this._c + this._a * Math.cos(_v))*Math.sin(_u);
    }
    createZ(_u, _v){
        return this._a * Math.sin(_v);
    }
}
