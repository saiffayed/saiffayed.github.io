/*

*/

// Global variables we'll need
var gl;
var points;
let x = 0.0;
let y = 0.0;
let xLoc, yLoc;
let dirs = [null, null]; // horizontal, vertic

// This function executes our WebGL code AFTER the window is loaded.
// Meaning, that we wait for our canvas element to exist.
window.onload = function init() {
  // Grab the canvas object and initialize it
  var canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);

  // Error checking
  if (!gl) { alert('WebGL unavailable'); }

  // triangle vertices
  var vertices = [
    vec2(0.25, -0.25),
        vec2(0, 0.25),
        vec2(-0.25, -0.25)

    // vec2(-1, -1),   
    // vec2(-1, 1),   
    // vec2(1, 1)



  ];

  // for (let t = 0; t < Math.PI * 2.0; t += Math.PI / 32){
  //   let x = 1.0 * Math.cos(t);
  //   let y = 1.0 * Math.sin(t);

  //   vertices.push(vec2(x,y));
  // }

  // configure WebGL
  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  // load shaders and initialize attribute buffers
  var program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram(program);
  xLoc = gl.getUniformLocation(program, "x");
  yLoc = gl.getUniformLocation(program, "y");

  // load data into GPU
  var bufferID = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

  // set its position and render it
  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
  render();

// window.addEventListener(
//     "keydown",
//     function (e) {
//         console.log("Key: " + e.key);
//         if (e.key === "ArrowLeft") {
//             dirs[0] = false;
//         } else if (e.key === "ArrowRight") {
//             dirs[0] = true;
//         } else if (e.key === "ArrowUp") {
//             dirs[1] = true;
//         } else if (e.key === "ArrowDown") {
//             dirs[1] = false;
//         } else if (e.key === " ") {
//             dirs[0] = null;
//             dirs[1] = null;
//         }
//     },
//     false
// );

window.addEventListener(
  "keydown",
  function (e) {
      console.log("Key: " + e.key);
      if (e.key === "ArrowLeft") {
          dirs[0] = false;
      } else if (e.key === "ArrowRight") {
          dirs[0] = true;
      } else if (e.key === "ArrowUp") {
          dirs[1] = true;
      } else if (e.key === "ArrowDown") {
          dirs[1] = false;
      } else if (e.key === " ") {
          dirs[0] = null;
          dirs[1] = null;
      } else if (e.key === "r") { // Press 'r' key to rotate the triangle
          // Modify the vertices to rotate the triangle
          for (let i = 0; i < vertices.length; i++) {
              let newX = vertices[i][0] * Math.cos(Math.PI / 180) - vertices[i][1] * Math.sin(Math.PI / 180);
              let newY = vertices[i][0] * Math.sin(Math.PI / 180) + vertices[i][1] * Math.cos(Math.PI / 180);
              vertices[i] = vec2(newX, newY);
          }
          // Update the buffer data with the new vertices
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
      } else if (e.key === "a") { // Press 'a' key to add another triangle
          // Define the vertices for the new triangle
          var newVertices = [
              vec2(0.5, -0.5),
              vec2(0.25, 0.5),
              vec2(-0.5, 0.0)
          ];
          // Concatenate the new vertices with the existing ones
          vertices = vertices.concat(newVertices);
          // Update the buffer data with the new vertices
          gl.bindBuffer(gl.ARRAY_BUFFER, bufferID);
          gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);
      }
  },
  false
);



};

// Render whatever is in our gl variable
function render() {
  gl.clear(gl.COLOR_BUFFER_BIT);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
  //x += 0.1;
  //y += 0.1;
  if (dirs[0] === true) { // move right
      x += 0.01;
  } else if (dirs[0] === false) { // move left
      x -= 0.01;
  }
  if (dirs[1] === true) { // move up
      y += 0.01;
  } else if (dirs[1] === false) { // move down
      y -= 0.01;
  }
  gl.uniform1f(xLoc, x);
  gl.uniform1f(yLoc, y);
  window.requestAnimationFrame(render);
}




