const context = new (window.AudioContext || window.webkitAudioContext)();
var analyser = null, source = null;

let audioUniformBase = {
    type: 't',
    needsUpdate: true,
    update: () => getFrequencyData(),
    wrapS: 'clamp',
    wrapT: 'clamp'
}

let audioUniform = null;

export async function initAudioAnalyserUniform(gl, options) {
    if(audioUniform) {
        return audioUniform;
    }

    const analyserOptions = options.audioAnalyser;

    analyser = context.createAnalyser();
    analyser.fftSize = analyserOptions.fftSize || 1024; // 1024 / 2 = 512 data points per sample of sound
    analyser.smoothingTimeConstant = analyserOptions.smoothing || 0.5; //0.2;

    return fetch(analyserOptions.url)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
            let source = context.createBufferSource();

            source.buffer = audioBuffer;
            source.connect(analyser);
            analyser.connect(context.destination);
            source.start();
            source.loop = true;

            audioUniform = {
                ...audioUniformBase,
                value: getFrequencyData(),
                size: [analyser.frequencyBinCount, 1],
            };

            return audioUniform;
        }).catch(error => {
            console.warn(`hack.gl: failed to fetch audio data: `);
            console.dir(error);
        });
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
