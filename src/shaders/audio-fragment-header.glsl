uniform sampler2D u_audio_data;

// https://stackoverflow.com/questions/35799286
float _hackgl_toLog(float value, float min, float max){
    float exp = (value-min) / (max-min);
    return min * pow(max/min, exp);
}

/*
 * Freq data is stored as unsigned integers/rgba. Since webGl 1 doesn't have texelFetch we have to
 * access the data with uv coordinates using texture2D.
 *
 * Example:
 * Assume an fft size of 512, which means a bin count of 256 freq data values.
 * To access freq data at, for example, index 128 in the original array returned from the web audio api, do:
 * _hackgl_getFreqData(128.0/256.0);
 */

float _hackgl_getFreqData(float index) {
    return texture2D(u_audio_data, vec2(index, 0.5)).r;
}

float hackgl_getAudioFreqData(float index, float minCrop, float maxCrop) {
    // crop bottom and top of range
    float xCoord = mix(minCrop, maxCrop, index);

    // get freq for current index
    float fft = _hackgl_getFreqData(xCoord);
    return fft;
}

float hackgl_getAudioFreqData(float index) {
    return hackgl_getAudioFreqData(index, 0.3, 0.7);
}

float hackgl_getLogAudioFreqData(float index, float minCrop, float maxCrop) {
    //crop bottom and top of range
    float xCoord = mix(minCrop, maxCrop, index);
    //logarithmic sampling
    float xPos = _hackgl_toLog(xCoord, 0.01, 1.0);

    // get freq for current index
    float fft = _hackgl_getFreqData(xPos);
    return fft;
}

float hackgl_getLogAudioFreqData(float index) {
    return hackgl_getLogAudioFreqData(index, 0.3, 0.7);
}
