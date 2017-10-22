let frameCount = 0;

export function getFrameCount() {
    return frameCount;
}

export function updateFrameCount() {
    return ++frameCount;
}

export function setFrameCount(val) {
    frameCount = val;
    return val;
}
