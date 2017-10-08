let context = null, canvas = null, streaming = false;

let cameraUniformBase = {
    type: 't',
    needsUpdate: true,
    value: null,
    wrapS: 'clamp',
    wrapT: 'clamp'
}

export async function initCameraUniform() {
    let video;

    try {
        video = await _initCamera();
    } catch(error) {
        console.error(error);
        return;
    }

    return {
        ...cameraUniformBase,
        value: video,
        update: () => video
    }
}


async function _initCamera() {
    if(streaming) {
        return document.getElementById('video');
    }

    let video = _injectVideoElement();
    let stream;

    try {
        stream = await _getCameraStream();
    } catch(error) {
        console.dir(error);
        throw 'hackGl: Could not load camera stream:';
    }

    video.srcObject = stream;
    video.play();
    streaming = true;

    return new Promise((resolve, reject) => {
        video.addEventListener('canplay', (e) => resolve(video), false)
    });
}

async function _getCameraStream() {
    return await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
            width: {
                min: 640, ideal: 640, max: 640
            },
            height: {
                min: 480, ideal: 480, max: 480
            }
        }
    });
}
function _injectVideoElement() {
    let video = document.createElement('video');

    video.id = 'video';
    video.style.display = 'none';
    video.innerHTML = 'Video stream not available.';
    document.body.insertBefore(video, document.body.childNodes[0]);

    return video;
}
