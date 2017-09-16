export default function createGlProgram(gl, vshader, fshader) {
    // create a program object
    let program = gl.createProgram();
    if (!program) {
        return null;
    }

    // create shader objects
    let vertexShader = __loadShader(gl, gl.VERTEX_SHADER, vshader);
    let fragmentShader = __loadShader(gl, gl.FRAGMENT_SHADER, fshader);

    // attach the shader objects
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);

    // link the program object
    gl.linkProgram(program);

    // check the result of linking
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        let error = gl.getProgramInfoLog(program);

        gl.deleteProgram(program);
        gl.deleteShader(fragmentShader);
        gl.deleteShader(vertexShader);

        throw `hackGl: Failed to link gl program: ${error}`;
    }

    return program;
}

function __loadShader(gl, type, source) {
    // create shader object
    let shader = gl.createShader(type);
    if (!shader) {
        throw 'hackGl: unable to create shader';
    }

    // set the shader program
    gl.shaderSource(shader, source);
    // compile the shader
    gl.compileShader(shader);

    // check the result of compilation
    var compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        let error = gl.getShaderInfoLog(shader);
        gl.deleteShader(shader);
        throw `hackGl: Failed to compile shader: ${error}`;
    }

    return shader;
}
