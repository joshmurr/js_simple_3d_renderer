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
import Teapot2 from './js/mesh/teapot2.js';
import Tetrahedron from './js/mesh/tetrahedron.js';
import Cube from './js/mesh/cube.js';
import Torus from './js/mesh/torus.js';
import Klein from './js/mesh/klein.js';
import MobiusTube from './js/mesh/mobiusTube.js';
import SineSurface from './js/mesh/sineSurface.js';
import EightSurface from './js/mesh/eightSurface.js';
import HyperbolicOctahedron from './js/mesh/hyperbolicOctahedron.js';
import CrossCap from './js/mesh/crossCap.js';
import BohemianDome from './js/mesh/bohemianDome.js';

let octahedron = new Octahedon();
let icosahedron = new Icosahedron();
let tetrahedron = new Tetrahedron();
let cube = new Cube();
let teapot = new Teapot();
let teapot2 = new Teapot2();
let torus = new Torus(8, 8, 0, Math.PI*2, 0, Math.PI*2, 2, 1);
let klein = new Klein(16, 32, 0, Math.PI*2, 0, Math.PI*2);
let mobiusTube = new MobiusTube(16, 16, 0, Math.PI*2, 0, Math.PI*2, 1.5, 3);
let sineSurface = new SineSurface(16, 16, 0, Math.PI*2, 0, Math.PI*2, 3);
let eightSurface = new EightSurface(16, 16, 0, Math.PI*2, -Math.PI/2, Math.PI/2);
let hyperbolicOctahedron = new HyperbolicOctahedron(16, 16, -Math.PI/2, Math.PI/2, -Math.PI, Math.PI);
let crossCap = new CrossCap(16, 16, 0, Math.PI*2, 0, Math.PI/2);

torus.createVerts();
torus.createFaces();
klein.createVerts();
klein.createFaces();
mobiusTube.createVerts();
mobiusTube.createFaces();
sineSurface.createVerts();
sineSurface.createFaces();
eightSurface.createVerts();
eightSurface.createFaces();
hyperbolicOctahedron.createVerts();
hyperbolicOctahedron.createFaces();
crossCap.createVerts();
crossCap.createFaces();

teapot2.createFaces();



let meshes = {
    "Icosahedron": icosahedron,
    "Teapot": teapot2,
    "Cross Cap": crossCap,
    "Hyperbolic Octahedron": hyperbolicOctahedron,
    "Eight Surface": eightSurface,
    "Sine Surface": sineSurface,
    "Mobius Tube": mobiusTube,
    "Klein": klein,
    "Torus": torus,
    "Octahedron" : octahedron,
    "Tetrahedron": tetrahedron,
    "Cube": cube,
};

let gui = new GUI();
gui.menu();
gui.title("3D Engine");
gui.title("Model");
gui.title("Drawing Style");
gui.button("points", "Points", 1);
gui.button("wireframe", "Wireframe", 1);
gui.button("face", "Faces", 0);
gui.button("numbers", "Numbers", 1);
gui.title("Translation");
gui.slider("xTrans",-9,10, 0, 0.1);
gui.slider("yTrans",-9,10, 0, 0.1);
gui.slider("zTrans",-9,10, 0, 0.1);
gui.title("Rotation");
gui.slider("xRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("yRot",-Math.PI, Math.PI, 0, 0.1);
gui.slider("zRot",-Math.PI, Math.PI, 0, 0.1);
gui.title("Scale");
gui.slider("xScale",0.2, 4, 1.2, 0.2);
gui.slider("yScale",0.2, 4, 1.2, 0.2);
gui.slider("zScale",0.2, 4, 1.2, 0.2);
gui.button("reset", "Reset", 0);
gui.dropdown("mesh", Object.keys(meshes));//.map(m => m.charAt(0).toUpperCase()+m.slice(1)));

let camera = new Vec3(0,0,-15);
let light = new Vec3(-100,-100,100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());

let renderer = new Renderer(scene);
renderer.setup();

octahedron.computeFaceNormals();
octahedron.colour = new Vec3(30, 130, 250);
icosahedron.computeFaceNormals();
icosahedron.colour = new Vec3(250, 100, 50);
tetrahedron.computeFaceNormals();
tetrahedron.colour = new Vec3(20, 255, 50);
cube.computeFaceNormals();
cube.colour = new Vec3(20, 255, 50);
torus.computeFaceNormals();
torus.colour = new Vec3(20, 20, 255);
mobiusTube.computeFaceNormals();
sineSurface.computeFaceNormals();
sineSurface.colour = new Vec3(128,128,0);
hyperbolicOctahedron.computeFaceNormals();
crossCap.computeFaceNormals();
teapot2.computeFaceNormals();
teapot2.colour = new Vec3(24, 22, 250);

function draw(){
    // let time = new Date();
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
