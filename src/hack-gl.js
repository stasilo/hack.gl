import webGlUtils from './lib/webgl-utils';
import initPixelToy from './gl/init-pixel-toy';
import validateOptions from './init/options';

export default function hackGl(options) {
    options = validateOptions(options);
    if(!options.isValid) {
        throw `hack.Gl: ${options.errors}`;
    }

    _setupCanvasResolution(options);
    let gl = _getWebGlContext(options.canvas);

    // specify the color for clearing canvas
    gl.clearColor(...options.clearColor);

    initPixelToy(gl, options);
}

function _getWebGlContext(canvas, debug = false) {
    let gl = webGlUtils.setupWebGL(canvas);
    if (!gl) {
        throw 'hack.Gl: failed to get the rendering context for webGl';
    }

    if(debug) {
        gl = webGlUtils.makeDebugContext(gl);
    }

    return gl;
}

function _setupCanvasResolution(options) {
    options.canvas.width = options.resolution.width;
    options.canvas.height = options.resolution.height;
}
