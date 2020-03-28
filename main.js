import * as Utils from './js/math/utils.js';
import GUI from './js/gui/gui.js';
import Vec3 from './js/math/vec3.js';
import Vec4 from './js/math/vec4.js';
import Mat33 from './js/math/mat33.js';
import Mat44 from './js/math/mat44.js';
import Renderer from './js/render/renderer.js';
import Scene from './js/scene/scene.js';
import Octahedon from './js/mesh/octahedron.js';
import Icosahedron from './js/mesh/icosahedron.js';
import Teapot from './js/mesh/teapot.js';


let octahedron = new Octahedon();
let icosahedron = new Icosahedron();
let teapot = new Teapot();

let gui = new GUI();
gui.menu();
gui.title("3D Engine");
gui.title("Translation");
gui.slider("xTrans",-10,10, 0);
gui.slider("yTrans",-10,10, 0);
gui.slider("zTrans",-10,10, 0);
gui.title("Rotation");
gui.slider("xRot",-Math.PI, Math.PI, 0);
gui.slider("yRot",-Math.PI, Math.PI, 0);
gui.slider("zRot",-Math.PI, Math.PI, 0);
gui.title("Scale");
gui.slider("xScale",-10, 10, 1);
gui.slider("yScale",-10, 10, 1);
gui.slider("zScale",-10, 10, 1);
// gui.button("Button");

let camera = new Vec3(0,-50,-100);
let scene = new Scene(teapot, camera, gui.getIdList());

let renderer = new Renderer(scene, 512, 512);

function draw(){
    let time = new Date();
    renderer.render(time*0.001);
    requestAnimationFrame(draw);
}


draw();
