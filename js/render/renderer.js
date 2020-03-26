import Vec3 from '../math/vec3.js'
import Vec4 from '../math/vec4.js'
import Mat33 from '../math/mat33.js'
import Mat44 from '../math/mat44.js'

export default class Renderer{
    /*
     * Takes a mesh, camera and a projection.
     *
     * Extends each Vec3 to a Vec4, then transforms to clip space.
     *
     * Applies perspective transformation.
     *
     * Applies viewport transform to X and Y.
     *
     * Sorts faces front to back.
     *
     * Compute winding direction?
     *
     * Renders to screen.
     *
     * 1. Mat44 ProjectionMatrix (FOV, Aspect Ratio, Near, Far)
     * 2. Mat44 ViewMatrix       (Camera Pos, Look At, Up)
     * 3. Mat44 ModelMatrix      (Identity - Origin)
     * 4. Mat44 MVP = Projection * View * Model
     *
     *
     */

    ctx = null;
    w = 0;
    h = 0;
    counter = 0;

    constructor(scene){
        this.scene = scene;
        this.createCanvas();
    }

    createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
        /*
         *
         *  https://www.geeks3d.com/20090729/howto-perspective-projection-matrix-in-opengl/
         *  projMat = [ d/a 0   0      0
         *               0  d   0      0
         *               0  0 f/f-n -nf/f-n
         *               0  0  -1      0     ]
         *
         */

        // let xymax = _near * Math.tan(_FOV * Math.PI/360);
        // let ymin = -xymax;
        // let xmin = -xymax;
//
        // let width = xymax - xmin;
        // let height = xymax - ymin;
//
        // let depth = _far - _near;
        // let q = -(_far + _near) / depth;
        // let qn = -2 * (_far * _near) / depth;
//
        // let w = 2 * _near / width;
        // w = w / _aspect;
        // let h = 2 * _near / height;

        // -------------------------
        
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
        // projMat.M[10] = _far/(_far-_near);
        // projMat.M[11] = 1;
        // projMat.M[12]  = 0;
        // projMat.M[13]  = 0;
        // projMat.M[14] = -((_near*_far)/(_far-_near));
        // projMat.M[15] = 0;

        // projMat.M[0]  = w;
        // projMat.M[1]  = 0;
        // projMat.M[2]  = 0;
        // projMat.M[3] = 0;
        // projMat.M[4]  = 0;
        // projMat.M[5]  = h;
        // projMat.M[6]  = 0;
        // projMat.M[7] = 0;
        // projMat.M[8]  = 0;
        // projMat.M[9]  = 0;
        // projMat.M[10] = q;
        // projMat.M[11] = 1;
        // projMat.M[12]  = 0;
        // projMat.M[13]  = 0;
        // projMat.M[14] = qn;
        // projMat.M[15] = 0;

        return projMat;
    }

    createViewMatrix(_camera, _target, _up){
        /*
         * All args : Vec3
         *
         * OpenGl Style (-dir):
         * viewMat = [   ^  ^    ^   ^
         *             side up -dir pos ]
         *
         *
         */

        let forward = _target.getSubtract(_camera); // Vec3
        forward.normalize();
        let side = forward.cross(_up); // Vec3
        side.normalize();
        let up = side.cross(forward); // Vec3
        up.normalize();

        // let viewDir = _target.getSubtract(_camera);
        // viewDir.normalize();
//
        // let viewUpTMP = viewDir.getMultiply(_up.dot(viewDir));
        // let viewUp = _up.getSubtract(viewUpTMP);
//
        // let viewSide = viewDir.cross(viewUp);
//
        // let rotate = new Mat33();
        // viewDir.negate();
        // rotate.setRows(viewSide, viewUp, viewDir);
//
        // let eyeInv = rotate.getMultiplyVec(_camera);
        // eyeInv.negate();
//
        let viewMat = new Mat44();
        // viewMat.setRotationFromMat33(rotate);
        // viewMat.setIJ(0,3, eyeInv.x);
        // viewMat.setIJ(1,3, eyeInv.y);
        // viewMat.setIJ(2,3, eyeInv.z);

        // viewMat.setMat([
        // side.x,     side.y,     side.z,     -side.dot(_camera),
        // up.x,       up.y,       up.z,       -up.dot(_camera),
        // -forward.x, -forward.y, -forward.z, forward.dot(_camera),
        // 0,          0,          0,          1
        // ]);
        // viewMat.setMat([
            // side.x,     up.x,       forward.x, 0,
            // side.y,     up.y,       forward.y, 0,
            // side.z,     up.z,       forward.z, 0,
            // -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
        // ]);
        viewMat.setMat([
            side.x,             side.y,           side.z,               0,
            up.x,               up.y,             up.z,                 0,
            forward.x,         forward.y,       forward.z,           0,
            _camera.x, _camera.y, _camera. z, 1
        ]);

        return viewMat;
    }

    createScreenMatrix(){
        /*
         * screenMat = [ w/2   0   0  (w/2)+sx
         *                0  -h/s  0  (h/2)+sy
         *                0    0  d/2    d/2
         *                0    0   0      1   ]
         *
         */

        let screenMat = new Mat44();

        console.log("w: " + this.width);
        console.log("h: " + this.height);

        let d = 1; // This can be changed to change mapping
        let sx = 0;
        let sy = 0;

        screenMat.M[0] = this.width/2;
        screenMat.M[5] = -this.height/2;
        screenMat.M[10] = d/2;
        screenMat.M[12] = (this.width/2) + sx;
        screenMat.M[13] = (this.height/2) + sy;
        screenMat.M[14] = d/2;
        screenMat.M[15] = 1;

        return screenMat;
    }

    simpleRender(){
        // Renders without calculating view or perspective matrices.
        // Assumes Mesh is at origin.
        // Calculates perspective based on -z value.
        for(let i=0; i<this.scene.mesh.verts.length; i++){
            let v = this.scene.mesh.verts[i].getCopy();;

            v.z -= 2;

            v = v.getNDC();
            v.multiply(100);

            let xNorm = (v.x + (this.width/2)) / this.width;
            let yNorm = (v.y + (this.height/2)) / this.height;
            let xScreen = xNorm * this.width;
            let yScreen = yNorm * this.height;
            // console.log([xScreen, yScreen]);

            this.ctx.fillStyle="black";
            this.ctx.fillRect(xScreen, yScreen, 2, 2);
        }

    }

    render(){
        let viewMat = this.createViewMatrix(this.scene.camera, new Vec3(0, 0, 0), new Vec3(0, 1, 0));
        // let viewMat = new Mat44();
        // viewMat.setIJ(1,3,-10);
        // viewMat.setIJ(2,3,-20);
        // viewMat.transpose();
        // viewMat.printProps();

        let rotationMat = new Mat44();
        rotationMat.rotateX(1);

        // viewMat.printProps();
        // viewMat = viewMat.getAffineInverse(viewMat);
        let projectionMat = this.createPerspectiveProjectionMatrix(120, this.width/this.height, 1, 100);
        // let screenMat = this.createScreenMatrix();

        // projectionMat.printProps();
        let MVP = this.scene.mesh.origin;
        // MVP.multiplyMat(rotationMat);
        // MVP.printProps();
        // MVP.printProps();

        MVP.multiplyMat(viewMat);
        MVP.multiplyMat(projectionMat);
        // console.group("projectionMat");
        MVP.printProps();
        // console.groupEnd();

        // MVP.multiplyMat(screenMat);

        this.ctx.fillStyle = "white";
        this.ctx.fillRect(0, 0, this.width, this.height);

        for(let i=0; i<this.scene.mesh.verts.length; i++){
            let v= this.scene.mesh.verts[i].getCopy();
            // v.printProps();
            // v = rotationMat.getMultiplyVec(v);
            v.multiply(5000);
            // v.printProps();
            let vProj = MVP.getMultiplyVec(v);
            console.log("Projected Point");
            // vProj.printProps();
            // vProj.printProps();
            let vNDC = new Vec4(vProj.x/vProj.w, vProj.y/vProj.w, vProj.z/vProj.w, vProj.w/vProj.w); 
            // vNDC.printProps();

            let xNorm = (vNDC.x + (this.width/2)) / this.width;
            let yNorm = (vNDC.y + (this.height/2)) / this.height;
            let xScreen = xNorm * this.width;
            let yScreen = yNorm * this.height;
            // console.log([xScreen, yScreen]);

            this.ctx.fillStyle="black";
            this.ctx.fillRect(xScreen, yScreen, 2, 2);

        }


        this.counter++;

        // for(let i=0; i<this.scene.mesh.verts.length; i++){
            // let v = this.scene.mesh.verts[i];
            // // console.log("Original Vec");
            // // console.log(v);
//
            // let MVPv = MVP.getMultiplyVec(v);
            // // MVPv.multiply(10);
            // console.group("MVPv");
            // console.log(MVPv);
            // console.groupEnd();
            // let v_new = new Vec4(MVPv.x/MVPv.w, MVPv.y/MVPv.w, MVPv.z/MVPv.w, MVPv.w/MVPv.w);
            // // let v_new = MVPv;
            // // console.log(v_new);
            // // v_new = MVP.getMultiplyVec(v_new);
            // // let v_print = MVP.getMultiplyVec(v_new);
            // console.group("v_new");
            // console.log(v_new);
            // console.groupEnd();
//
//
            // this.ctx.fillStyle = "rgb(0, 0, 0)";
            // // this.ctx.fillRect(v_print.x, v_print.y, 2, 2);
            // // this.ctx.fillRect(v_new.x, v_new.y, 2, 2);
            // this.ctx.fillRect(((v_new.x+1)/2)*this.width, ((1-v_new.y)/2)*this.height, 2, 2);
            // // console.log("x: " + ((v_new.x+1)/2)*this.width);
            // // console.log("y: " + ((1-v_new.y)/2)*this.height);
//
        // }

    }

    createCanvas(){
        if(document.getElementsByName("canvas").length == 1){
            console.log("Canvas found");
        } else {
            let canvas = document.createElement("canvas");
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            canvas.width = this.width;
            canvas.height = this.height;

            let body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);

            this.ctx = canvas.getContext("2d");
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            this.ctx.fillRect(100, 100, 200, 200);
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
            this.ctx.fillRect(150, 150, 200, 200);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
            this.ctx.fillRect(200, 50, 200, 200);

            this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            this.ctx.fillRect(this.width-5, this.height-5, 5, 5);
            this.ctx.fillStyle = "rgba(255, 0, 255, 0.5)";
            this.ctx.fillRect(0, 0, 5, 5);
        }
    }
}