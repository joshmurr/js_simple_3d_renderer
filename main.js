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
let torus = new Torus(16, 16, 0, Math.PI*2, 0, Math.PI*2, 2, 1);
let klein = new Klein(16, 32, 0, Math.PI*2, 0, Math.PI*2);
let mobiusTube = new MobiusTube(32, 32, 0, Math.PI*2, 0, Math.PI*2, 1, 2);
let sineSurface = new SineSurface(32, 32, 0, Math.PI*2, 0, Math.PI*2, 1);
let eightSurface = new EightSurface(32, 32, 0, Math.PI*2, -Math.PI/2, Math.PI/2);
let hyperbolicOctahedron = new HyperbolicOctahedron(32, 32, -Math.PI/2, Math.PI/2, -Math.PI, Math.PI);
let crossCap = new CrossCap(16, 16, 0, Math.PI*2, 0, Math.PI/2);

// createVerts & createFaces need to be called here so that the constructors in the child classes
// can take their extra parameters if they have them.

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

teapot2.createFaces(); // This is a special case to re-format the indices taken from a .OBJ file

let meshes = {
    "Icosahedron": icosahedron,
    "Octahedron" : octahedron,
    "Tetrahedron": tetrahedron,
    "Cube": cube,
    "Torus": torus,
    "Sine Surface": sineSurface,
    "Cross Cap": crossCap,
    "Mobius Tube": mobiusTube,
    "Hyperbolic Octahedron": hyperbolicOctahedron,
    "Eight Surface": eightSurface,
    "Klein": klein,
    "Teapot": teapot2,
};

let gui = new GUI();
gui.menu();
gui.title("3D Engine");
gui.title("Model");
gui.title("Drawing Style");
gui.button("colour", "Colour", 0);
gui.button("normals", "Face Normals", 0);
gui.button("points", "Points", 0);
gui.button("wireframe", "Wireframe", 0);
gui.button("face", "Faces", 1);
gui.button("numbers", "Face ID", 0);
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
gui.button("resetColours", "Reset Colours", 0);

let camera = new Vec3(0,0,-15);
let light = new Vec3(-100,-100,100);
light.normalize();
let scene = new Scene(meshes, camera, light, gui.getIdList());

let renderer = new Renderer(scene);
renderer.setup();

octahedron.computeFaceNormals();
octahedron.colour = Utils.randomVecRGB();

klein.computeFaceNormals();
klein.colour = Utils.randomVecRGB();

icosahedron.computeFaceNormals();
icosahedron.colour = Utils.randomVecRGB();

tetrahedron.computeFaceNormals();
tetrahedron.colour = Utils.randomVecRGB();

cube.computeFaceNormals();
cube.colour = Utils.randomVecRGB();

torus.computeFaceNormals();
torus.colour = Utils.randomVecRGB();

mobiusTube.computeFaceNormals();
mobiusTube.colour = Utils.randomVecRGB();

sineSurface.computeFaceNormals();
sineSurface.colour = Utils.randomVecRGB();

hyperbolicOctahedron.computeFaceNormals();
hyperbolicOctahedron.colour = Utils.randomVecRGB();

crossCap.computeFaceNormals();
crossCap.colour = Utils.randomVecRGB();

teapot2.computeFaceNormals();
teapot2.colour = Utils.randomVecRGB();

function draw(){
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
