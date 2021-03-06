/* Initialize global WebGL stuff - not object specific */
function initGL(){
    // local variable to hold a reference to an HTML5 canvas
    var canvas = document.getElementById( "gl-canvas" );

    // obtain a WebGL context bound to our canvas
    var gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height ); // use the whole canvas
    gl.clearColor( 0.0, 0.0, 0.0, 1.0 ); // background color

    return gl; // send this back so that other parts of the program can use it
}

/* Load shaders and initialize attribute pointers. */
function loadShaderProgram(gl){
    // use the existing program if given, otherwise use our own defaults
    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    // get the position attribute and save it to our program object
    //   then enable the vertex attribute array
    program.vposLoc = gl.getAttribLocation( program, "vPosition" );
    gl.enableVertexAttribArray( program.vposLoc );

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

    drawables.forEach(function(obj){
        obj.draw(gl);
    });

    // queue up this same callback for the next frame
    requestAnimFrame(renderScene);
}

/* Constructor for a triangle strip object (initializes the data). */
function TriStrip(gl, program){
    this.program = program; // save my shader program
    this.vertices = mkstrip(); // this array will hold raw vertex positions
    this.vBufferId = gl.createBuffer(); // reserve a buffer object and store a reference to it

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set active array buffer
    // pass data to the graphics hardware (convert JS Array to a typed array)
    gl.bufferData( gl.ARRAY_BUFFER, flatten(this.vertices), gl.STATIC_DRAW );

}

/* Method allows an object to render itself */
TriStrip.prototype.draw = function(gl){
    gl.useProgram( this.program ); // set the current shader programs

    gl.bindBuffer( gl.ARRAY_BUFFER, this.vBufferId ); // set pos buffer active
    // map position buffer data to the corresponding vertex shader attribute
    gl.vertexAttribPointer( this.program.vposLoc, 3, gl.FLOAT, false, 0, 0 );

    // render the primitives!
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.vertices.length);
}

/* Build a triangle strip with random heights. */
function mkstrip(){
    var h, i; // best practice in JS is to declare our variables up front
    var points = []; // to hold the individual coordinate triples
    var vertices = []; // to hold the vertices to be drawn as tri-strips

    // generate a thin 2x10 grid of points with random heights
    for (i = 0; i < 11; i++) {
        h = Math.random();
        points.push( vec3(-1.0+i*0.2, 0.2, h) );
    }
    for (i = 0; i < 11; i++) {
        h = Math.random();
        points.push( vec3(-1.0+i*0.2, -0.2, h) );
    }

    // fill up the vertices array with the necessary points
    for (i = 0; i < 11; i++) {
        vertices.push(points[i], points[i+11]);
    }
    return vertices;
}

/* Set up event callback to start the application */
window.onload = function(){
    
    // local variable to hold reference to our WebGL context
    var gl = initGL(); // basic WebGL setup for the scene
    var prog = loadShaderProgram(gl);

    var drawables = []; // used to store a list of objects that need to be drawn

    drawables.push( new TriStrip(gl, prog) ); // create a triangle strip object and add it to the list

    renderToContext(drawables, gl); // start drawing the scene
}

