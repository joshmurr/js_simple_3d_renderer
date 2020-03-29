export default class Scene {
    constructor(_mesh, _camera, _light, _idList){
        this.mesh = _mesh;
        this.camera = _camera;
        this.light = _light;
        this.idList = _idList;
        // console.log(this.idList);
    }
}
