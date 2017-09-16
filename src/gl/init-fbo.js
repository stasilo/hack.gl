import createGlProgram from './create-gl-program';
import initVertexBuffers from './init-vertex-buffers';
import {initUniforms, updateUniforms, setUniformValue} from './uniform-utils';
import {initCameraUniform} from '../webrtc/init-camera';
import {defaultUniforms} from './default-uniforms';

const toyFragmentHeader = require('../shaders/pixeltoy/fragment-header.glsl');
const cameraFragmentHeader = require('../shaders/camera-fragment-header.glsl');
const fboFragmentHeader = require('../shaders/fbo-fragment-header.glsl');
const toyVertexShader = require('../shaders/pixeltoy/vertex-shader.glsl');
const defaultFragmentShader = require('../shaders/pixeltoy/default-fragmentshader.glsl');

export async function initFramebuffer(gl, options) {
    let fboShader = `${toyFragmentHeader}
                     ${(options.feedbackFbo.injectWebcamUniform ? cameraFragmentHeader : '')}
                     ${(options.feedbackFbo ? fboFragmentHeader : '')}
                     ${(options.feedbackFbo.fragmentShader)}`;

    let fboUniformData = {
        ...defaultUniforms,
        ...options.feedbackFbo.uniforms
    };

    fboUniformData.u_resolution.value = [
        options.feedbackFbo.resolution.width,
        options.feedbackFbo.resolution.height
    ];

    if(options.feedbackFbo.injectWebcamUniform) {
        fboUniformData.u_camera = await initCameraUniform(options);
    }

    // initialize framebuffer object (FBO)
    let fbo;
    try {
        fbo = _initFramebufferObject(gl, options);
    } catch(error) {
        console.error(`hackGl: ${error}`);
        return;
    }

    fboUniformData.u_fbo = {
        type: 'fbo_t',
        texture1: fbo.texture1,
        texture2: fbo.texture2
    }

    let fboProgram = createGlProgram(gl, toyVertexShader, fboShader);
    if (!fboProgram) {
        throw 'hack.Gl: failed to create fbo gl program!';
    }

    gl.useProgram(fboProgram);

    let fboVertexCount = initVertexBuffers(gl, fboProgram, options);
    let fboUniforms = await initUniforms(gl, fboProgram, fboUniformData, true);

    let renderToTexture = () => {
        gl.useProgram(fboProgram);
        fboUniforms = updateUniforms(gl, fboUniforms);

        gl.bindFramebuffer(gl.FRAMEBUFFER, fbo); // change the drawing destination to FBO

        // ping pong texture
        let tmp = fbo.texture2;
        fbo.texture2 = fbo.texture1;
        fbo.texture1 = tmp;

        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, fbo.texture1, 0);
        gl.activeTexture(gl[`TEXTURE${fboUniforms.u_fbo.textureUnitNo }`]);
        gl.bindTexture(gl.TEXTURE_2D, fbo.texture2);
        // gl.uniform1i(fboUniforms.u_fbo.uniform, fboUniforms.u_fbo.textureUnitNo);

        // clear and draw
        gl.viewport(0, 0, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, fboVertexCount);

        gl.bindFramebuffer(gl.FRAMEBUFFER, null); // change the drawing destination to color buffer
    }

    return {
        renderToTexture,
        fboUniform: fboUniformData.u_fbo,
    }
}

function _initFramebufferObject(gl, options) {
    let framebuffer, depthBuffer;

    // define the error handling function
    let error = () => {
        if (framebuffer) {
            gl.deleteFramebuffer(framebuffer);
        }
        if (texture1) {
            gl.deleteTexture(texture1);
        }

        if (texture2) {
            gl.deleteTexture(texture2);
        }

        if (depthBuffer) {
            gl.deleteRenderbuffer(depthBuffer);
        }

        return null;
    }

    // create a frame buffer object (FBO)
    framebuffer = gl.createFramebuffer();
    if (!framebuffer) {
        throw 'failed to create frame buffer object';
        return error();
    }

    // create a texture object and set its size and parameters
    let texture1 = gl.createTexture(); // Create a texture object
    if (!texture1) {
        throw 'failed to create texture object';
        return error();
    }

    let texture2 = gl.createTexture(); // Create a texture object
    if (!texture2) {
        throw 'failed to create texture object';
        return error();
    }

    // bind the object to target
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    // setup texture to be written to
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer.texture1 = texture1;

    // bind the object to target
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    // setup texture2 to be written to
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    framebuffer.texture2 = texture2;

    // create a renderbuffer object and Set its size and parameters
    depthBuffer = gl.createRenderbuffer(); // Create a renderbuffer object
    if (!depthBuffer) {
        throw 'failed to create renderbuffer object';
        return error();
    }

    // bind the object to target
    gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuffer);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, options.feedbackFbo.resolution.width, options.feedbackFbo.resolution.height);

    // attach the texture and the renderbuffer object to the FBO
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture1, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, depthBuffer);

    // check if FBO is configured correctly
    let e = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    if (gl.FRAMEBUFFER_COMPLETE !== e) {
        throw `frame buffer object is incomplete: ${e.toString()}`;
        return error();
    }

    // unbind the buffer object
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);

    return framebuffer;
}
