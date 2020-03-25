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

    constructor(){

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
        projMat.M[4]  = 0;
        projMat.M[8]  = 0;
        projMat.M[12] = 0;
        projMat.M[1]  = 0;
        projMat.M[5]  = h;
        projMat.M[9]  = 0;
        projMat.M[13] = 0;
        projMat.M[2]  = 0;
        projMat.M[6]  = 0;
        projMat.M[10] = q;
        projMat.M[14] = -1;
        projMat.M[3]  = 0;
        projMat.M[7]  = 0;
        projMat.M[11] = qn;
        projMat.M[15] = 0;

        return projMat;
    }

    createViewMatrix(_camera, _target, _up){
        /*
         * All args : Vec3
         *
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
        viewMat.setMat([
            side.x,     side.y,     side.z,     -side.dot(_camera),
            up.x,       up.y,       up.z,       -up.dot(_camera),
            -forward.x, -forward.y, -forward.z, forward.dot(_camera),
            0,          0,          0,          1
        ]);

        return viewMat;
    }
}
