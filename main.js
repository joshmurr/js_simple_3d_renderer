import * as Utils from './js/math/utils.js';
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
let octahedronOrigin = new Mat44();
octahedronOrigin.setIdentity();
octahedron.origin = octahedronOrigin;


let icosahedron = new Icosahedron();
let icosahedronOrigin = new Mat44();
console.log(icosahedron.verts);
// for(let i=0; i<icosahedron.verts.length/2; i++){
    // icosahedron.verts[i].x *= -1;
    // icosahedron.verts[i].z *= -2;
// }
icosahedronOrigin.setIdentity();
icosahedron.origin = icosahedronOrigin;

let teapot = new Teapot();
let teapotOrigin = new Mat44();
teapotOrigin.setIdentity();
teapot.origin = teapotOrigin;

let camera = new Vec3(0,0,10);

let scene = new Scene(teapot, camera);

let renderer = new Renderer(scene);

var startTime = new Date();
function draw(){
    let time = new Date();
    let elapsedTime = (time - startTime) / 1000;
    renderer.render();
    requestAnimationFrame(draw);
}

draw();
