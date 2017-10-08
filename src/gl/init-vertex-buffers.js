export default function initVertexBuffers(gl, program) {
    // cover whole canvas with quad
    let vertices = new Float32Array([
        -1.0, 1.0,
        -1.0, -1.0,
        1.0, 1.0,
        1.0, -1.0
    ]);

    let vertexCount = 4; // number of vertices

    // create a buffer object
    let vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        throw 'hackGl: failed to create the buffer object';
    }

    // bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    // write data into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    let a_position = gl.getAttribLocation(program, 'a_position');
    if (a_position < 0) {
        throw 'hackGl: pixeltoy failed to get the storage location of a_position';
    }

    // assign the buffer object to a_position variable
    gl.vertexAttribPointer(a_position, 2, gl.FLOAT, false, 0, 0);
    // enable the assignment to a_position variable
    gl.enableVertexAttribArray(a_position);

    return vertexCount;
}
