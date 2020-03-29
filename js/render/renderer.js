import Vec3 from '../math/vec3.js'
import Vec4 from '../math/vec4.js'
import Mat33 from '../math/mat33.js'
import Mat44 from '../math/mat44.js'

export default class Renderer{
    ctx = null;
    w = 0;
    h = 0;
    counter = 0;
    guiValues = {};
    guiValuesRESET = {};

    constructor(scene, _width, _height){
        // this.guiValues = {};
        this.scene = scene;
        this.findGUIElements(scene.idList);
        this.createCanvas(_width, _height);
    }


    createPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
        /*
         *  https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
         *
         *  projMat = [ d/a 0    0      0
         *               0  d    0      0
         *               0  0   f/f-n  -1
         *               0  0 -nf/f-n   0 ]
         *
         */
        
        let scale = 1 / Math.tan((_FOV/2) * (Math.PI/180));

        let projMat = new Mat44();
        projMat.M[0]  = scale;
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = scale;
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = _far / (_far - _near);
        projMat.M[11] = _near*_far / (_far - _near);
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = -1;
        projMat.M[15] = 0;

        return projMat;
    }

    createOpenGLPerspectiveProjectionMatrix(_FOV, _aspect, _near, _far){
        /*
         *  https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix
         *
         *  projMat = [ 2n/r-l   0     r+l/r-l     0
         *                 0   2n/t-b  t+b/t-b     0
         *                 0     0    -f+n/f-n -2nf/f-n
         *                 0     0       -1        0     ]
         *
         */
        
        let scale = _near * Math.tan((_FOV/2) * (Math.PI/180));
        let right = _aspect * scale;
        let left  = -right;
        let top_  = scale; // 'top' is a keyword apparently
        let bottom = -top_;

        let projMat = new Mat44();
        projMat.M[0]  = 2*_near/(right-left);
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = 2*_near/(top_-bottom);
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = (right+left)/(right-left);
        projMat.M[9]  = (top_+bottom)/(top_-bottom);
        projMat.M[10] = -(_far+_near) / (_far - _near);
        projMat.M[11] = -2*_near*_far / (_far - _near);
        projMat.M[12]  = 0;
        projMat.M[13]  = 0;
        projMat.M[14] = -1;
        projMat.M[15] = 0;

        return projMat;
    }

    createOpenGLOrthographicProjectionMatrix(_near, _far){
        /*
         * https://www.scratchapixel.com/lessons/3d-basic-rendering/perspective-and-orthographic-projection-matrix/orthographic-projection-matrix
         *
         *  projMat = [ 2/r-l   0      0    -(r+l/r-l)
         *                0   2/t-b    0    -(t+b/t-b)
         *                0     0   -2/f-n   -f+n/f-n 
         *                0     0      0         1       ]
         *
         */

        // b t l r near far all computed differently to Perspective Matrix...
        
        // let scale = _near * Math.tan((_FOV/2) * (Math.PI/180));
        // let right = _aspect * scale;
        // let left  = -right;
        // let top_  = scale; // 'top' is a keyword apparently
        // let bottom = -top_;

        let projMat = new Mat44();
        projMat.M[0]  = 2/(right-left);
        projMat.M[1]  = 0;
        projMat.M[2]  = 0;
        projMat.M[3] = 0;
        projMat.M[4]  = 0;
        projMat.M[5]  = 2/(top_-bottom);
        projMat.M[6]  = 0;
        projMat.M[7] = 0;
        projMat.M[8]  = 0;
        projMat.M[9]  = 0;
        projMat.M[10] = -2 / (_far - _near);
        projMat.M[11] = 0;
        projMat.M[12]  = -(right+left)/(right-left);
        projMat.M[13]  = -(top_+bottom)/(top_-bottom);
        projMat.M[14] = -(_far+_near)/(_far-_near);
        projMat.M[15] = 1;

        return projMat;
    }

    createViewMatrix(_camera, _target=new Vec3(0,0,0), _up=new Vec3(0,1,0)){
        /*
         * OpenGl Style (-dir):
         * viewMat = [   ^  ^    ^   ^
         *             side up -dir pos ]
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

    render(_style){
        let projectionMat = this.createOpenGLPerspectiveProjectionMatrix(90, this.width/this.height, 0.1, 100);
        // let projectionMat = this.createOpenGLOrthographicProjectionMatrix(90, this.width/this.height, 0.1, 100);
        let viewMat = this.createViewMatrix(this.scene.camera);

        let mesh = this.scene.mesh[this.guiValues["mesh"]];

        let MVP = new Mat44();
        MVP.setIdentity();
        MVP.multiplyMat(projectionMat);
        MVP.multiplyMat(viewMat);
        MVP.multiplyMat(mesh.getModelMatrix(this.guiValues));

        this.ctx.fillStyle = "rgba(255, 230, 230, 0.5)";
        this.ctx.fillRect(0, 0, this.width, this.height);

        // POINTS ---------------------------------------------------------
        if(_style == "points"){
            let loopLen = mesh.verts.length;

            for(let i=0; i<loopLen; i++){
                let v = mesh.verts[i].getCopy();
                let p = MVP.getMultiplyVec(v);
                let z = p.w;
                p.NDC();

                if(z > 0){
                    let xScreen = ((p.x + 1)*0.5) * this.width;
                    let yScreen = (1-(p.y + 1)*0.5) * this.height;
                    this.ctx.fillStyle="rgb("+Math.floor(((p.x + 1)*0.5) * 255)+","+Math.floor((1-(p.y + 1)*0.5) * 255)+","+Math.floor(z)+")";
                    this.ctx.beginPath();
                    this.ctx.arc(xScreen, yScreen, 32/z, 0, Math.PI*2);
                    this.ctx.closePath();
                    this.ctx.fill();
                    // this.ctx.fillRect(xScreen, yScreen, 32/(z),32/(z));
                }
            }
        }
        // WIREFRAME ------------------------------------------------------
        else if(_style == "wireframe"){
            let loopLen = mesh.faces.length;

            for(let i=0; i<loopLen; i++){
                let face = mesh.faces[i];

                this.ctx.beginPath();
                for(let j=0; j<face.length; j++){
                    let v = mesh.verts[face[j]].getCopy();
                    let p = MVP.getMultiplyVec(v);
                    let z = p.w;
                    p.NDC();

                    if(z > 0){
                        let xScreen = ((p.x + 1)*0.5) * this.width;
                        let yScreen = (1-(p.y + 1)*0.5) * this.height;
                        this.ctx.strokeStyle="rgb("+Math.floor(((p.x + 1)*0.5) * 255)+","+Math.floor((1-(p.y + 1)*0.5) * 255)+","+Math.floor(z)+")";
                        this.ctx.lineWidth = 8/z;
                        this.ctx.lineTo(xScreen, yScreen);
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }

        }
        // FACES ----------------------------------------------------------
        else if(_style == "faces"){
            // Store the <centroid.z, face> map for later sorting
            let faces_unordered = new Map();
            for(let i=0; i<mesh.faces.length; i++){
                let face = mesh.faces[i];

                // COMPUTE CENTROID --------
                let sum = new Vec4(0,0,0,0);
                for(let j=0; j<face.length; j++){
                    let v = mesh.verts[face[j]].getCopy();
                    let p = MVP.getMultiplyVec(v);
                    sum.add(p);
                }
                sum.divide(face.length);
                // Store in map
                faces_unordered.set(sum.z, face);
            }

            // ORDER FACES BY CENTROID.Z ------------
            // Rather than making a new map, the sorted faces are stored in an array
            let faces_sorted = [];
            function sort_faces_into_array(value, key, map){
                faces_sorted.push(map.get(key));
            }
            // An arrow function to sort the map by key
            // Arrow functions are SO hard to read..
            // https://stackoverflow.com/questions/37982476/how-to-sort-a-map-by-value-in-javascript
            const faces_ordered = new Map([...faces_unordered.entries()].sort((a,b) => b[0] - a[0]));
            // sort_faces_into_array is a callback function which takes (value, key, map)
            // I presume automatically
            faces_ordered.forEach(sort_faces_into_array);
            // Faces are now sorted back to front!

            // ------------------------
            for(let i=0; i<faces_sorted.length; i++){
                let face = faces_sorted[i];
                    this.ctx.beginPath();
                    let xScreen, yScreen;
                    for(let j=0; j<face.length; j++){
                    
                        let v = mesh.verts[face[j]].getCopy();
                        let p = MVP.getMultiplyVec(v);
                        let z = p.w;
                        p.NDC();

                        if(z > 0){
                            xScreen = ((p.x + 1)*0.5) * this.width;
                            yScreen = (1-(p.y + 1)*0.5) * this.height;
                            this.ctx.lineTo(xScreen, yScreen);
                        }
                    this.ctx.fillStyle="rgb("+Math.floor(((p.x + 1)*0.5) * 255)+","+Math.floor((1-(p.y + 1)*0.5) * 255)+","+Math.floor(z)+")";
                    }
                    this.ctx.closePath();
                    this.ctx.fill();
                }
        }
        // WIREFRAME FOR TEAPOT2 OBJ FILE INDICES--------------------------
        else if(_style == "teapot2"){
            let loopLen = mesh.faces.length-42;

            for(let i=0; i<loopLen; i+=3){
                this.ctx.beginPath();
                for(let j=0; j<3; j++){
                    let face = mesh.faces[i+j];
                    let v = mesh.verts[face[0]].getCopy();
                    let p = MVP.getMultiplyVec(v);
                    let z = p.w;
                    p.NDC();

                    if(z > 0){
                        let xScreen = ((p.x + 1)*0.5) * this.width;
                        let yScreen = (1-(p.y + 1)*0.5) * this.height;
                        this.ctx.strokeStyle="rgb("+Math.floor(((p.x + 1)*0.5) * 255)+","+Math.floor((1-(p.y + 1)*0.5) * 255)+","+Math.floor(z)+")";
                        this.ctx.lineWidth = 8/z;
                        this.ctx.lineTo(xScreen, yScreen);
                        // this.ctx.fill();
                    }
                }
                this.ctx.closePath();
                this.ctx.stroke();
            }

        }
        // ----------------------------------------------------------------
        if(this.guiValues["reset"]){
            for(let guiElem in this.guiValues){
                let ele = document.getElementById(guiElem);
                ele.value = this.guiValuesRESET[guiElem];
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
            if(ele.type == "submit") {
                this.guiValues[_idList[i]] = parseInt(ele.value);
                this.guiValuesRESET[_idList[i]] = parseInt(ele.value);
            }
            if(ele.type == "range") {
                this.guiValues[_idList[i]] = parseFloat(ele.value);
                this.guiValuesRESET[_idList[i]] = parseFloat(ele.value);
            }
            if(ele.type == "select-one"){
                this.guiValues[_idList[i]] = ele.options[ele.selectedIndex].value;    
                this.guiValuesRESET[_idList[i]] = ele.options[ele.selectedIndex].value;    
            }
        }
        // console.log(this.guiValues);
    }

    updateGUIValues(){
        for(let guiElem in this.guiValues){
            if(this.guiValues.hasOwnProperty(guiElem)){
                let ele = document.getElementById(guiElem);
                if(ele.type == "submit") {
                    this.guiValues[guiElem] = parseInt(ele.value);
                }
                if(ele.type == "range") this.guiValues[guiElem] = parseFloat(ele.value);
                if(ele.type == "select-one"){
                    this.guiValues[guiElem] = ele.options[ele.selectedIndex].value;    
                }
            }
        }
    }

}
