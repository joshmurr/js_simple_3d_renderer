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
    guiValues = {};

    constructor(scene, _width, _height){
        // this.guiValues = {};
        this.scene = scene;
        this.findGUIElements(scene.idList);
        this.createCanvas(_width, _height);
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
        
        let d = 1 / Math.tan((_FOV/2) * (Math.PI/180));
        let a = _aspect;
            

        let projMat = new Mat44();
        projMat.M[0]  = d/a;
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = d;
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = _far / (_far - _near);
        projMat.M[11] = -_near*_far / (_far - _near);
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = -1;
        projMat.M[15] = 0;

        return projMat;
    }

    createViewMatrix(_camera, _target=new Vec3(0,0,0), _up=new Vec3(0,1,0)){
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
        let viewMat = new Mat44();
        viewMat.setMat([
            side.x,     up.x,       forward.x, 0,
            side.y,     up.y,       forward.y, 0,
            side.z,     up.z,       forward.z, 0,
            -side.dot(_camera), -up.dot(_camera), forward.dot(_camera), 1
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

    createSimpleProjectionMatrix(_scaleFactor){
        let projMat = new Mat44();
        projMat.setIdentity();
        projMat.M[14] = _scaleFactor;
        projMat.M[15] = _scaleFactor;
        return projMat;
    }

    render(_time){
        let projectionMat = this.createPerspectiveProjectionMatrix(90, this.width/this.height, 0.1, 10);
        let viewMat = this.createViewMatrix(this.scene.camera);

        let MVP = new Mat44();
        MVP.setIdentity();
        MVP.multiplyMat(projectionMat);
        MVP.multiplyMat(viewMat);
        MVP.multiplyMat(this.scene.mesh.getModelMatrix(this.guiValues));

        this.ctx.fillStyle = "rgba(255, 230, 230, 0.5)";
        this.ctx.fillRect(0, 0, this.width, this.height);

        let loopLen = this.scene.mesh.verts.length;

        for(let i=0; i<loopLen; i++){
            let v = this.scene.mesh.verts[i].getCopy();
            let p = MVP.getMultiplyVec(v);
            let z = p.w;
            p.NDC();

            if(z > 0){
                let xScreen = ((p.x + 1)*0.5) * this.width;
                let yScreen = (1-(p.y + 1)*0.5) * this.height;
                this.ctx.fillStyle="rgb("+Math.floor(((p.x + 1)*0.5) * 255)+","+Math.floor((1-(p.y + 1)*0.5) * 255)+","+Math.floor(z)+")";
                this.ctx.beginPath();
                this.ctx.arc(xScreen, yScreen, 8/z, 0, Math.PI*2);
                this.ctx.closePath();
                this.ctx.fill();
                // this.ctx.fillRect(xScreen, yScreen, 32/(z),32/(z));
            }
        }
        MVP.setIdentity();
        this.updateGUIValues();
        this.counter+=0.01;
    }

    createCanvas(_width=window.innerWidth, _height=window.innerHeight){
        if(document.getElementsByName("canvas").length == 1){
            console.log("Canvas found");
        } else {

            let canvas = document.createElement("canvas");
            this.width = _width;
            this.height = _height;
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

    findGUIElements(_idList){
        for(let i=0; i<_idList.length; i++){
            let ele = document.getElementById(_idList[i]);
            this.guiValues[_idList[i]] = parseFloat(ele.value);
        }
        console.log(this.guiValues);
    }

    updateGUIValues(){
        for(let guiElem in this.guiValues){
            if(this.guiValues.hasOwnProperty(guiElem)){
                let ele = document.getElementById(guiElem);
                this.guiValues[guiElem] = parseFloat(ele.value);
            }
        }
    }

}
