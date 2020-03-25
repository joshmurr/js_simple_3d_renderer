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
icosahedronOrigin.setIdentity();
icosahedron.origin = icosahedronOrigin;

let teapot = new Teapot();
let teapotOrigin = new Mat44();
teapotOrigin.setIdentity();
teapot.origin = teapotOrigin;

let camera = new Vec3(-10, 0, 10);

let scene = new Scene(icosahedron, camera);

let renderer = new Renderer(scene);
renderer.render();
