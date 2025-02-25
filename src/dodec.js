import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let camera, scene, renderer;
let dodecahedron;
let controls;

function init() {
  const container = document.getElementById('geo-container');
  const width = container.clientWidth;
  const height = container.clientHeight;

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 2.8);

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  const light1 = new THREE.PointLight(0xff2200, 100);
  light1.position.set(10, 10, 10);
  scene.add(light1);

  const light2 = new THREE.PointLight(0x22ff00, 50);
  light2.position.set(-10, -10, -10);
  scene.add(light2);

  scene.add(new THREE.AmbientLight(0x111111));

  const customMaterial = new THREE.ShaderMaterial({
    wireframe: true,
    uniforms: {
      light1Pos: { value: light1.position },
      light2Pos: { value: light2.position },
      color1: { value: new THREE.Color(0x7a1ca8) },
      color2: { value: new THREE.Color(0x942ea8) },
      time: { value: 0.0 },
    },
    vertexShader: `
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vNormal = normalize(normalMatrix * normal);
                vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
        `,
    fragmentShader: `
            uniform vec3 light1Pos;
            uniform vec3 light2Pos;
            uniform vec3 color1;
            uniform vec3 color2;
            uniform float time;
            
            const vec3 pinkHighlight = vec3(1.0, 0.4, 0.8);
            
            varying vec3 vNormal;
            varying vec3 vPosition;
            
            void main() {
                vec3 light1Dir = normalize(light1Pos - vPosition);
                vec3 light2Dir = normalize(light2Pos - vPosition);
                
                float light1Intensity = pow(max(0.0, dot(vNormal, light1Dir)), 5.0);
                float light2Intensity = pow(max(0.0, dot(vNormal, light2Dir)), 5.0);
                
                vec3 viewDir = normalize(-vPosition);
                vec3 halfVector1 = normalize(light1Dir + viewDir);
                vec3 halfVector2 = normalize(light2Dir + viewDir);
                float specular1 = pow(max(0.0, dot(vNormal, halfVector1)), 50.0);
                float specular2 = pow(max(0.0, dot(vNormal, halfVector2)), 50.0);
                
                float gradientFactor = (light1Intensity * 2.0 + light2Intensity * 1.0) + 
                                     sin(vPosition.x * 4.0 + time) * 0.4 +
                                     cos(vPosition.y * 4.0 + time) * 0.4;
                
                float edgeFactor = pow(1.0 - abs(dot(vNormal, viewDir)), 3.0);
                
                gradientFactor += (specular1 + specular2) * 0.7 + edgeFactor * 0.5;
                
                gradientFactor = clamp(gradientFactor, 0.0, 1.0);
                
                vec3 finalColor = mix(color1 * 0.7, color2 * 1.3, gradientFactor);
                
                finalColor += pinkHighlight * (specular1 + specular2) * 0.5;
                finalColor += pinkHighlight * edgeFactor * 0.4;
                
                gl_FragColor = vec4(finalColor, 1.0);
            }
        `,
  });

  const geometry = new THREE.DodecahedronGeometry(1, 1);
  dodecahedron = new THREE.Mesh(geometry, customMaterial);
  scene.add(dodecahedron);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(width, height);
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.minDistance = 2;
  controls.maxDistance = 10;
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;

  window.addEventListener('resize', onWindowResize);

  const resizeObserver = new ResizeObserver(() => {
    onWindowResize();
  });

  resizeObserver.observe(container);
}

function onWindowResize() {
  const container = document.getElementById('geo-container');
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  if (width < 360) {
    camera.position.z = 3.2;
  } else if (width < 480) {
    camera.position.z = 3.0;
  } else {
    camera.position.z = 2.8;
  }

  renderer.setSize(width, height);
}

function animate() {
  requestAnimationFrame(animate);

  if (dodecahedron) {
    dodecahedron.rotation.x += 0.002;
    dodecahedron.rotation.y += 0.003;

    dodecahedron.material.uniforms.time.value += 0.01;
  }

  if (controls) {
    controls.update();
  }

  renderer.render(scene, camera);
}

init();
animate();
