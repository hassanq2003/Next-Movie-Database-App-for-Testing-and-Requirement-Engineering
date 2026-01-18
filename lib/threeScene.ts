import * as THREE from 'three';
import { vertexShader, fragmentShader } from './shaders';

export function initThreeScene(
  container: HTMLDivElement,
  mouse: THREE.Vector2
) {
  const scene = new THREE.Scene();
  const camera = new THREE.Camera();
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  const uniforms = {
    u_time: { value: 0 },
    u_resolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
    u_mouse: { value: mouse },
  };

  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader,
    fragmentShader,
  });

  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
  scene.add(mesh);

  const clock = new THREE.Clock();

  function animate() {
    uniforms.u_time.value = clock.getElapsedTime();
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
  }

  animate();

  return () => {
    renderer.dispose();
  };
}
