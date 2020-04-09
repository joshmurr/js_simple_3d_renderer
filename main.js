import { randomVecRGB } from './js_3d_engine/js/math/utils.js';
import { Vec3 } from './js_3d_engine/js/math/math.js';

import GUI from './js_3d_engine/js/gui/gui.js';

import Renderer from './js_3d_engine/js/render/renderer.js';
import Scene from './js_3d_engine/js/scene/scene.js';

import { Torus, KleinBottle, MobiusTube } from './js_3d_engine/js/mesh/parametricSolid.js';
import { Icosahedron, Cube, Tetrahedron, Octahedron } from './js_3d_engine/js/mesh/platonicSolids.js';
// import { Teapot2 } from './js_3d_engine/js/mesh/miscSolid.js';

let octahedron = new Octahedron();
let icosahedron = new Icosahedron();
let tetrahedron = new Tetrahedron();
let cube = new Cube();
// let teapot2 = new Teapot2();
let torus = new Torus(16, 16, 0, Math.PI*2, 0, Math.PI*2, 2, 1);
let klein = new KleinBottle(16, 32, 0, Math.PI*2, 0, Math.PI*2);
let mobiusTube = new MobiusTube(16, 16, 0, Math.PI*2, 0, Math.PI*2, 1, 2);
// let sineSurface = new SineSurface(32, 32, 0, Math.PI*2, 0, Math.PI*2, 1);
// let eightSurface = new EightSurface(32, 32, 0, Math.PI*2, -Math.PI/2, Math.PI/2);
// let hyperbolicOctahedron = new HyperbolicOctahedron(32, 32, -Math.PI/2, Math.PI/2, -Math.PI, Math.PI);
// let crossCap = new CrossCap(16, 16, 0, Math.PI*2, 0, Math.PI/2);

// createVerts & createFaces need to be called here so that the constructors in the child classes
// can take their extra parameters if they have them.

torus.createVerts();
torus.createFaces();

klein.createVerts();
klein.createFaces();

mobiusTube.createVerts();
mobiusTube.createFaces();

// sineSurface.createVerts();
// sineSurface.createFaces();

// eightSurface.createVerts();
// eightSurface.createFaces();
//
// hyperbolicOctahedron.createVerts();
// hyperbolicOctahedron.createFaces();

// crossCap.createVerts();
// crossCap.createFaces();

// teapot2.createFaces(); // This is a special case to re-format the indices taken from a .OBJ file

let meshes = {
    "Icosahedron": icosahedron,
    "Octahedron" : octahedron,
    "Tetrahedron": tetrahedron,
    "Cube": cube,
    "Torus": torus,
    // "Sine Surface": sineSurface,
    // "Cross Cap": crossCap,
    "Mobius Tube": mobiusTube,
    // "Hyperbolic Octahedron": hyperbolicOctahedron,
    // "Eight Surface": eightSurface,
    "Klein": klein,
    // "Teapot": teapot2,
};

let gui = new GUI();
gui.menu();
gui.title("3D Engine");
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
octahedron.colour = randomVecRGB();

klein.computeFaceNormals();
klein.colour = randomVecRGB();

icosahedron.computeFaceNormals();
icosahedron.colour = randomVecRGB();

tetrahedron.computeFaceNormals();
tetrahedron.colour = randomVecRGB();

cube.computeFaceNormals();
cube.colour = randomVecRGB();

torus.computeFaceNormals();
torus.colour = randomVecRGB();

mobiusTube.computeFaceNormals();
mobiusTube.colour = randomVecRGB();

sineSurface.computeFaceNormals();
sineSurface.colour = randomVecRGB();

// hyperbolicOctahedron.computeFaceNormals();
// hyperbolicOctahedron.colour = randomVecRGB();

// crossCap.computeFaceNormals();
// crossCap.colour = randomVecRGB();

teapot2.computeFaceNormals();
teapot2.colour = randomVecRGB();

function draw(){
    renderer.render();
    requestAnimationFrame(draw);
}
draw();
