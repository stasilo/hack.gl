import getMousePosition from '../utils/get-mouse-position';
import {getFrameCount, updateFrameCount} from '../utils/frame-count';

const startTime = Date.now();

export let defaultUniforms = {
    u_resolution: {
        type: '2fv',
        value: [0.0, 0.0]
    },
    u_mouse: {
        type: '2fv',
        value: [0.0, 0.0],
        update: () => getMousePosition()
    },
    u_time: {
        type: 'f',
        value: 0.0,
        update: () => (Date.now() - startTime) / 1200
    },
    u_frame_count: {
        type: 'i',
        value: getFrameCount(),
        update: getFrameCount
    }
}
