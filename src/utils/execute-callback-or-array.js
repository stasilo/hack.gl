export default function executeCallbackOrArray(callback) {
    if(Array.isArray(callback)) {
        callback.forEach(cb => cb());
    } else if(typeof(callback) === 'function') {
        callback();
    } else {
        throw 'hackGl: illegal callback';
    }
}
