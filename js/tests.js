import * as Utils from './utils.js';
import { SimpleTest } from './simpleTest.js';
import { Vec3 } from './vec3.js';
import { Mat33 } from './mat33.js';

let v = new Vec3(1, -2, 3);
let v_norm = new Vec3(1/Math.sqrt(14), -Math.sqrt(2/7), 3/Math.sqrt(14));
let w = new Vec3(0, 3, -1);
let w_dot = -9;
let w_cross = new Vec3(-7, 1, 3);
let z = new Vec3(10, 10, 10);
z.zero();

let m1 = new Mat33();
m1.zero();
m1.M[0] = 1; m1.M[4] = 3; m1.M[6] = 2; m1.M[8] = 5;
let m2 = new Mat33();
m2.zero();
m2.M[1] = 1; m2.M[2] = 2; m2.M[3] = 3; m2.M[5] = 4; m2.M[6] = 2;

var tester = new SimpleTest();

function test_vec3(){
    tester.assert(
        "Check lengthSquared is correct.",
        v.lengthSquared, 
        14
    );
    tester.assert(
        "Check vector is equal to itself.",
        v.isEqual(new Vec3(1, -2, 3)),
        true
    );

    let norm_test = v.getNormalize();
    tester.assert(
        "Normalisation",
        norm_test.isEqual(v_norm),
        true
    );

    tester.assert(
        "Dot Product",
        Utils.areEqual(v.dot(w), w_dot),
        true
    );

    let cross_test = v.cross(w);
    tester.assert(
        "Cross Product",
        cross_test.isEqual(w_cross),
        true
    );

    tester.assert(
        "Zero function working, and isZero",
        z.isZero(),
        true
    );
        

}

function test_utils(){
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, 1),
        true
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, -1),
        false
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(1, 0),
        false
    );
    tester.assert(
        "Utils.areEqual works",
        Utils.areEqual(-2, -2),
        true
    );
}

test_vec3();
console.log(tester.log);
