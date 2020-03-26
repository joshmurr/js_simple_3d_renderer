import Vec4 from '../math/vec4.js';
import Mat44 from '../math/mat44.js';

var width = 512;
var height = 512;

var canvas = document.createElement("canvas");
// this.width = window.innerWidth;
// this.height = window.innerHeight;
canvas.width = width;
canvas.height = height;

var body = document.getElementsByTagName("body")[0];
body.appendChild(canvas);

var ctx = canvas.getContext("2d");
ctx.fillStyle = "rgba(255,0,0,0.2)";
ctx.fillRect(0, 0, width, height);

var points = [
    new Vec4(-0.5,  0.5, -0.5, 1),
    new Vec4( 0.5,  0.5, -0.5, 1),
    new Vec4( 0.5,  0.5,  0.5, 1),
    new Vec4(-0.5,  0.5,  0.5, 1),
    new Vec4(-0.5, -0.5, -0.5, 1),
    new Vec4( 0.5, -0.5, -0.5, 1),
    new Vec4( 0.5, -0.5,  0.5, 1),
    new Vec4(-0.5, -0.5,  0.5, 1)
];

function createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
    let d = 1 / Math.tan((_FOV/2) * (Math.PI/180));
    let a = _aspect;
    

    let projMat = new Mat44();
    projMat.M[0]  = d;//\/a;
    projMat.M[1]  = 0;
    projMat.M[2]  = 0;
    projMat.M[3] = 0;
    projMat.M[4]  = 0;
    projMat.M[5]  = d;
    projMat.M[6]  = 0;
    projMat.M[7] = 0;
    projMat.M[8]  = 0;
    projMat.M[9]  = 0;
    projMat.M[10] = -_far/(_far-_near);
    projMat.M[11] = -1;
    projMat.M[12]  = 0;
    projMat.M[13]  = 0;
    projMat.M[14] = -(_far*_near)/(_far-_near);
    projMat.M[15] = 0;

    return projMat;
}
let theta = 1;
let transform = new Mat44();
transform.M[0] = 1;
transform.M[5] = Math.cos(theta);
transform.M[6] = Math.sin(theta);
transform.M[9] = -Math.sin(theta);
transform.M[10] = Math.cos(theta);
transform.M[15] = 1;

let transform2 = new Mat44();
transform2.M[0] = Math.cos(theta);
transform2.M[2] = -Math.sin(theta);
transform2.M[5] = 1;
transform2.M[8] = Math.sin(theta);
transform2.M[10] = Math.cos(theta);
transform2.M[15] = 1;

// Manip Points
    for(let i=0; i<points.length; i++){

        let tmp = points[i].getCopy();
        tmp.x*=30;
        tmp.y*=50;
        points[i] = tmp;

    }
function updatePoints(){
    for(let i=0; i<points.length; i++){

        let tmp = points[i].getCopy();
        tmp = transform.getMultiplyVec(tmp);
        tmp = transform2.getMultiplyVec(tmp);
        points[i] = tmp;

    }
}

let perspMatrix = createPerspectiveProjectionMatrix(90, 1, 1, 100);
perspMatrix.printProps();


function draw(){

    let identity = new Mat44();
    identity.setIdentity();
    // console.log(points);
    // transform.printProps();

    let localToWorld = identity.getCopy();
    // worldTransformPoint.printProps();

    let transformInverse = identity.getAffineInverse();
    // transform.printProps();

    // let localTransformPoint = transformInverse.getMultiplyVec(localToWorldPoint);
    // localTransformPoint.printProps();

    let cameraToWorld = identity.getCopy();
    let worldToCamera = cameraToWorld.getAffineInverse();

    updatePoints();
    ctx.fillStyle = "rgba(255,224,224,0.1)";
    ctx.fillRect(0, 0, width, height);

    for(let i=0; i<points.length; i++){
        // points[i].printProps();
        // points2[i] = transform.getMultiplyVec(points2[i]);
        let p = points[i].getCopy();
        // p.multiply(100);
        let localToWorldPoint = localToWorld.getMultiplyVec(points[i]);
        // localToWorldPoint.printProps();
        let worldToCameraPoint = cameraToWorld.getMultiplyVec(localToWorldPoint);
        let cameraToScreenPoint = perspMatrix.getMultiplyVec(worldToCameraPoint);
        // cameraToScreenPoint.multiply(100);

        let xNorm = (cameraToScreenPoint.x + (width/2)) / width;
        let yNorm = (cameraToScreenPoint.y + (height/2)) / height;
        let xScreen = xNorm * width;
        let yScreen = yNorm * height;
        // console.log([xScreen, yScreen]);

        ctx.fillStyle="black";
        ctx.fillRect(xScreen, yScreen, 2, 2);
    }
    theta += 0.01;
    requestAnimationFrame(draw);
}

draw();
/*

for(let i=0; i<points.length; i++){
    let xProj = points[i][0] / -points[i][2];
    let yProj = points[i][1] / -points[i][2];
    let xRemap  = (1 + xProj) / 2;
    let yRemap  = (1 + yProj) / 2;
    let xScreen = xRemap * width;
    let yScreen = yRemap * height;

    console.log([xScreen, yScreen]);

    ctx.fillStyle="black";
    ctx.fillRect(xScreen, yScreen, 2, 2);
}

    */
