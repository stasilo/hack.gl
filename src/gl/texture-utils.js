let textureUnitNo = 0;

export async function loadTextureData(data) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = data.url;
    });
}

export function initTexture(gl, data, image) {
    const maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    if(textureUnitNo > maxTextureCount) {
        throw `hackGl: max number of texture units (${maxTextureCount}) exceeded`;
    }

    let texture = gl.createTexture();

    // activate texture
    gl.activeTexture(gl[`TEXTURE${textureUnitNo}`]);

    // bind texture object
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // flip axes to xy instead of yx
    if(typeof data.flipY === 'undefined' || data.flipY != false) {
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    }

    // set params

    // note: clamp removes need for w x h being a power of two
    let repeatTypeS = gl.CLAMP_TO_EDGE, repeatTypeT = gl.CLAMP_TO_EDGE;
    if(_imageDimensionArePowerOf2(image)) {
        repeatTypeS = gl.REPEAT;
        repeatTypeT = gl.REPEAT;
    }

    if(data.wrapS && data.wrapS == 'clamp') {
        repeatTypeS = gl.CLAMP_TO_EDGE;
    }

    if(data.wrapT && data.wrapT == 'clamp') {
        repeatTypeT = gl.CLAMP_TO_EDGE;
    }

    if(data.wrapS && data.wrapS == 'repeat') {
        repeatTypeS = gl.REPEAT;
    }

    if(data.wrapT && data.wrapT == 'repeat') {
        repeatTypeT = gl.REPEAT;
    }

    if(data.wrapS && data.wrapS == 'mirrored-repeat') {
        repeatTypeS = gl.MIRRORED_REPEAT;
    }

    if(data.wrapT && data.wrapT == 'mirrored-repeat') {
        repeatTypeT = gl.MIRRORED_REPEAT;
    }

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, repeatTypeS);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, repeatTypeT);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    if(data.generateMips) {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR);
        gl.generateMipmap(gl.TEXTURE_2D);
    } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    }

    // set the texture unit number to the sampler
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;
    data.texture = texture;

    textureUnitNo++;
    return data;
}

export function initFboTexture(gl, data) {
    gl.activeTexture(gl[`TEXTURE${textureUnitNo}`]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);

    if(data.uniform) {
        gl.uniform1i(data.uniform, textureUnitNo);
    }

    data.textureUnitNo = textureUnitNo;
    textureUnitNo++;

    return data;
}

export function bindFboTexture(gl, data) {
    gl.activeTexture(gl[`TEXTURE${data.textureUnitNo}`]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);
    gl.uniform1i(data.uniform, data.textureUnitNo);
    return data;
}

export function rebindFboTextures(gl, uniforms) {
    let fboUniforms = Object.keys(uniforms).reduce((a, uniformName) => (
        uniformName.startsWith('u_fbo')
        ? [...a, uniforms[uniformName]]
        : a
    ), []);

    fboUniforms.forEach(uniform => {
        gl.activeTexture(gl[`TEXTURE${uniform.textureUnitNo }`]);
        gl.bindTexture(gl.TEXTURE_2D, uniform.texture2);
        gl.uniform1i(uniform.uniform, uniform.textureUnitNo);
    });
}

export function updateTexture(gl, data) {
    gl.activeTexture(gl[`TEXTURE${data.textureUnitNo}`]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.value);
}

function _imageDimensionArePowerOf2(image) {
  return (image.naturalWidth & (image.naturalWidth - 1)) == 0 && (image.naturalHeight & (image.naturalHeight - 1)) == 0;
}
