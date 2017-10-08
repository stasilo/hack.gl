import createGlProgram from './create-gl-program';
import initVertexBuffers from './init-vertex-buffers';
import {initUniforms, updateUniforms, setUniformValue} from './uniform-utils';
import {initFramebuffer} from './init-fbo';
import executeCallbackOrArray from '../utils/execute-callback-or-array';
import {initCameraUniform} from '../webrtc/init-camera';
import {rebindFboTextures} from './texture-utils';

import {defaultUniforms} from './default-uniforms';

const toyFragmentHeader = require('../shaders/pixeltoy/fragment-header.glsl');
const cameraFragmentHeader = require('../shaders/camera-fragment-header.glsl');
const fboFragmentHeader = require('../shaders/fbo-fragment-header.glsl');
const toyVertexShader = require('../shaders/pixeltoy/vertex-shader.glsl');
const defaultFragmentShader = require('../shaders/pixeltoy/default-fragmentshader.glsl');

export default async function initPixelToy(gl, options) {
    let uniformData = {
        ...defaultUniforms,
        ...options.uniforms
    };

    let fragmentShader = `${toyFragmentHeader}
                          ${(options.injectWebcamUniform ? cameraFragmentHeader : '')}
                          ${(options.feedbackFbo ? fboFragmentHeader : '')}
                          ${(options.fragmentShader ? options.fragmentShader : defaultFragmentShader)}`;

    uniformData.u_resolution.value = [options.resolution.width, options.resolution.height];

    if(options.injectWebcamUniform) {
        uniformData.u_camera = await initCameraUniform(options);
    }

    let fbos = [];
    let prevFboUniforms = {};

    if(options.feedbackFbo) {
        let fboCount = 0;

        if(options.feedbackFbo.length) {
            let prevFboUniforms = {};

            for(let fboSettings of options.feedbackFbo) {
                let fbo = await initFramebuffer(gl, fboSettings, `u_fbo${fboCount}`, options, prevFboUniforms);

                if(typeof fbo.fboUniform !== 'undefined') {
                    uniformData[`u_fbo${fboCount}`] = fbo.fboUniform;
                    prevFboUniforms[`u_fbo${fboCount}`] = fbo.fboUniform;
                }

                fbos.push(fbo);
                fboCount++;
            }
        } else {
            let fbo = await initFramebuffer(gl, options.feedbackFbo, `u_fbo${fboCount}`, options);
            uniformData[`u_fbo${fboCount}`] = fbo.fboUniform;
            fbos.push(fbo);
        }
    }

    let program = createGlProgram(gl, toyVertexShader, fragmentShader);
    if (!program) {
        throw 'hack.Gl: failed to create main gl program!';
    }

    gl.useProgram(program);
    let vertexCount = initVertexBuffers(gl, program, options);
    let uniforms = await initUniforms(gl, program, uniformData, 'main fragment');

    let _renderFragmentShader = () => {
        gl.useProgram(program);

        rebindFboTextures(gl, uniforms);
        uniforms = updateUniforms(gl, uniforms, options);

        gl.viewport(0, 0, options.resolution.width, options.resolution.height); // set a viewport for FBO
        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, vertexCount);
    }

    // main render loop
    let _render = () => {
        if(fbos.length) {
            for(let fbo of fbos) {
                fbo.renderToTexture();
            }
        }

        _renderFragmentShader();

        executeCallbackOrArray(options.onRender);
        requestAnimationFrame(_render);
    }

    _render();
}
