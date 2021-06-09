import * as THREE from "three";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ canvas });

const aspect = innerWidth / innerHeight;
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 5);
camera.position.z = 2;

const scene = new THREE.Scene();

{
  const near = 1;
  const far = 2;
  const color = 0x993339;
  scene.fog = new THREE.Fog(color, near, far);
  scene.background = new THREE.Color(color);
}

{
  const color = 0xffffff;
  const intensity = 1;
  const light = new THREE.DirectionalLight(color, intensity);
  light.position.set(-1, 2, 4);
  scene.add(light);
}

const geometry = new THREE.BoxGeometry(1, 1, 1);

function makeInstance(geometry, color, y) {
  const material = new THREE.MeshPhongMaterial({ color });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.y = y;

  return cube;
}

const cubes = [makeInstance(geometry, 0x44aa88, 0)];

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const pixelRatio = window.devicePixelRatio;
  const width = (canvas.clientWidth * pixelRatio) | 0;
  const height = (canvas.clientHeight * pixelRatio) | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

requestAnimationFrame(function render(time) {
  time *= 0.001; // convert time to seconds

  if (resizeRendererToDisplaySize(renderer)) {
    const canvas = renderer.domElement;
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);

  requestAnimationFrame(render);
});
