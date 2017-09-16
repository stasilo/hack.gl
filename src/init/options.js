// wow, yeah, this needs work - the boring part

export default function validateOptions(options) {
    let validatedOptions = {
        isValid: true,
        errors: '',
        ...options
    };

    if(typeof options.canvas === 'undefined' || !options.canvas) {
        validatedOptions.isValid = false;
        validatedOptions.errors = "\nNo canvas element supplied when calling hackGl()";
    }

    if(typeof options.clearColor === 'undefined' || !options.clearColor) {
        validatedOptions.isValid = false;
        validatedOptions.errors = "\nNo clear color supplied when calling hackGl()";
    }

    if(typeof options.resolution === 'undefined' || !options.resolution.width || !options.resolution.height) {
        validatedOptions.resolution = {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }

    if(typeof options.feedbackFbo !== 'undefined') {
        if(typeof options.feedbackFbo.resolution === 'undefined' ||
            (!options.feedbackFbo.resolution.width || !options.feedbackFbo.resolution.height))
        {
            validatedOptions.feedbackFbo.resolution = validatedOptions.resolution;
        }
    }

    if(typeof options.uniforms === 'undefined') {
        validatedOptions.uniforms = {};
    }

    if(typeof options.onRender === 'undefined') {
        validatedOptions.onRender = [];
    }

    return validatedOptions;
}
