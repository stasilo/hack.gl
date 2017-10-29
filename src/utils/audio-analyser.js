const context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = null, source = null;

let audioUniformBase = {
    type: 't',
    needsUpdate: true,
    wrapS: 'clamp',
    wrapT: 'clamp'
}

let audioUniform = null;

export async function initAudioAnalyserUniform(gl, options) {
    if(audioUniform) {
        return audioUniform;
    }

    const analyserOptions = options.audioAnalyser;
    let source = null;

    analyser = context.createAnalyser();
    analyser.fftSize = analyserOptions.fftSize || 1024; // 1024 / 2 = 512 data points per sample of sound
    analyser.smoothingTimeConstant = analyserOptions.smoothing || 0.5; //0.2;

    const _getAudioSource = typeof analyserOptions.url === 'undefined' ?
        _getMicrophoneSource :
        _getAudioFileSource;

    try {
        source = await _getAudioSource(analyserOptions);
    } catch(error) {
        console.dir(error);
        throw 'hackGl: Could not load audio file or mic stream';
    }

    source.connect(analyser);
    analyser.connect(context.destination);
    if(typeof analyserOptions.url !== 'undefined') {
        source.start();
        source.loop = true;
    }

    audioUniform = {
        ...audioUniformBase,
        value: getFrequencyData(),
        update: () => getFrequencyData(),
        size: [analyser.frequencyBinCount, 1],
    };

    return audioUniform;
}

export function getFrequencyData() {
    const size = analyser.frequencyBinCount;

    let dataArray = new Uint8Array(size);
    let shaderData = new Uint8Array(size * 4);

    // analyser.getByteTimeDomainData(dataArray);
    analyser.getByteFrequencyData(dataArray);

    dataArray.forEach((val, i) => {
        shaderData.fill(val, i * 4, (i + 1) * 4);
    });

    return shaderData;
}

async function _getAudioFileSource(analyserOptions) {
    return fetch(analyserOptions.url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            let source = context.createBufferSource();
            source.buffer = audioBuffer;

            return source;
        })
}

async function _getMicrophoneSource() {
    let stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: false
    });

    return context.createMediaStreamSource(stream);
}
