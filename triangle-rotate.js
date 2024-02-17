var gl;
var points;
let x = 0.0;
let y = 0.0;
let xLoc, yLoc;
let rotationAngle = 0;
let rotating = false;
let rotationLoc;

// This function executes our WebGL code AFTER the window is loaded.
// Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  rotateTriangle()
  // Grab the canvas object and initialize it
  var canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);

  // Error checking
  if (!gl) { alert('WebGL unavailable'); }

  // triangle vertices
  var vertices = [
    vec2(-0.25, -0.25),
    vec2(0.25, 0.25),
    vec2(0.25, -0.25),
  ];

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);
  xLoc = gl.getUniformLocation(program, "x");
  yLoc = gl.getUniformLocation(program, "y");
  rotationLoc = gl.getUniformLocation(program, "rotation");

  // load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // set its position and render it
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();
};

// Render whatever is in our gl variable
function render() {
  setTimeout(function () {

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.drawArrays(gl.TRIANGLES, 0, 3);

    gl.uniform1f(xLoc, x);
    gl.uniform1f(yLoc, y);

    if (rotating) {
      rotationAngle += 1;
      gl.uniform1f(rotationLoc, rotationAngle);
    }

    window.requestAnimationFrame(render);
  }, 100)
}

function rotateTriangle() {
  rotating = true;
}

function stopRotation() {
  rotating = false;
}