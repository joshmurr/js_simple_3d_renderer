import { Vec3 } from './js/vec3.js';
import { Mat33 } from './js/mat33.js';

let v = new Vec3(1, -2, 3);
let m1 = new Mat33();
m1.zero();
m1.M[0] = 1; m1.M[4] = 3; m1.M[6] = 2; m1.M[8] = 5;
let m2 = new Mat33();
m2.zero();
m2.M[1] = 1; m2.M[2] = 2; m2.M[3] = 3; m2.M[5] = 4; m2.M[6] = 2;

console.log(v);
console.log(m1);
console.log(m2);
