export default function executeCallbackOrArray(callback) {
    if(Array.isArray(callback)) {
        callback.map(cb => cb());
    } else if(typeof(callback) === 'function') {
        callback();
    } else {
        throw 'hackGl: illegal callback';
    }
}
