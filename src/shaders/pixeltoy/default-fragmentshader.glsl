void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
}
