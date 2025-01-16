// Scene and initial setup
let scene, camera, renderer, mesh;
let isDragging = false;
let previousMousePosition = { x: 0, y: 0 };

// Initialize basic scene components
function init() {
  const container = document.getElementById('terrain-container');
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);

  // Set up orthographic camera
  camera = new THREE.OrthographicCamera(
    -200,
    200, // left, right
    200,
    -200, // top, bottom
    0.1,
    2000 // near, far
  );

  camera.position.set(0, 100, 0);
  camera.lookAt(0, 0, 0);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(400, 400);
  container.appendChild(renderer.domElement);

  // Lighting for height details
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  // Add directional light to show height variations
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 1);
  scene.add(directionalLight);

  // Add mouse controls
  container.addEventListener('mousedown', onMouseDown);
  container.addEventListener('mousemove', onMouseMove);
  container.addEventListener('mouseup', onMouseUp);

  // Load the image
  createTerrainFromImage('8104521.png');
}

function onMouseDown(event) {
  isDragging = true;
  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
}

function onMouseMove(event) {
  if (!isDragging) return;

  const deltaMove = {
    x: event.clientX - previousMousePosition.x,
    y: event.clientY - previousMousePosition.y,
  };

  if (mesh) {
    mesh.position.x += deltaMove.x * 0.5;
    mesh.position.z += deltaMove.y * 0.5;
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY,
  };
}

function onMouseUp() {
  isDragging = false;
}

function createTerrainFromImage(imagePath) {
  const img = new Image();
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const worldWidth = 128;
    const worldDepth = 128;
    canvas.width = worldWidth;
    canvas.height = worldDepth;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0, worldWidth, worldDepth);
    const imageData = ctx.getImageData(0, 0, worldWidth, worldDepth);

    // Create detailed plane geometry for height mapping
    const geometry = new THREE.PlaneGeometry(
      400,
      400,
      worldWidth - 1,
      worldDepth - 1
    );
    geometry.rotateX(-Math.PI / 2);

    // Apply height data from image
    const vertices = geometry.attributes.position.array;
    for (let i = 0; i < worldWidth * worldDepth; i++) {
      const stride = i * 3 + 1; // Y component
      const pixel = i * 4; // RGBA

      // Use brightness for height
      const brightness =
        (imageData.data[pixel] +
          imageData.data[pixel + 1] +
          imageData.data[pixel + 2]) /
        3;

      // Apply height with a moderate scale factor
      vertices[stride] = brightness * 0.2; // Reduced from 0.5 for subtler effect
    }

    // Create texture for the color
    const texture = new THREE.CanvasTexture(canvas);

    // Create material that shows both texture and height variations
    const material = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
      shininess: 0,
      flatShading: true, // This helps show the height variations
    });

    // Remove old mesh if exists
    if (mesh) scene.remove(mesh);

    // Create and add new mesh
    mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    console.log('Terrain mesh created');
  };
  img.src = imagePath;

  img.onerror = function () {
    console.error('Error loading image');
  };
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

init();
animate();
