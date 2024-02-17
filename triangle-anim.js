/*

*/

// Global variables we'll need
let gl;
let points;
let x = 0.0;
let y = 0.0;
let xLoc, yLoc;
let xDir = 1.0;
let yDir = 1.0;
let vertices;
let bufferID;

// This function executes our WebGL code AFTER the window is loaded.
// Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  // Grab the canvas object and initialize it
  let canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);

  // Error checking
  if (!gl) { alert('WebGL unavailable'); }

  // Triangle vertices
  vertices = [
    vec2(0.25, -0.25),
    vec2(0, 0.25),
    vec2(-0.25, -0.25)
  ];

  // Configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // Load shaders and initialize attribute buffers
  let program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);
  xLoc = gl.getUniformLocation(program, "x");
  yLoc = gl.getUniformLocation(program, "y");

  // Load data into GPU
  bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // Set its position and render it
  let vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();

  // Add event listener for keyboard input
  window.addEventListener("keydown", handleKeyDown, false);
};

// Function to handle keyboard events
function handleKeyDown(e) {
  console.log("Key: " + e.key);
  switch (e.key) {
    case "ArrowLeft":
      xDir = -1.0;
      break;
    case "ArrowRight":
      xDir = 1.0;
      break;
    case "ArrowUp":
      yDir = 1.0;
      break;
    case "ArrowDown":
      yDir = -1.0;
      break;
    case " ":
      xDir = 0.0;
      yDir = 0.0;
      break;
    case "r":
      rotateTriangle();
      break;
    case "a":
      addTriangle();
      break;
  }
}

// Function to rotate the triangle
function rotateTriangle() {
  for (let i = 0; i < vertices.length; i++) {
    let newX = vertices[i][0] * Math.cos(Math.PI / 180) - vertices[i][1] * Math.sin(Math.PI / 180);
    let newY = vertices[i][0] * Math.sin(Math.PI / 180) + vertices[i][1] * Math.cos(Math.PI / 180);
    vertices[i] = vec2(newX, newY);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
}

// Function to add another triangle
function addTriangle() {
  let newVertices = [
    vec2(0.5, -0.5),
    vec2(0.25, 0.5),
    vec2(-0.5, 0.0)
  ];
  vertices = vertices.concat(newVertices);
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
}

// Render whatever is in our gl variable
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);

  // Update x and y values based on direction
  x += 0.01 * xDir;
  y += 0.01 * yDir;
  
  if (y > 0.9) { // top hit -- reverse y but keep x
    y = 0.9;
    yDir *= -1.0;
    }

    if (x > 0.9) { // right hit -- reverse x but keep y
        x = 0.9;xDir *= -1.0;
    }
        
    if (y < -0.9) { // bottom hit -- reverse y but keep x
        y = -0.9;
        yDir *= -1.0;
    }

    if (x < -0.9) { // left hit -- reverse x but keep y
        x = -0.9;
        xDir *= -1.0;
    }

  // Update uniform variables
  gl.uniform1f(xLoc, x);
  gl.uniform1f(yLoc, y);

  // Request the next frame
  setTimeout(function() {
    requestAnimationFrame(render); 
  }, 100);
}