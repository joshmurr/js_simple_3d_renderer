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

for(let i=0; i<teapot.verts.length; i++){
    teapot.verts[i].y *= -1;
}

let meshes = {
    "octahedron" : octahedron,
    "icosahedron": icosahedron,
    "teapot" : teapot
};

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
gui.button("reset", "Reset");
// Gnarly arrow function to capitalize first letter of mesh in meshes object.
gui.dropdown("mesh", Object.keys(meshes).map(m => m.charAt(0).toUpperCase()+m.slice(1)));

let camera = new Vec3(0,-50,-100);
let scene = new Scene(meshes, camera, gui.getIdList());

let renderer = new Renderer(scene);

function draw(){
    // let time = new Date();
    renderer.render();
    requestAnimationFrame(draw);
}


draw();
