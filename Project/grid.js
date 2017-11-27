var projection;
var modelview;
var view;
var shownShape = 0;
var cube = [
    // Front face
    -1.0, -1.0,  1.0,
    1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,

    -1.0, -1.0,  1.0,
    1.0,  1.0,  1.0,
    -1.0,  1.0,  1.0,

    // Back face
    -1.0, -1.0, -1.0,
    -1.0,  1.0, -1.0,
    1.0,  1.0, -1.0,

    -1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0, -1.0, -1.0,

    // Top face
    -1.0,  1.0, -1.0,
    -1.0,  1.0,  1.0,
    1.0,  1.0,  1.0,

    -1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0,  1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Right face
    1.0, -1.0, -1.0,
    1.0,  1.0, -1.0,
    1.0,  1.0,  1.0,

    1.0, -1.0, -1.0,
    1.0,  1.0,  1.0,
    1.0, -1.0,  1.0,

    // Left face
    -1.0, -1.0, -1.0,
    -1.0, -1.0,  1.0,
    -1.0,  1.0,  1.0,

    -1.0, -1.0, -1.0,
    -1.0,  1.0,  1.0,
    -1.0,  1.0, -1.0];

var pyramid = [
    // Bottom face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,

    -1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    -1.0, -1.0,  1.0,

    // Front face
    -1.0, -1.0, -1.0,
    1.0, -1.0, -1.0,
    0.0, 1.0, 0.0,

    // Right face
    -1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    0.0, 1.0, 0.0,

    //Left face
    1.0, -1.0, -1.0,
    1.0, -1.0,  1.0,
    0.0, 1.0, 0.0,

    //Back face
];

/* Initialize global WebGL stuff - not object specific */
function initGL(){
    // local variable to hold a reference to an HTML5 canvas
    var canvas = document.getElementById( "gl-canvas" );

    // obtain a WebGL context bound to our canvas
    var gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); // use the whole canvas
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // background color
	gl.enable(gl.DEPTH_TEST);

	// projection = ortho(-10, 10, -10, 10, -10, 10);
    projection = perspective(60, 1,-10, 10);

	modelview = mat4();
    // modelview = rotate(-75, vec3(1,0,0));
    // modelview = mult(modelview, rotate(30, vec3(0,0,1)));

    view = lookAt(vec3(0,0,-2), vec3(0,0,0), vec3(0,1,0));
	
    return gl; // send this back so that other parts of the program can use it
}

/* Load shaders and initialize attribute pointers. */
function loadShaderProgram(gl){
    // use the existing program if given, otherwise use our own defaults
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    program.vposLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( program.vposLoc );
    program.colorLoc = gl.getUniformLocation( program, "color" );
	
	program.projLoc = gl.getUniformLocation(program, "proj");
	program.mvLoc = gl.getUniformLocation(program, "mv");

	program.viewLoc = gl.getUniformLocation(program, "view");


    return program; // send this back so that other parts of the program can use it
}

/* Global render callback to draw all objects */
function renderToContext(drawables, gl){
    // inner-scoped function for closure trickery
    function renderScene(){
        renderToContext(drawables, gl);
    }

    // start from a clean frame buffer for this frame
    gl.clear( gl.COLOR_BUFFER_BIT);

    drawables[shownShape].draw(gl);

    // queue up this same callback for the next frame
    requestAnimFrame(renderScene);
}

/* Constructor for a grid object (initializes the data). */
function Shape(gl, program, color, angle, vertices){
    this.program = program; // save my shader program
    this.color = color; // the color of this grid surface
    this.vertices = vertices; // this array will hold raw vertex positions
    this.vBufferId = gl.createBuffer(); // reserve a buffer object and store a reference to it
	this.angle = angle;
	
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    // pass data to the graphics hardware (convert JS Array to a typed array)
    // gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );


}

/* Method allows an object to render itself */
Shape.prototype.draw = function(gl){
    gl.useProgram( this.program ); // set the current shader programs

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set pos buffer active
    // map position buffer data to the corresponding vertex shader attribute
    gl.vertexAttribPointer( this.program.vposLoc, 3, gl.FLOAT, false, 0 , 0 );

    // send this object's color down to the GPU as a uniform variable
    gl.uniform4fv(this.program.colorLoc, flatten(this.color));

    modelview = mult(modelview, rotate(this.angle, vec3(0,0,1)));

    gl.uniformMatrix4fv(this.program.projLoc, gl.false, flatten(projection));
	gl.uniformMatrix4fv(this.program.mvLoc, gl.false, flatten(modelview));

    gl.uniformMatrix4fv(this.program.view, gl.false, flatten(view));

    // render the primitives!
    // gl.PolygonMode(gl.FRONT_AND_BACK, gl.LINE);
    gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 3);
}

function wingedEdge(){
    document.getElementById("pseudocode").innerHTML = "class WE_Edge {\n" +
        "  WE_Vertex vert1, vert2;\n" +
        "  WE_Face aFace, bFace;\n" +
        "  WE_Edge aPrev, aNext, bPrev, bNext; // clockwise ordering\n" +
        "  WE_EdgeDataObject data;\n" +
        "}\n" +
        "class WE_Vertex {\n" +
        "  List&lt;WE_Edge&gt; edges;\n" +
        "  WE_VertexDataObject data;\n" +
        "}\n" +
        "class WE_Face {\n" +
        "  List&lt;WE_Edge&gt; edges;\n" +
        "  WE_FaceDataObject data;\n" +
        "}";
}

function halfEdge() {
    document.getElementById("pseudocode").innerHTML = "HalfEdge Pseudocode Here";
}

/* Set up event callback to start the application */
window.onload = function(){

    var gl = initGL();
    var prog = loadShaderProgram(gl);

    wingedEdge();

    document.getElementById("wingedEdge").addEventListener("click",function(){
        wingedEdge();
    });

    document.getElementById("halfEdge").addEventListener("click",function(){
        halfEdge();
    });

    document.getElementById("cube").addEventListener("click",function(){
        shownShape = 0;
    });

    document.getElementById("pyramid").addEventListener("click",function(){
        shownShape = 1;
    });

    var drawables = []; // used to store a list of objects that need to be drawn
    drawables.push( new Shape(gl, prog, vec4(0,0,1,1), 1, cube) );
    drawables.push( new Shape(gl, prog, vec4(1,0,0,1), 1, pyramid) );

    renderToContext(drawables, gl); // start drawing the scene
}

