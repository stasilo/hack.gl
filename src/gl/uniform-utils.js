import {initTexture, initFboTexture, updateTexture, loadTextureData, bindFboTextureToFragmentShader} from './texture-utils';
import iterateObject from '../utils/iterate-object';

export async function initUniforms(gl, program, uniformData, fbo = false) {
    let result = {};

    console.dir(uniformData);
    
    for (let [uniformName, data] of iterateObject(uniformData)) {
        let uniform = gl.getUniformLocation(program, new String(uniformName));
        if (!uniform) {
            console.warn(`hackGl: ${fbo ? 'frame buffer shader:' : 'fragment shader:'} ` +
                         `failed to get the storage location of "${uniformName}" - ignoring variable. ` +
                         'Perhaps you forgot to use it in your shader?');
            continue;
        }

        let updatedData = {
            ...data,
            uniform
        };

        // await needed for texture image data loading
        updatedData = await setUniformValue(gl, updatedData);
        result[uniformName] = updatedData;
    }

    console.dir(result);

    return result;
}

export function updateUniforms(gl, uniforms, options) {
    if(typeof options !== 'undefined' && options.feedbackFbo && uniforms.u_fbo && uniforms.u_fbo.uniform) {
        bindFboTextureToFragmentShader(gl, uniforms);
    }

    let result = {};
    for (let [key, data] of iterateObject(uniforms)) {
        let uniform = result[key] = {...data};
        if(typeof uniform.update === 'function') {
            uniform.value = uniform.update(uniform.value);
            setUniformValue(gl, uniform, true);
        }
    }

    return result;
}

export async function setUniformValue(gl, data, updating = false) {
    switch(data.type) {
        // texture sampler
        case 't':
            if(!updating) {
                let imageData = typeof data.url !== 'undefined' ? await loadTextureData(data) : data.value;
                data.texture = initTexture(gl, data, imageData);
            } else if(updating && data.needsUpdate) {
                updateTexture(gl, data);
            }

            break;

        // fbo texture sampler
        case 'fbo_t':
            if(!updating) {
                data = initFboTexture(gl, data);
            }

            break;

        // float
        case 'f':
            gl.uniform1f(data.uniform, data.value);
            break;

        // vec2
        case '2fv':
            gl.uniform2fv(data.uniform, data.value);
            break;

        default:
            throw `: ${data.type} uniform not yet implemented!`;
            break;
    }

    return data;
}
