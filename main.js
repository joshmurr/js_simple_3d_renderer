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
import Tetrahedron from './js/mesh/tetrahedron.js';
import Cube from './js/mesh/cube.js';
// import Teapot2 from './js/mesh/teapot2.js';


let octahedron = new Octahedon();
let icosahedron = new Icosahedron();
let tetrahedron = new Tetrahedron();
let cube = new Cube();
let teapot = new Teapot();
// let teapot2 = new Teapot2();

for(let i=0; i<teapot.verts.length; i++){
    teapot.verts[i].y *= -1;
}

let meshes = {
    "octahedron" : octahedron,
    "icosahedron": icosahedron,
    "tetrahedron": tetrahedron,
    "cube": cube,
    // "teapot" : teapot,
    // "teapot2" : teapot2
};

let gui = new GUI();
gui.menu();
gui.title("3D Engine");
gui.title("Model");
gui.title("Drawing Style");
gui.button("points", "Points", 0);
gui.button("wireframe", "Wireframe", 0);
gui.button("faces", "Faces", 1);
gui.title("Translation");
gui.slider("xTrans",-9,10, 0, 0.1);
gui.slider("yTrans",-9,10, 0, 0.1);
gui.slider("zTrans",-9,10, 0, 0.1);
gui.title("Rotation");
gui.slider("xRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("yRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("zRot",-Math.PI, Math.PI, 0, 0.1);
gui.title("Scale");
gui.slider("xScale",1, 4, 1.2, 1);
gui.slider("yScale",1, 4, 1.2, 1);
gui.slider("zScale",1, 4, 1.2, 1);
gui.button("reset", "Reset", 0);
// Gnarly arrow function to capitalize first letter of mesh in meshes object.
gui.dropdown("mesh", Object.keys(meshes).map(m => m.charAt(0).toUpperCase()+m.slice(1)));

let camera = new Vec3(0,0,-15);
let light = new Vec3(-100,-100,100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());

let renderer = new Renderer(scene);

octahedron.computeFaceNormals();
octahedron.colour = new Vec3(30, 130, 250);
icosahedron.computeFaceNormals();
icosahedron.colour = new Vec3(250, 100, 50);
tetrahedron.computeFaceNormals();
tetrahedron.colour = new Vec3(20, 255, 50);
cube.computeFaceNormals();
cube.colour = new Vec3(20, 255, 50);

function draw(){
    // let time = new Date();
    renderer.render();
    requestAnimationFrame(draw);
}


draw();
