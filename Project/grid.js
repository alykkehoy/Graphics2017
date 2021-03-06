var projection;
var modelview;
var view;
var shownShape = 0;
var numTriangles = 12;
var mode = 0;
var face;
var startTime = Date.now();
var cubeLines =[
    -1.0, -1.0,  1.0, 0.0,
    1.0,  1.0,  1.0, 0.0,

    1.0,  1.0,  1.0, 1.0,
    -1.0,  1.0,  1.0, 1.0,

    -1.0,  1.0, -1.0, 2.0,
    1.0,  1.0,  1.0, 2.0,

    1.0,  1.0,  1.0, 3.0,
    1.0,  1.0, -1.0, 3.0,

    1.0, -1.0, -1.0, 4.0,
    1.0,  1.0,  1.0, 4.0,

    1.0, -1.0, -1.0, 5.0,
    1.0, -1.0,  1.0, 5.0,

    -1.0, -1.0, -1.0, 6.0,
    1.0, -1.0,  -1.0, 6.0,

    1.0, 1.0, -1.0, 7.0,
    -1.0, -1.0, -1.0, 7.0,

    -1.0, -1.0, -1.0, 8.0,
    -1.0,  1.0, -1.0, 8.0,

    -1.0, -1.0, -1.0, 9.0,
    -1.0,  1.0,  1.0, 9.0,

    -1.0, -1.0, -1.0, 10.0,
    -1.0, -1.0,  1.0, 10.0,

    1.0, -1.0,  1.0, 11.0,
    -1.0, -1.0, 1.0, 11.0,
];
var cube = [
    // Front face
    -1.0, -1.0,  1.0, 0.0,
    1.0, -1.0,  1.0, 0.0,
    1.0,  1.0,  1.0, 0.0,

    -1.0, -1.0,  1.0, 1.0,
    1.0,  1.0,  1.0, 1.0,
    -1.0,  1.0,  1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, 7.0,
    1.0,  1.0, -1.0, 7.0,
    1.0, -1.0, -1.0, 7.0,

    -1.0, -1.0, -1.0, 8.0,
    -1.0,  1.0, -1.0, 8.0,
    1.0,  1.0, -1.0, 8.0,

    // Top face
    -1.0,  1.0, -1.0, 2.0,
    -1.0,  1.0,  1.0, 2.0,
    1.0,  1.0,  1.0, 2.0,

    -1.0,  1.0, -1.0, 3.0,
    1.0,  1.0,  1.0, 3.0,
    1.0,  1.0, -1.0, 3.0,

    // Bottom face
    -1.0, -1.0, -1.0, 6.0,
    1.0, -1.0, -1.0, 6.0,
    1.0, -1.0,  1.0, 6.0,

    -1.0, -1.0, -1.0, 11.0,
    1.0, -1.0,  1.0, 11.0,
    -1.0, -1.0, 1.0, 11.0,

    // Right face
    1.0, -1.0, -1.0, 4.0,
    1.0,  1.0, -1.0, 4.0,
    1.0,  1.0,  1.0, 4.0,

    1.0, -1.0, -1.0, 5.0,
    1.0,  1.0,  1.0, 5.0,
    1.0, -1.0,  1.0, 5.0,

    // // Left face
    -1.0, -1.0, -1.0, 9.0,
    -1.0,  1.0,  1.0, 9.0,
    -1.0,  1.0, -1.0, 9.0,

    -1.0, -1.0, -1.0, 10.0,
    -1.0, -1.0,  1.0, 10.0,
    -1.0,  1.0,  1.0, 10.0
];

var pyramideLines = [
    -1.0, -1.0, -1.0, 0.0,
    1.0, -1.0,  1.0, 0.0,

    -1.0, -1.0, -1.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,

    -1.0, -1.0,  1.0, 2.0,
    0.0, 1.0, 0.0, 2.0,

    1.0, -1.0,  1.0, 3.0,
    0.0, 1.0, 0.0,  3.0,

    1.0, -1.0, -1.0, 4.0,
    0.0, 1.0, 0.0,  4.0,

    -1.0, -1.0, -1.0, 5.0,
    1.0, -1.0, -1.0, 5.0
];
var pyramid = [
    // Bottom face
    -1.0, -1.0, -1.0, 0.0,
    1.0, -1.0, -1.0, 0.0,
    1.0, -1.0,  1.0, 0.0,

    -1.0, -1.0, -1.0, 1.0,
    1.0, -1.0,  1.0, 1.0,
    -1.0, -1.0,  1.0, 1.0,

    // Front face
    -1.0, -1.0, -1.0, 5.0,
    1.0, -1.0, -1.0, 5.0,
    0.0, 1.0, 0.0, 5.0,

    // Right face
    -1.0, -1.0, -1.0, 2.0,
    -1.0, -1.0,  1.0, 2.0,
    0.0, 1.0, 0.0, 2.0,

    //Left face
    1.0, -1.0, -1.0, 4.0,
    1.0, -1.0,  1.0, 4.0,
    0.0, 1.0, 0.0,  4.0,

    //Back face
    -1.0, -1.0,  1.0, 3.0,
    1.0, -1.0,  1.0, 3.0,
    0.0, 1.0, 0.0,  3.0

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

    projection = perspective(60, 1, 0.1, 10);

	modelview = mat4();
    modelview = mult(modelview, rotate(30, vec3(1,0,0)));

    view = lookAt(vec3(0.0,0.0,5.0), vec3(0.0,0.0,0.0), vec3(0.0,1.0,0.0));

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

    program.currentFaceLoc = gl.getUniformLocation(program, "currentFace");

    program.numTrianglesLoc = gl.getUniformLocation(program, "numTriangles");
    program.modeLoc = gl.getUniformLocation(program, "mode");


    return program; // send this back so that other parts of the program can use it
}

/* Global render callback to draw all objects */
function renderToContext(drawables, gl){
    // inner-scoped function for closure trickery
    function renderScene(){
        renderToContext(drawables, gl);
    }

    var elapsedTime = (Date.now() - startTime) / 1000;
    face = Math.floor(elapsedTime);

    // start from a clean frame buffer for this frame
    gl.clear( gl.COLOR_BUFFER_BIT);

    drawables[shownShape].draw(gl);
    drawables[shownShape + 1].draw(gl);

    // queue up this same callback for the next frame
    requestAnimFrame(renderScene);
}

/* Constructor for a grid object (initializes the data). */
function Shape(gl, program, color, angle, vertices, isLine){
    this.program = program; // save my shader program
    this.color = color; // the color of this grid surface
    this.vertices = vertices; // this array will hold raw vertex positions
    this.vBufferId = gl.createBuffer(); // reserve a buffer object and store a reference to it
	this.angle = angle;
	this.isLine = isLine;
	// console.log(new Float32Array(this.vertices).length);
	
    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    // pass data to the graphics hardware (convert JS Array to a typed array)
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW );
}

/* Method allows an object to render itself */
Shape.prototype.draw = function(gl){
    gl.useProgram( this.program ); // set the current shader programs

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set pos buffer active
    // map position buffer data to the corresponding vertex shader attribute
    gl.vertexAttribPointer( this.program.vposLoc, 4, gl.FLOAT, false, 0 , 0 );

    // send this object's color down to the GPU as a uniform variable
    gl.uniform4fv(this.program.colorLoc, flatten(this.color));

    modelview = mult(modelview, rotate(this.angle, vec3(0,1,0)));

    gl.uniformMatrix4fv(this.program.projLoc, gl.false, flatten(projection));
	gl.uniformMatrix4fv(this.program.mvLoc, gl.false, flatten(modelview));
    gl.uniformMatrix4fv(this.program.viewLoc, gl.false, flatten(view));

    gl.uniform1f(this.program.currentFaceLoc, face);
    gl.uniform1f(this.program.numTrianglesLoc, numTriangles);
    gl.uniform1i(this.program.modeLoc, mode);

    // render the primitives!
    if(this.isLine){
        gl.uniform1i(this.program.modeLoc, 2);
        gl.drawArrays(gl.LINES, 0, this.vertices.length / 4);
    }else {
        gl.drawArrays(gl.TRIANGLES, 0, this.vertices.length / 4);
    }
}

function wingedEdge(){
    document.getElementById("pseudocode").innerHTML =
        "class WE_Edge {\n" +
        "  WE_Vertex *start, *end;\n" +
        "  WE_Face *leftFace, *rightFace;\n" +
        "  WE_Edge *leftPrev, *leftNext, *rightPrev, *rightNext;\n" +
        "  WE_EdgeDataObject data;\n" +
        "};\n" +

        "class WE_Vertex {\n" +
        "  float x, y , z;\n" +
        "  WE_Edge *edges;\n" +
        "  WE_VertexDataObject data;\n" +
        "};\n" +

        "class WE_Face {\n" +
        "  *WE_Edge* edge;\n" +
        "  WE_FaceDataObject data;\n" +
        "};";
    document.getElementById("table").innerHTML =
        '    <TABLE BORDER=3 style="color: white">\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> <B><I>Edge</I></B> </TD>\n' +
        '            <TD COLSPAN=2> <B><I>Vertices</I></B> </TD>\n' +
        '            <TD COLSPAN=2> <B><I>Faces</I></B> </TD>\n' +
        '            <TD COLSPAN=2> <B><I>Left Traverse</I></B> </TD>\n' +
        '            <TD COLSPAN=2> <B><I>Right Traverse</I></B> </TD>\n' +
        '        </TR>\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> <B><I>Name</I></B> </TD>\n' +
        '            <TD> <B><I>Start</I></B> </TD>\n' +
        '            <TD> <B><I>End</I></B> </TD>\n' +
        '            <TD> <B><I>Left</I></B> </TD>\n' +
        '            <TD> <B><I>Right</I></B> </TD>\n' +
        '            <TD> <B><I>Prev</I></B> </TD>\n' +
        '            <TD> <B><I>Next</I></B> </TD>\n' +
        '            <TD> <B><I>Prev</I></B> </TD>\n' +
        '            <TD> <B><I>Next</I></B> </TD>\n' +
        '        </TR>\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> a </TD>\n' +
        '            <TD> X </TD>  <TD> Y </TD>\n' +
        '            <TD> 1 </TD>  <TD> 2 </TD>\n' +
        '            <TD> b </TD>  <TD> d </TD>\n' +
        '            <TD> e </TD>  <TD> c </TD>\n' +
        '        </TR>\n' +
        '    </TABLE>';
}

function halfEdge() {
    document.getElementById("pseudocode").innerHTML =
        "class HE_edge {\n" +
        "  HE_vert* vert;\n" +
        "  HE_face* face;\n" +
        "  HE_edge* prev, next;\n" +
        "  HE_edge* pair;\n" +
        "};\n" +

        "class HE_vert {\n" +
        "  float x, y, z;\n" +
        "  HE_edge* edge;\n" +
        "  HE_VertexDataObject data;\n" +
        "};\n" +

        "class HE_face {\n" +
        "  HE_edge* edge;\n" +
        "};";

    document.getElementById("table").innerHTML =
        '    <TABLE BORDER=3 style="color: white">\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> <B><I>Edge</I></B> </TD>\n' +
        '            <TD> <B><I>Vertice</I></B> </TD>\n' +
        '            <TD> <B><I>Pair</I></B> </TD>\n' +
        '            <TD> <B><I>Face</I></B> </TD>\n' +
        '            <TD colspan="2"> <B><I>Traverse</I></B> </TD>\n' +
        '        </TR>\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> <B><I>Name</I></B> </TD>\n' +
        '            <TD> <B><I>Start</I></B> </TD>\n' +
        '            <TD> </TD>\n' +
        '            <TD> </TD>\n' +
        '            <TD> <B><I>Prev</I></B> </TD>\n' +
        '            <TD> <B><I>Next</I></B> </TD>\n' +
        '        </TR>\n' +
        '        <TR ALIGN=CENTER>\n' +
        '            <TD> a </TD>\n' +
        '            <TD> X </TD>' +
        '            <TD> f </TD>' +
        '            <TD> 2 </TD> ' +
        '            <TD> e </TD>' +
        '            <TD> c </TD>' +
        '        </TR>\n' +
        '    </TABLE>';}

/* Set up event callback to start the application */
window.onload = function(){

    var gl = initGL();
    var prog = loadShaderProgram(gl);

    wingedEdge();

    document.getElementById("wingedEdge").addEventListener("click",function(){
        wingedEdge();
        mode = 0;
    });

    document.getElementById("halfEdge").addEventListener("click",function(){
        halfEdge();
        mode = 1;
    });

    document.getElementById("cube").addEventListener("click",function(){
        shownShape = 0;
        numTriangles = 12;
        startTime = Date.now();
    });

    document.getElementById("pyramid").addEventListener("click",function(){
        shownShape = 2;
        numTriangles = 6;
        startTime = Date.now();
    });

    var drawables = []; // used to store a list of objects that need to be drawn
    drawables.push( new Shape(gl, prog, vec4(1,0,0,1), 0.5, cube, false) );
    drawables.push( new Shape(gl, prog, vec4(0,0,1,1), 0, cubeLines, true) );
    drawables.push( new Shape(gl, prog, vec4(1,0,0,1), 0.5, pyramid, false) );
    drawables.push( new Shape(gl, prog, vec4(0,0,1,1), 0, pyramideLines, true) );

    renderToContext(drawables, gl); // start drawing the scene
}

