import getMousePosition from '../utils/get-mouse-position';
const startTime = Date.now();

export let defaultUniforms = {
    u_resolution: {
        type: '2fv',
        value: [0.0, 0.0]
    },
    u_mouse: {
        type: '2fv',
        value: [0.0, 0.0],
        update: () => getMousePosition(options.canvas)
    },
    u_time: {
        type: 'f',
        value: 0.0,
        update: () => (Date.now() - startTime) / 1200
    },
}
