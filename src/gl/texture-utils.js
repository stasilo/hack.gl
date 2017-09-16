let textureUnitNo = 0;

export async function loadTextureData(data) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = () => resolve(image);
        image.onerror = (e) => reject(e);
        image.src = data.url;
    });
}

export function initTexture(gl, data, image, unitNoOffset = 0) {
    const maxTextureCount = gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS);
    if(textureUnitNo > maxTextureCount) {
        throw `hackGl: max number of texture units (${maxTextureCount}) exceeded`;
    }

    let texture = gl.createTexture();

    // flip axes to xy instead of yx
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);

    // activate texture
    gl.activeTexture(gl[`TEXTURE${textureUnitNo + unitNoOffset}`]);

    // bind texture object
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // set params

    // note: clamp removes need for w x h being a power of two
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);

    // set the texture image
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

    // set the texture unit number to the sampler
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;

    textureUnitNo++;
    return texture;
}

export function initFboTexture(gl, data) {
    gl.activeTexture(gl[`TEXTURE${textureUnitNo}`]);
    gl.bindTexture(gl.TEXTURE_2D, data.texture2);
    gl.uniform1i(data.uniform, textureUnitNo);
    data.textureUnitNo = textureUnitNo;
    textureUnitNo++;

    return data;
}

export function bindFboTextureToFragmentShader(gl, uniforms) {
    gl.activeTexture(gl[`TEXTURE${uniforms.u_fbo.textureUnitNo }`]);
    gl.bindTexture(gl.TEXTURE_2D, uniforms.u_fbo.texture2);
    gl.uniform1i(uniforms.u_fbo.uniform, uniforms.u_fbo.textureUnitNo);
}

export function updateTexture(gl, data) {
    gl.bindTexture(gl.TEXTURE_2D, data.texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, data.value);
}
