import * as Utils from './utils.js';
import { SimpleTest } from './simpleTest.js';
import { Vec3 } from './vec3.js';
import { Mat33 } from './mat33.js';

// VEC3 -----------------------------------------------------------------
let v = new Vec3(1, -2, 3);
let v_norm = new Vec3(1/Math.sqrt(14), -Math.sqrt(2/7), 3/Math.sqrt(14));
let w = new Vec3(0, 3, -1);
let w_dot = -9;
let w_cross = new Vec3(-7, 1, 3);
let z = new Vec3(10, 10, 10);
z.zero();

let id0 = new Vec3(1, 0, 0);
let id1 = new Vec3(0, 1, 0);
let id2 = new Vec3(0, 0, 1);

// ----------------------------------------------------------------------

// MAT33 ----------------------------------------------------------------
let m1 = new Mat33();
m1.zero();
m1.M[0] = 1; m1.M[4] = 3; m1.M[6] = 2; m1.M[8] = 5;
let m2 = new Mat33();
m2.zero();
m2.M[1] = 1; m2.M[2] = 2; m2.M[3] = 3; m2.M[5] = 4; m2.M[6] = 2;
let m2_inv = new Mat33();
m2_inv.M[2] = 0.5; m2_inv.M[3] = 1; m2_inv.M[4] = -0.5; m2_inv.M[5] = 0.75; m2_inv.M[7] = 0.25; m2_inv.M[8] = -3/8;
let m1_copy = m1.getCopy();
// ----------------------------------------------------------------------

var tester = new SimpleTest();

function test_vec3(){
    tester.test = "vec3";
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

function test_mat33(){
    tester.test = "mat33";
    tester.assert(
        "Check equals to.",
        m1.isEqual(m2),
        false
    );
    tester.assert(
        "Check equals to.",
        m1.isEqual(m1),
        true
    );
    tester.assert(
        "Test getCopy and isEqual.",
        m1_copy.isEqual(m1),
        true
    );

    // Change m1
    m1_copy.M[0] = 666;
    tester.assert(
        "Change copy, check if still isEqual.",
        m1_copy.isEqual(m1),
        false
    );

    // Set to Identity matrix
    m1_copy.setIdentity();
    tester.assert(
        "Check setIdentity and isIdentity.",
        m1_copy.isIdentity(),
        true
    );

    let col0 = m1_copy.getCol(0);
    let col1 = m1_copy.getCol(1);
    let col2 = m1_copy.getCol(2);
    tester.assert(
        "Check col0.",
        col0.isEqual(id0),
        true
    );
    tester.assert(
        "Check col1.",
        col1.isEqual(id1),
        true
    );
    tester.assert(
        "Check col2.",
        col2.isEqual(id2),
        true
    );
    let row0 = m1_copy.getRow(0);
    let row1 = m1_copy.getRow(1);
    let row2 = m1_copy.getRow(2);
    tester.assert(
        "Check row0.",
        row0.isEqual(id0),
        true
    );
    tester.assert(
        "Check row1.",
        row1.isEqual(id1),
        true
    );
    tester.assert(
        "Check row2.",
        row2.isEqual(id2),
        true
    );
        
    let inv = m1.getInverse(m2);
    tester.assert(
        "Test getInverse.",
        inv.isEqual(m2_inv),
        true
    );
    m2.inverse();
    tester.assert(
        "Test inverse.",
        m2.isEqual(m2_inv),
        true
    );
    inv.inverse();
    tester.assert(
        "Test inverse of inverse (original) via the determinant.",
        inv.getDeterminant(),
        8
    );
    
    m2.setMat(inv.M);
    tester.assert(
        "Test setMat via the determinant.",
        m2.getDeterminant(),
        8
    );

    // Get (i,j)
    tester.assert(
        "Test setMat via the determinant.",
        m2.getIJ(0,0),
        0
    );
    tester.assert(
        "Test setMat via the determinant.",
        m2.getIJ(1,0),
        1
    );
    tester.assert(
        "Test setMat via the determinant.",
        m2.getIJ(2,1),
        4
    );
    tester.assert(
        "Test setMat via the determinant.",
        m2.getIJ(3,1),
        undefined
    );
}

function test_utils(){
    tester.test = "utils";
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

// test_vec3();
test_mat33();
console.log(tester.log);
