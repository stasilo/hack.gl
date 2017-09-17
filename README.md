
`simple fragment shader / feedback effect declarative webgl helper`

`useful for "pixel toys" (as on shadertoy.com), raymarchers, etc.`

`mostly for personal use, but do enjoy :)`


`type this:`

`$ npm install --save-dev hack.gl`

`then this:`

```javascript
const hackgl = require('hack.gl');
// or: import hackgl from 'hack.gl';
let canvas = document.getElementById('gl-canvas');

hackgl({
    canvas,
    resolution: {
        width: 800,
        height: 400
    },
    feedbackFbo: {
        injectWebcamUniform: true,
        uniforms: {
            u_texture1: {
                type: 't',
                value: null,
                url: 'assets/sky.jpg'
            }
        },
        fragmentShader: `
            uniform sampler2D u_texture1;

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec2 tc = uv;

                uv *= 0.991;

                vec2 coords = vec2(
                    0.5 + uv.x * abs(cos(u_time)*0.5),
                    0.5 + uv.y * abs(sin(u_time+uv.x*1.0)*0.5)
                );

                vec4 src = texture2D(u_fbo, uv);
                vec4 src2 = texture2D(u_texture1, coords);
                vec4 sum = texture2D(u_camera, tc);

                sum.rgb = mix(sum.rgb, src2.rgb, 0.25);
                sum.rgb = mix(sum.rbg, src.rgb, 0.95);

                gl_FragColor = sum;
            }
        `
    },
    fragmentShader: `
        void main() {
            vec2 uv = gl_FragCoord.xy / u_resolution.xy;
            gl_FragColor = texture2D(u_fbo, uv);
        }
    `,
});
```

`get this:`

![Solid](https://labb.stasilo.se/images/hackgl.png)

[`live demo`](https://labb.stasilo.se/hackgl/example/)

`jakob stasilowicz`

[`stasilo.se`](https://stasilo.se)
