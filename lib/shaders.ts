export const vertexShader = `
  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform float u_time;

  #define PI 3.14159265359

  vec3 hsb2rgb(in vec3 c){
    vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0),
                         6.0)-3.0)-1.0,
                 0.0,
                 1.0 );
    rgb = rgb*rgb*(3.0-2.0*rgb);
    return c.z * mix(vec3(1.0), rgb, c.y);
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv -= 0.5;
    uv.x *= u_resolution.x / u_resolution.y;

    float d = length(uv - u_mouse * 0.2);
    float t = u_time * 0.2;

    vec3 color = hsb2rgb(vec3(
      atan(uv.y, uv.x) / (2.0 * PI) + t,
      1.0,
      smoothstep(0.5, 0.0, d)
    ));

    gl_FragColor = vec4(color, 1.0);
  }
`;
