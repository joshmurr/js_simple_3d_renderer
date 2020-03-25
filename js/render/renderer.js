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
     * screenMat = [ w/2   0   0  (w/2)+sx
     *                0  -h/s  0  (h/2)+sy
     *                0    0  d/3    d/2
     *                0    0   0      1   ]
     *
     */

    ctx = null;
    w = 0;
    h = 0;

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

        let xymax = _near * Math.tan(_FOV * Math.PI/360);
        let ymin = -xymax;
        let xmin = -xymax;

        let width = xymax - xmin;
        let height = xymax - ymin;

        let depth = _far - _near;
        let q = -(_far + _near) / depth;
        let qn = -2 * (_far * _near) / depth;

        let w = 2 * _near / width;
        w = w / _aspect;
        let h = 2 * _near / height;

        let projMat = new Mat44();

        projMat.M[0]  = w;
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = h;
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = q;
        projMat.M[11] = -1;
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = qn;
        projMat.M[15] = 0;

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
        let side = forward.cross(_up); // Vec3
        let up = side.cross(forward); // Vec3
        forward.normalize();
        side.normalize();
        up.normalize();

        let viewMat = new Mat44();
        // viewMat.setMat([
            // side.x,     side.y,     side.z,     -side.dot(_camera),
            // up.x,       up.y,       up.z,       -up.dot(_camera),
            // -forward.x, -forward.y, -forward.z, forward.dot(_camera),
            // 0,          0,          0,          1
        // ]);
        viewMat.setMat([
            side.x,     up.x,       forward.x, 0,
            side.y,     up.y,       forward.y, 0,
            side.z,     up.z,       forward.z, 0,
            -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
        ]);
        // viewMat.setMat([
            // side.x,             side.y,           side.z,               0,
            // up.x,               up.y,             up.z,                 0,
            // forward.x,         forward.y,       forward.z,           0,
            // -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
        // ]);

        return viewMat;
    }

    createScreenMatrix(){
        let screenMat = new Mat44();

        console.log("w: " + this.w);
        console.log("h: " + this.h);

        let d = 1; // This can be changed to change mapping
        let sx = 0;
        let sy = 0;

        screenMat.M[0] = this.w/2;
        screenMat.M[5] = -this.h/2;
        screenMat.M[10] = d/2;
        screenMat.M[12] = (this.w/2) + sx;
        screenMat.M[13] = (this.h/2) + sy;
        screenMat.M[14] = d/2;
        screenMat.M[15] = 1;

        return screenMat;
    }

    render(){
        let viewMat = this.createViewMatrix(this.scene.camera, new Vec3(0, 0, 0), new Vec3(0, 1, 0));
        let projectionMat = this.createPerspectiveProjectionMatrix(15, this.w/this.h, 10, 200);
        let screenMat = this.createScreenMatrix();

        let MVP = this.scene.mesh.origin;
        MVP.multiplyMat(viewMat);
        // MVP.printProps();
        MVP.multiplyMat(projectionMat);
        // MVP.printProps();


        for(let i=0; i<this.scene.mesh.verts.length; i++){
            let v = this.scene.mesh.verts[i];
            // console.log("Original Vec");
            // console.log(v);

            let MVPv = MVP.getMultiplyVec(v);
            // console.log(MVPv);
            let v_new = new Vec4(MVPv.x/MVPv.w, MVPv.y/MVPv.w, MVPv.z/MVPv.w, MVPv.w/MVPv.w);
            // let v_new = MVPv;
            console.log(v_new);
            // v_new = MVP.getMultiplyVec(v_new);

            // console.log(v_new);

            this.ctx.fillStyle = "rgb(0, 0, 0)";
            this.ctx.fillRect(v_new.x, v_new.y, 2, 2);
            // this.ctx.fillRect(((v_new.x+1)/2)*this.width, ((1-v_new.y)/2)*this.height, 2, 2);

        }

    }

    createCanvas(){
        if(document.getElementsByName("canvas").length == 1){
            console.log("Canvas found");
        } else {
            let canvas = document.createElement("canvas");
            this.w = window.innerWidth;
            this.h = window.innerHeight;
            canvas.width = this.w;
            canvas.height = this.h;

            let body = document.getElementsByTagName("body")[0];
            body.appendChild(canvas);

            this.ctx = canvas.getContext("2d");
            this.ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
            this.ctx.fillRect(100, 100, 200, 200);
            this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
            this.ctx.fillRect(150, 150, 200, 200);
            this.ctx.fillStyle = "rgba(0, 0, 255, 0.2)";
            this.ctx.fillRect(200, 50, 200, 200);
        }
    }
}
