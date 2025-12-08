// Curriculum Data Structure

export interface Lesson {
  id: string;
  phaseId: number;
  order: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedMinutes: number;
  theory: {
    content: string;
    videoUrl?: string;
  };
  exercise: {
    instructions: string;
    starterCode: Record<string, string>;
    solutionCode: Record<string, string>;
    hints: string[];
  };
  rewards: {
    xp: number;
    achievements?: string[];
  };
}

export interface Phase {
  id: number;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
}

// Phase 1: Foundations
export const phase1: Phase = {
  id: 1,
  title: 'Foundations',
  description: 'Learn the basics of WebGL and Three.js',
  color: '#6366f1',
  lessons: [
    {
      id: 'phase1-lesson1',
      phaseId: 1,
      order: 1,
      title: 'What is WebGL?',
      description: 'Understand the GPU rendering pipeline and how WebGL works',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      theory: {
        content: `
# What is WebGL?

WebGL (Web Graphics Library) is a JavaScript API that allows you to render interactive 2D and 3D graphics in web browsers without plugins.

## The GPU Pipeline

When you render 3D graphics, your code doesn't draw pixels directly. Instead, it sends **geometry data** (vertices, triangles) and **shaders** (programs that run on the GPU) to be processed.

The rendering pipeline looks like this:

1. **Vertex Data** → Your 3D model's points in space
2. **Vertex Shader** → Transforms positions (rotation, scale, projection)
3. **Rasterization** → Converts triangles to pixels
4. **Fragment Shader** → Calculates the color of each pixel
5. **Frame Buffer** → The final image displayed on screen

## Why Three.js?

Raw WebGL is powerful but verbose. Creating a simple cube requires hundreds of lines of code for:
- Setting up shaders
- Creating vertex buffers
- Managing the rendering loop
- Handling matrices for transformations

**Three.js** abstracts all of this complexity, letting you focus on *what* to render rather than *how*.

\`\`\`javascript
// Raw WebGL: ~200+ lines
// Three.js: 10 lines
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
\`\`\`

## Key Concepts

- **Scene**: The container for all 3D objects
- **Camera**: Your viewpoint into the 3D world
- **Renderer**: Draws the scene to the canvas
- **Mesh**: A 3D object (geometry + material)
- **Geometry**: The shape (vertices, faces)
- **Material**: The appearance (color, texture, shininess)

In the next lesson, we'll create our first Three.js scene!
        `.trim(),
      },
      exercise: {
        instructions: 'This is a theory lesson. Read through the content above, then click "Complete" to continue.',
        starterCode: {},
        solutionCode: {},
        hints: [],
      },
      rewards: {
        xp: 50,
        achievements: ['first_render'],
      },
    },
    {
      id: 'phase1-lesson2',
      phaseId: 1,
      order: 2,
      title: 'Your First Scene',
      description: 'Create a scene with a camera, renderer, and a spinning cube',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      theory: {
        content: `
# Your First Three.js Scene

Every Three.js application needs three core components:

## 1. The Scene

The scene is like a stage where all your 3D objects live:

\`\`\`javascript
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);
\`\`\`

## 2. The Camera

The camera defines what we see. The most common is \`PerspectiveCamera\`:

\`\`\`javascript
const camera = new THREE.PerspectiveCamera(
  75,    // Field of view (degrees)
  width / height,  // Aspect ratio
  0.1,   // Near clipping plane
  1000   // Far clipping plane
);
camera.position.z = 5; // Move camera back to see the scene
\`\`\`

## 3. The Renderer

The renderer draws everything to a canvas:

\`\`\`javascript
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
\`\`\`

## Adding Objects

Create a mesh by combining geometry and material:

\`\`\`javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
\`\`\`

## The Animation Loop

To animate, we need to render repeatedly:

\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
\`\`\`

Now it's your turn! Create a scene with a rotating cube.
        `.trim(),
      },
      exercise: {
        instructions: `
Create a Three.js scene with:
1. A scene with a dark background
2. A perspective camera positioned at z = 5
3. A renderer that fills the viewport
4. A cube with indigo color (#6366f1)
5. Animation that rotates the cube on the Y axis
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';

// TODO: Create the scene
const scene = // your code here

// TODO: Create the camera

// TODO: Create the renderer

// TODO: Create a cube (geometry + material + mesh)

// TODO: Position the camera

// TODO: Create animation loop
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';

// Create the scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Create a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// Position the camera
camera.position.z = 5;

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'Start by creating a new THREE.Scene() and setting its background color',
          'Use THREE.PerspectiveCamera(75, aspect, 0.1, 1000) for the camera',
          'Remember to add the cube to the scene with scene.add(cube)',
          'The animation loop should use requestAnimationFrame for smooth animation',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase1-lesson3',
      phaseId: 1,
      order: 3,
      title: 'Geometries',
      description: 'Explore built-in geometries and their parameters',
      difficulty: 'beginner',
      estimatedMinutes: 12,
      theory: {
        content: `
# Three.js Geometries

Geometries define the **shape** of 3D objects. Three.js includes many built-in geometries.

## Box Geometry

The most basic 3D shape:

\`\`\`javascript
new THREE.BoxGeometry(width, height, depth);
new THREE.BoxGeometry(1, 2, 1); // Tall box
\`\`\`

## Sphere Geometry

\`\`\`javascript
new THREE.SphereGeometry(
  radius,
  widthSegments,  // More = smoother
  heightSegments
);
new THREE.SphereGeometry(1, 32, 32);
\`\`\`

## Cylinder Geometry

\`\`\`javascript
new THREE.CylinderGeometry(
  radiusTop,
  radiusBottom,
  height,
  radialSegments
);
new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
\`\`\`

## Torus Geometry (Donut)

\`\`\`javascript
new THREE.TorusGeometry(
  radius,
  tube,      // Thickness
  radialSegments,
  tubularSegments
);
new THREE.TorusGeometry(1, 0.4, 16, 100);
\`\`\`

## Plane Geometry

\`\`\`javascript
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments);
new THREE.PlaneGeometry(10, 10);
\`\`\`

## Segments Matter!

More segments = smoother curves but more vertices (slower).

For a sphere:
- 8 segments: Blocky (good for low-poly style)
- 32 segments: Smooth (standard)
- 64+ segments: Very smooth (for close-ups)

Try different segment values in the exercise!
        `.trim(),
      },
      exercise: {
        instructions: `
Create a scene showcasing different geometries:
1. A sphere on the left
2. A torus (donut) in the center
3. A cylinder on the right
4. Position them so they don't overlap

Use different colors for each shape!
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add ambient light
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// TODO: Create a sphere on the left (-3, 0, 0)

// TODO: Create a torus in the center (0, 0, 0)

// TODO: Create a cylinder on the right (3, 0, 0)

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add lights
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Sphere on the left
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -3;
scene.add(sphere);

// Torus in the center
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e });
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
scene.add(torus);

// Cylinder on the right
const cylinderGeometry = new THREE.CylinderGeometry(0.5, 0.5, 2, 32);
const cylinderMaterial = new THREE.MeshStandardMaterial({ color: 0xf59e0b });
const cylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
cylinder.position.x = 3;
scene.add(cylinder);

function animate() {
  requestAnimationFrame(animate);

  // Optional: rotate the shapes
  sphere.rotation.y += 0.01;
  torus.rotation.x += 0.01;
  torus.rotation.y += 0.01;
  cylinder.rotation.y += 0.01;

  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'SphereGeometry takes (radius, widthSegments, heightSegments)',
          'TorusGeometry takes (radius, tubeRadius, radialSegments, tubularSegments)',
          'Use mesh.position.x to move objects left/right',
          'MeshStandardMaterial looks better than MeshBasicMaterial with lights',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase1-lesson4',
      phaseId: 1,
      order: 4,
      title: 'Materials & Textures',
      description: 'Learn how materials affect the appearance of 3D objects',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      theory: {
        content: `
# Materials & Textures

Materials define how a mesh **looks** - its color, shininess, transparency, and more.

## Basic Materials

### MeshBasicMaterial
The simplest material - not affected by lights:

\`\`\`javascript
new THREE.MeshBasicMaterial({
  color: 0x6366f1,
  wireframe: false
})
\`\`\`

### MeshStandardMaterial
Physics-based rendering (PBR) - reacts to lights realistically:

\`\`\`javascript
new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  metalness: 0.5,    // 0 = plastic, 1 = metal
  roughness: 0.3,    // 0 = mirror, 1 = diffuse
})
\`\`\`

### MeshPhongMaterial
Classic lighting with specular highlights:

\`\`\`javascript
new THREE.MeshPhongMaterial({
  color: 0x6366f1,
  shininess: 100,
  specular: 0xffffff,
})
\`\`\`

## Key Properties

- **color**: Base color of the material
- **metalness**: How metallic the surface appears (0-1)
- **roughness**: How rough/smooth the surface is (0-1)
- **transparent**: Enable transparency
- **opacity**: Transparency level (0-1, needs transparent: true)
- **side**: Which faces to render (FrontSide, BackSide, DoubleSide)

## Loading Textures

Textures add detail without extra geometry:

\`\`\`javascript
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('/textures/wood.jpg');

const material = new THREE.MeshStandardMaterial({
  map: texture,           // Color/diffuse texture
  normalMap: normalTex,   // Surface detail
  roughnessMap: roughTex, // Roughness variation
});
\`\`\`

Try different materials and see how they interact with lights!
        `.trim(),
      },
      exercise: {
        instructions: `
Create a scene demonstrating different materials:
1. A sphere with MeshStandardMaterial (metallic, smooth)
2. A cube with MeshPhongMaterial (shiny plastic)
3. A torus with MeshBasicMaterial (wireframe)
4. Add proper lighting to see the differences
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// TODO: Create a metallic sphere with MeshStandardMaterial

// TODO: Create a shiny cube with MeshPhongMaterial

// TODO: Create a wireframe torus with MeshBasicMaterial

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, 6);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// Metallic sphere
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({
  color: 0x6366f1,
  metalness: 0.9,
  roughness: 0.1,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.x = -2.5;
scene.add(sphere);

// Shiny cube
const cubeGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
const cubeMaterial = new THREE.MeshPhongMaterial({
  color: 0x22c55e,
  shininess: 100,
  specular: 0xffffff,
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
scene.add(cube);

// Wireframe torus
const torusGeometry = new THREE.TorusGeometry(1, 0.4, 16, 100);
const torusMaterial = new THREE.MeshBasicMaterial({
  color: 0xf59e0b,
  wireframe: true,
});
const torus = new THREE.Mesh(torusGeometry, torusMaterial);
torus.position.x = 2.5;
scene.add(torus);

function animate() {
  requestAnimationFrame(animate);
  sphere.rotation.y += 0.01;
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;
  torus.rotation.x += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'MeshStandardMaterial uses metalness and roughness properties',
          'MeshPhongMaterial uses shininess and specular properties',
          'Set wireframe: true on MeshBasicMaterial for wireframe rendering',
          'Position objects using mesh.position.x to spread them out',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase1-lesson5',
      phaseId: 1,
      order: 5,
      title: 'Lighting',
      description: 'Master different light types and shadows',
      difficulty: 'intermediate',
      estimatedMinutes: 18,
      theory: {
        content: `
# Lighting in Three.js

Lights bring your 3D scenes to life. Without lights, materials like MeshStandardMaterial appear completely black!

## Light Types

### AmbientLight
Illuminates all objects equally from all directions:

\`\`\`javascript
const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);
\`\`\`

### DirectionalLight
Parallel rays like sunlight:

\`\`\`javascript
const directional = new THREE.DirectionalLight(0xffffff, 1);
directional.position.set(5, 10, 5);
scene.add(directional);
\`\`\`

### PointLight
Emits light from a single point in all directions:

\`\`\`javascript
const point = new THREE.PointLight(0xff6b6b, 1, 10);
point.position.set(0, 3, 0);
scene.add(point);
\`\`\`

### SpotLight
Cone of light like a flashlight:

\`\`\`javascript
const spot = new THREE.SpotLight(0xffffff, 1);
spot.position.set(0, 5, 0);
spot.angle = Math.PI / 6;      // Cone angle
spot.penumbra = 0.2;           // Edge softness
spot.target.position.set(0, 0, 0);
scene.add(spot);
scene.add(spot.target);
\`\`\`

## Shadows

Shadows add realism but cost performance:

\`\`\`javascript
// Enable shadows on renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Light must cast shadows
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;

// Meshes cast and receive shadows
mesh.castShadow = true;
floor.receiveShadow = true;
\`\`\`

## Performance Tips

- Fewer lights = better performance
- Ambient + 1 directional is often enough
- Use shadow maps sparingly
- Lower shadow map resolution for better FPS
        `.trim(),
      },
      exercise: {
        instructions: `
Create a dramatically lit scene:
1. Add an ambient light (low intensity)
2. Add a directional light with shadows
3. Add a colored point light
4. Create a floor that receives shadows
5. Create objects that cast shadows
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 4, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
// TODO: Enable shadows on the renderer
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// TODO: Add ambient light

// TODO: Add directional light with shadows

// TODO: Add a colored point light

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
// TODO: Enable shadow receiving on floor
scene.add(floor);

// Create objects
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
// TODO: Enable shadow casting on cube
scene.add(cube);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(3, 4, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// Directional light with shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 8, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048;
directionalLight.shadow.mapSize.height = 2048;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;
scene.add(directionalLight);

// Colored point light
const pointLight = new THREE.PointLight(0xff6b6b, 1, 10);
pointLight.position.set(-2, 2, 0);
scene.add(pointLight);

// Create a floor
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

// Create objects
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0.5, 0);
cube.castShadow = true;
scene.add(cube);

// Add a sphere to show point light effect
const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x22c55e });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(-1.5, 0.5, 1);
sphere.castShadow = true;
scene.add(sphere);

function animate() {
  requestAnimationFrame(animate);
  cube.rotation.y += 0.01;
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'Enable shadows with renderer.shadowMap.enabled = true',
          'Lights need castShadow = true to create shadows',
          'Objects need castShadow = true and floors need receiveShadow = true',
          'Increase shadow.mapSize for sharper shadows',
        ],
      },
      rewards: {
        xp: 125,
      },
    },
    {
      id: 'phase1-lesson6',
      phaseId: 1,
      order: 6,
      title: 'Camera Controls',
      description: 'Master OrbitControls and camera manipulation',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      theory: {
        content: `
# Camera Controls

Interactive camera controls transform static scenes into explorable 3D environments. Let's master OrbitControls and other camera techniques.

## OrbitControls

The most common camera control - lets users orbit, zoom, and pan:

\`\`\`javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const controls = new OrbitControls(camera, renderer.domElement);

// Damping makes movement smoother
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Limit zoom range
controls.minDistance = 2;
controls.maxDistance = 20;

// Limit vertical rotation
controls.minPolarAngle = Math.PI / 6;  // 30 degrees
controls.maxPolarAngle = Math.PI / 2;  // 90 degrees
\`\`\`

## Update in Animation Loop

Always update controls in your animation loop:

\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);
  controls.update(); // Required for damping
  renderer.render(scene, camera);
}
\`\`\`

## Auto-Rotation

Make the camera orbit automatically:

\`\`\`javascript
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0; // Default is 2.0
\`\`\`

## Camera Animation

Smoothly animate the camera to new positions:

\`\`\`javascript
// Using lerp (linear interpolation)
const targetPosition = new THREE.Vector3(5, 3, 5);
const targetLookAt = new THREE.Vector3(0, 0, 0);

function animate() {
  camera.position.lerp(targetPosition, 0.05);
  controls.target.lerp(targetLookAt, 0.05);
  controls.update();
}
\`\`\`

## Other Control Types

- **FlyControls**: Flight simulator style
- **FirstPersonControls**: FPS camera
- **PointerLockControls**: Mouse-locked FPS
- **TrackballControls**: Unlimited rotation
        `.trim(),
      },
      exercise: {
        instructions: `
Create a scene with advanced camera controls:
1. Add OrbitControls with damping enabled
2. Set zoom limits (min: 3, max: 15)
3. Enable auto-rotation
4. Limit vertical rotation to prevent going under the floor
5. Create a few objects to orbit around
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// TODO: Create OrbitControls with damping

// TODO: Set zoom limits

// TODO: Enable auto-rotation

// TODO: Limit vertical rotation

// Create some objects
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
scene.add(floor);

function animate() {
  requestAnimationFrame(animate);
  // TODO: Update controls
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(5, 5, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create OrbitControls with damping
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Set zoom limits
controls.minDistance = 3;
controls.maxDistance = 15;

// Enable auto-rotation
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;

// Limit vertical rotation (prevent going under the floor)
controls.minPolarAngle = Math.PI / 6; // 30 degrees
controls.maxPolarAngle = Math.PI / 2.1; // Just above 90 degrees

// Create some objects
const geometry = new THREE.TorusKnotGeometry(1, 0.3, 100, 16);
const material = new THREE.MeshStandardMaterial({ color: 0x6366f1 });
const torusKnot = new THREE.Mesh(geometry, material);
scene.add(torusKnot);

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1a2e });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
scene.add(floor);

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'Create controls with: new OrbitControls(camera, renderer.domElement)',
          'Enable damping: controls.enableDamping = true',
          'Set zoom limits with minDistance and maxDistance',
          'Limit vertical angle with minPolarAngle and maxPolarAngle',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase1-lesson7',
      phaseId: 1,
      order: 7,
      title: 'Animation Basics',
      description: 'Create smooth animations with requestAnimationFrame and GSAP',
      difficulty: 'intermediate',
      estimatedMinutes: 18,
      theory: {
        content: `
# Animation Basics

Animation brings 3D scenes to life. Let's explore different animation techniques.

## The Animation Loop

\`requestAnimationFrame\` is the foundation of smooth animation:

\`\`\`javascript
function animate() {
  requestAnimationFrame(animate);

  // Update your scene here
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
\`\`\`

## Frame-Rate Independence

Use the clock for consistent animation speed:

\`\`\`javascript
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta(); // Time since last frame
  const elapsed = clock.getElapsedTime(); // Total time

  // Animation independent of frame rate
  cube.rotation.y += delta * 2; // 2 radians per second

  // Time-based animations
  cube.position.y = Math.sin(elapsed) * 2;
}
\`\`\`

## Trigonometric Animations

Use Math.sin and Math.cos for smooth oscillations:

\`\`\`javascript
// Bobbing up and down
mesh.position.y = Math.sin(time * 2) * 0.5;

// Circular motion
mesh.position.x = Math.cos(time) * radius;
mesh.position.z = Math.sin(time) * radius;

// Pulsing scale
mesh.scale.setScalar(1 + Math.sin(time * 3) * 0.1);
\`\`\`

## Easing Functions

Easing makes animations feel natural:

\`\`\`javascript
// Linear (no easing)
t = t;

// Ease out (start fast, end slow)
t = 1 - Math.pow(1 - t, 3);

// Ease in out (smooth start and end)
t = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
\`\`\`

## Lerp (Linear Interpolation)

Smoothly transition between values:

\`\`\`javascript
// Lerp function
function lerp(start, end, t) {
  return start + (end - start) * t;
}

// Smooth camera movement
camera.position.x = lerp(camera.position.x, targetX, 0.05);
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create an animated scene with multiple animation types:
1. A cube that rotates continuously
2. A sphere that bobs up and down using Math.sin
3. A torus that orbits in a circle
4. Use the Clock for frame-rate independent animation
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// TODO: Create a Clock

// Create objects
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x6366f1 })
);
cube.position.x = -3;
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x22c55e })
);
scene.add(sphere);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xf59e0b })
);
torus.position.x = 3;
scene.add(torus);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x1a1a2e })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
scene.add(floor);

function animate() {
  requestAnimationFrame(animate);

  // TODO: Get delta and elapsed time from clock

  // TODO: Rotate cube

  // TODO: Bob sphere up and down

  // TODO: Orbit torus in a circle

  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0a0a0f);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 4, 8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);

// Create Clock for time-based animation
const clock = new THREE.Clock();

// Create objects
const cube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0x6366f1 })
);
cube.position.x = -3;
scene.add(cube);

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.7, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x22c55e })
);
scene.add(sphere);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.5, 0.2, 16, 100),
  new THREE.MeshStandardMaterial({ color: 0xf59e0b })
);
scene.add(torus);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: 0x1a1a2e })
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2;
scene.add(floor);

const orbitRadius = 3;

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  // Rotate cube (frame-rate independent)
  cube.rotation.x += delta;
  cube.rotation.y += delta * 0.5;

  // Bob sphere up and down using sine wave
  sphere.position.y = Math.sin(elapsed * 2) * 0.5;

  // Orbit torus in a circle
  torus.position.x = Math.cos(elapsed) * orbitRadius;
  torus.position.z = Math.sin(elapsed) * orbitRadius;
  torus.rotation.y = elapsed; // Face direction of travel

  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'Create a clock with: const clock = new THREE.Clock()',
          'Get time with: clock.getDelta() and clock.getElapsedTime()',
          'Math.sin() returns values between -1 and 1',
          'For circular motion, use cos for X and sin for Z',
        ],
      },
      rewards: {
        xp: 125,
      },
    },
    {
      id: 'phase1-lesson8',
      phaseId: 1,
      order: 8,
      title: 'Project: Solar System',
      description: 'Build a complete solar system with orbiting planets',
      difficulty: 'intermediate',
      estimatedMinutes: 25,
      theory: {
        content: `
# Project: Solar System

Let's combine everything you've learned to create an interactive solar system!

## Project Overview

We'll build:
- A glowing sun at the center
- Multiple planets with different sizes, colors, and orbit speeds
- A moon orbiting Earth
- Orbital rings for visualization
- Interactive camera controls

## Hierarchical Transformations

Parent-child relationships make orbits easy:

\`\`\`javascript
// Earth orbit pivot (invisible object at center)
const earthOrbit = new THREE.Object3D();
scene.add(earthOrbit);

// Earth is child of orbit pivot
const earth = new THREE.Mesh(geometry, material);
earth.position.x = 5; // Distance from sun
earthOrbit.add(earth);

// Rotate the pivot, Earth orbits automatically!
earthOrbit.rotation.y += 0.01;
\`\`\`

## Creating Glowing Effects

Emissive materials create glow:

\`\`\`javascript
const sunMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffaa00,
  emissiveIntensity: 1,
  color: 0xffaa00,
});
\`\`\`

## Orbit Visualization

Draw orbital paths with rings:

\`\`\`javascript
const orbitGeometry = new THREE.RingGeometry(
  orbitRadius - 0.05,
  orbitRadius + 0.05,
  64
);
const orbitMaterial = new THREE.MeshBasicMaterial({
  color: 0x444444,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 0.3,
});
const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
orbit.rotation.x = -Math.PI / 2;
scene.add(orbit);
\`\`\`

## Planet Data Structure

\`\`\`javascript
const planets = [
  { name: 'Mercury', radius: 0.2, distance: 3, speed: 4.15, color: 0x8c7853 },
  { name: 'Venus', radius: 0.4, distance: 4.5, speed: 1.62, color: 0xffc649 },
  { name: 'Earth', radius: 0.5, distance: 6, speed: 1, color: 0x6b93d6 },
  { name: 'Mars', radius: 0.3, distance: 8, speed: 0.53, color: 0xc1440e },
];
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Build an interactive solar system:
1. Create a glowing sun at the center
2. Add at least 4 planets with different sizes, distances, and orbit speeds
3. Add Earth's moon orbiting around Earth
4. Show orbital paths as rings
5. Add OrbitControls for navigation
6. Use hierarchical transforms for orbits

Bonus: Add planet rotation and different orbital speeds!
        `.trim(),
        starterCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ambient light for visibility
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// TODO: Create the sun with emissive material

// TODO: Create a point light at the sun's position

// Planet data
const planetData = [
  { name: 'Mercury', radius: 0.3, distance: 4, speed: 4.15, color: 0x8c7853 },
  { name: 'Venus', radius: 0.5, distance: 6, speed: 1.62, color: 0xffc649 },
  { name: 'Earth', radius: 0.6, distance: 8, speed: 1, color: 0x6b93d6 },
  { name: 'Mars', radius: 0.4, distance: 10, speed: 0.53, color: 0xc1440e },
];

// TODO: Create planets with orbits
// For each planet:
// 1. Create an orbit pivot (Object3D at center)
// 2. Create the planet mesh
// 3. Position planet at its distance
// 4. Add planet to orbit pivot
// 5. Add orbit pivot to scene
// 6. Create orbital ring

// Store references for animation
const orbits: THREE.Object3D[] = [];
const planets: THREE.Mesh[] = [];

// TODO: Add Earth's moon

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // TODO: Rotate orbit pivots based on planet speed

  // TODO: Rotate planets on their axes

  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        solutionCode: {
          '/index.ts': `import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000011);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 20, 30);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Create the sun
const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshStandardMaterial({
  emissive: 0xffaa00,
  emissiveIntensity: 1,
  color: 0xffaa00,
});
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Point light at sun position
const sunLight = new THREE.PointLight(0xffffff, 2, 100);
sunLight.position.set(0, 0, 0);
scene.add(sunLight);

// Planet data
const planetData = [
  { name: 'Mercury', radius: 0.3, distance: 4, speed: 4.15, color: 0x8c7853 },
  { name: 'Venus', radius: 0.5, distance: 6, speed: 1.62, color: 0xffc649 },
  { name: 'Earth', radius: 0.6, distance: 8, speed: 1, color: 0x6b93d6 },
  { name: 'Mars', radius: 0.4, distance: 10, speed: 0.53, color: 0xc1440e },
];

// Store references
const orbits: THREE.Object3D[] = [];
const planets: THREE.Mesh[] = [];

// Create planets with orbits
planetData.forEach((data) => {
  // Orbit pivot
  const orbitPivot = new THREE.Object3D();
  scene.add(orbitPivot);
  orbits.push(orbitPivot);

  // Planet
  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);
  const material = new THREE.MeshStandardMaterial({ color: data.color });
  const planet = new THREE.Mesh(geometry, material);
  planet.position.x = data.distance;
  planet.userData = { speed: data.speed };
  orbitPivot.add(planet);
  planets.push(planet);

  // Orbital ring
  const ringGeometry = new THREE.RingGeometry(data.distance - 0.05, data.distance + 0.05, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0x444444,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.3,
  });
  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2;
  scene.add(ring);
});

// Add Earth's moon
const earthOrbit = orbits[2];
const earth = planets[2];

const moonOrbit = new THREE.Object3D();
earth.add(moonOrbit);

const moonGeometry = new THREE.SphereGeometry(0.15, 16, 16);
const moonMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const moon = new THREE.Mesh(moonGeometry, moonMaterial);
moon.position.x = 1.2;
moonOrbit.add(moon);

// Add some stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const starPositions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i += 3) {
  starPositions[i] = (Math.random() - 0.5) * 200;
  starPositions[i + 1] = (Math.random() - 0.5) * 200;
  starPositions[i + 2] = (Math.random() - 0.5) * 200;
}
starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.2 });
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const elapsed = clock.getElapsedTime();

  // Rotate sun
  sun.rotation.y = elapsed * 0.1;

  // Rotate orbits
  orbits.forEach((orbit, i) => {
    orbit.rotation.y = elapsed * planetData[i].speed * 0.2;
  });

  // Rotate planets on their axes
  planets.forEach((planet) => {
    planet.rotation.y += 0.02;
  });

  // Rotate moon orbit
  moonOrbit.rotation.y = elapsed * 5;

  controls.update();
  renderer.render(scene, camera);
}
animate();
`,
        },
        hints: [
          'Use Object3D as invisible pivots for orbits',
          'Child objects inherit parent transformations',
          'Emissive materials glow without external light',
          'RingGeometry creates flat orbital path visuals',
        ],
      },
      rewards: {
        xp: 200,
        achievements: ['phase_1_complete'],
      },
    },
  ],
};

// Phase 2: React Three Fiber
export const phase2: Phase = {
  id: 2,
  title: 'React Three Fiber',
  description: 'Build 3D experiences with React',
  color: '#8b5cf6',
  lessons: [
    {
      id: 'phase2-lesson1',
      phaseId: 2,
      order: 1,
      title: 'Why React Three Fiber?',
      description: 'Understand the benefits of declarative 3D with React',
      difficulty: 'beginner',
      estimatedMinutes: 10,
      theory: {
        content: `
# Why React Three Fiber?

React Three Fiber (R3F) is a React renderer for Three.js. It lets you write Three.js code using JSX components.

## Imperative vs Declarative

**Imperative (Vanilla Three.js):**
\`\`\`javascript
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({ color: 'hotpink' });
const mesh = new THREE.Mesh(geometry, material);
mesh.position.x = 2;
scene.add(mesh);
\`\`\`

**Declarative (React Three Fiber):**
\`\`\`jsx
<mesh position={[2, 0, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="hotpink" />
</mesh>
\`\`\`

## Benefits

1. **Familiar Patterns**: Use React's component model, hooks, and state
2. **Automatic Cleanup**: Components unmount properly, preventing memory leaks
3. **Concurrent Mode**: R3F works with React's concurrent features
4. **Ecosystem**: Leverage the Drei helper library for common patterns

## The Canvas

Everything starts with the \`<Canvas>\` component:

\`\`\`jsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas>
      {/* 3D content goes here */}
      <mesh>
        <boxGeometry />
        <meshBasicMaterial color="orange" />
      </mesh>
    </Canvas>
  )
}
\`\`\`

R3F automatically:
- Creates the scene, camera, and renderer
- Sets up the animation loop
- Handles resizing
- Manages the WebGL context

In the next lesson, we'll build our first R3F scene!
        `.trim(),
      },
      exercise: {
        instructions: 'This is a theory lesson. Read through the content above, then click "Complete" to continue.',
        starterCode: {},
        solutionCode: {},
        hints: [],
      },
      rewards: {
        xp: 50,
      },
    },
    {
      id: 'phase2-lesson2',
      phaseId: 2,
      order: 2,
      title: 'Your First R3F Scene',
      description: 'Build a complete 3D scene with React components',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      theory: {
        content: `
# Your First R3F Scene

Let's build a complete scene using React Three Fiber's declarative approach.

## Setting Up the Canvas

The Canvas component sets up everything automatically:

\`\`\`jsx
import { Canvas } from '@react-three/fiber'

function App() {
  return (
    <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
      {/* 3D content */}
    </Canvas>
  )
}
\`\`\`

## Creating Meshes

In R3F, Three.js classes become JSX components:

\`\`\`jsx
// Three.js class → camelCase JSX tag
// THREE.Mesh → <mesh>
// THREE.BoxGeometry → <boxGeometry>
// THREE.MeshStandardMaterial → <meshStandardMaterial>

<mesh position={[0, 0, 0]} rotation={[0, Math.PI / 4, 0]}>
  <boxGeometry args={[1, 1, 1]} />
  <meshStandardMaterial color="hotpink" />
</mesh>
\`\`\`

## The args Prop

Constructor arguments are passed via the \`args\` prop:

\`\`\`jsx
// THREE.SphereGeometry(1, 32, 32) becomes:
<sphereGeometry args={[1, 32, 32]} />

// THREE.MeshStandardMaterial({ color: 'blue', metalness: 0.5 }) becomes:
<meshStandardMaterial color="blue" metalness={0.5} />
\`\`\`

## Adding Lights

\`\`\`jsx
<ambientLight intensity={0.5} />
<directionalLight position={[10, 10, 5]} intensity={1} />
<pointLight position={[-10, -10, -10]} color="red" />
\`\`\`

## Grouping Objects

Use \`<group>\` to organize and transform multiple objects together:

\`\`\`jsx
<group position={[0, 1, 0]} rotation={[0, Math.PI / 2, 0]}>
  <mesh position={[0, 0, 0]}>...</mesh>
  <mesh position={[2, 0, 0]}>...</mesh>
</group>
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create a React Three Fiber scene with:
1. A Canvas with a positioned camera
2. Ambient and directional lighting
3. A rotating group containing multiple shapes
4. Different materials on each shape
        `.trim(),
        starterCode: {
          '/App.tsx': `import { Canvas } from '@react-three/fiber'

function Scene() {
  return (
    <>
      {/* TODO: Add lights */}

      {/* TODO: Add a group with multiple meshes */}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Scene() {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state, delta) => {
    groupRef.current.rotation.y += delta * 0.5
  })

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />

      <group ref={groupRef}>
        <mesh position={[-2, 0, 0]}>
          <sphereGeometry args={[0.7, 32, 32]} />
          <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
        </mesh>

        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#22c55e" />
        </mesh>

        <mesh position={[2, 0, 0]}>
          <torusGeometry args={[0.5, 0.2, 16, 100]} />
          <meshStandardMaterial color="#f59e0b" />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#1a1a2e" />
      </mesh>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Use <ambientLight> and <directionalLight> for lighting',
          'Create a <group> element and add useRef to animate it',
          'Use useFrame hook to rotate the group each frame',
          'Geometry args match Three.js constructor parameters',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase2-lesson3',
      phaseId: 2,
      order: 3,
      title: 'The useFrame Hook',
      description: 'Animate objects using React Three Fiber hooks',
      difficulty: 'beginner',
      estimatedMinutes: 12,
      theory: {
        content: `
# The useFrame Hook

\`useFrame\` is R3F's most important hook. It runs every frame (60+ times per second) and is how you create animations.

## Basic Usage

\`\`\`jsx
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'

function RotatingCube() {
  const meshRef = useRef()

  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta
  })

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="orange" />
    </mesh>
  )
}
\`\`\`

## The State Object

The first parameter gives you access to everything:

\`\`\`jsx
useFrame((state) => {
  state.clock      // THREE.Clock - elapsed time
  state.camera     // The active camera
  state.scene      // The scene
  state.gl         // The WebGL renderer
  state.pointer    // Mouse position (-1 to 1)
  state.viewport   // Viewport dimensions
})
\`\`\`

## Delta Time

Always use \`delta\` for frame-rate independent animation:

\`\`\`jsx
// Bad - speed depends on frame rate
meshRef.current.rotation.y += 0.01

// Good - consistent speed regardless of FPS
meshRef.current.rotation.y += delta
\`\`\`

## Accessing Clock Time

Create time-based animations:

\`\`\`jsx
useFrame((state) => {
  const time = state.clock.elapsedTime
  meshRef.current.position.y = Math.sin(time) * 2
})
\`\`\`

## Render Priority

Control when your code runs:

\`\`\`jsx
// Run before everything else
useFrame(() => { ... }, -1)

// Run after everything else
useFrame(() => { ... }, 1)
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create animations using useFrame:
1. A cube that rotates continuously
2. A sphere that bounces up and down using Math.sin
3. A torus that scales based on time
4. Use delta for consistent animation speed
        `.trim(),
        starterCode: {
          '/App.tsx': `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  // TODO: Add useFrame to rotate the cube

  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

function BouncingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)

  // TODO: Add useFrame to make sphere bounce using Math.sin

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  )
}

function PulsingTorus() {
  const meshRef = useRef<THREE.Mesh>(null!)

  // TODO: Add useFrame to scale the torus

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <torusGeometry args={[0.4, 0.2, 16, 100]} />
      <meshStandardMaterial color="#f59e0b" />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <AnimatedCube />
        <BouncingSphere />
        <PulsingTorus />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function AnimatedCube() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef} position={[-2, 0, 0]}>
      <boxGeometry />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

function BouncingSphere() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    meshRef.current.position.y = Math.sin(time * 2) * 0.5
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  )
}

function PulsingTorus() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    const time = state.clock.elapsedTime
    const scale = 1 + Math.sin(time * 3) * 0.2
    meshRef.current.scale.setScalar(scale)
    meshRef.current.rotation.x += 0.01
  })

  return (
    <mesh ref={meshRef} position={[2, 0, 0]}>
      <torusGeometry args={[0.4, 0.2, 16, 100]} />
      <meshStandardMaterial color="#f59e0b" />
    </mesh>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 6], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <AnimatedCube />
        <BouncingSphere />
        <PulsingTorus />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Use state.clock.elapsedTime for time-based animations',
          'Math.sin returns values between -1 and 1',
          'Use delta for rotation speed that\'s independent of frame rate',
          'mesh.scale.setScalar(n) sets uniform scale on all axes',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase2-lesson4',
      phaseId: 2,
      order: 4,
      title: 'OrbitControls & Drei Helpers',
      description: 'Use the Drei library for common 3D patterns',
      difficulty: 'beginner',
      estimatedMinutes: 15,
      theory: {
        content: `
# OrbitControls & Drei Helpers

**Drei** (German for "three") is a helper library for React Three Fiber with ready-to-use components.

## Installing Drei

\`\`\`bash
npm install @react-three/drei
\`\`\`

## OrbitControls

The easiest way to add camera controls:

\`\`\`jsx
import { OrbitControls } from '@react-three/drei'

function Scene() {
  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        minDistance={2}
        maxDistance={20}
        autoRotate
      />
      <mesh>
        <boxGeometry />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}
\`\`\`

## Environment & Lighting

Instant beautiful lighting:

\`\`\`jsx
import { Environment } from '@react-three/drei'

// Preset environments
<Environment preset="sunset" />
<Environment preset="city" />
<Environment preset="studio" />

// Custom HDRI
<Environment files="/hdr/warehouse.hdr" />
\`\`\`

## Useful Drei Components

**Center** - Center objects in the scene:
\`\`\`jsx
<Center>
  <mesh>...</mesh>
</Center>
\`\`\`

**Float** - Make objects float:
\`\`\`jsx
<Float speed={2} rotationIntensity={1}>
  <mesh>...</mesh>
</Float>
\`\`\`

**Text** - 3D text:
\`\`\`jsx
<Text
  fontSize={1}
  color="white"
  anchorX="center"
  anchorY="middle"
>
  Hello World
</Text>
\`\`\`

**Stars** - Starfield background:
\`\`\`jsx
<Stars radius={100} depth={50} count={5000} />
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create a scene using Drei helpers:
1. Add OrbitControls with damping and auto-rotate
2. Use Environment for lighting (try "sunset" preset)
3. Add floating 3D text
4. Add a starfield background
5. Use Center to center your content
        `.trim(),
        starterCode: {
          '/App.tsx': `import { Canvas } from '@react-three/fiber'
// TODO: Import components from @react-three/drei

function Scene() {
  return (
    <>
      {/* TODO: Add OrbitControls */}

      {/* TODO: Add Environment */}

      {/* TODO: Add Stars */}

      {/* TODO: Add centered, floating content */}
      <mesh>
        <boxGeometry />
        <meshStandardMaterial color="#6366f1" />
      </mesh>

      {/* TODO: Add 3D Text */}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Stars, Float, Text, Center } from '@react-three/drei'

function Scene() {
  return (
    <>
      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={0.5}
      />

      <Environment preset="sunset" />

      <Stars radius={100} depth={50} count={5000} factor={4} />

      <Center>
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
          <mesh>
            <torusKnotGeometry args={[1, 0.3, 128, 16]} />
            <meshStandardMaterial color="#6366f1" metalness={0.8} roughness={0.2} />
          </mesh>
        </Float>
      </Center>

      <Text
        position={[0, -2, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        React Three Fiber
      </Text>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Import components: { OrbitControls, Environment, Stars, Float, Text, Center }',
          'Environment preset="sunset" adds instant lighting',
          'Wrap content in Float for hovering animation',
          'Text needs fontSize and position props',
        ],
      },
      rewards: {
        xp: 100,
      },
    },
    {
      id: 'phase2-lesson5',
      phaseId: 2,
      order: 5,
      title: 'State & Interactivity',
      description: 'Handle clicks, hover states, and React state in 3D',
      difficulty: 'intermediate',
      estimatedMinutes: 18,
      theory: {
        content: `
# State & Interactivity

R3F integrates seamlessly with React's state management.

## Click Events

\`\`\`jsx
function ClickableCube() {
  const [clicked, setClicked] = useState(false)

  return (
    <mesh onClick={() => setClicked(!clicked)}>
      <boxGeometry />
      <meshStandardMaterial color={clicked ? 'hotpink' : 'orange'} />
    </mesh>
  )
}
\`\`\`

## Hover Events

\`\`\`jsx
function HoverableSphere() {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.2 : 1}
    >
      <sphereGeometry />
      <meshStandardMaterial color={hovered ? 'lightblue' : 'white'} />
    </mesh>
  )
}
\`\`\`

## Cursor Changes

Set document cursor on hover:

\`\`\`jsx
<mesh
  onPointerOver={() => {
    setHovered(true)
    document.body.style.cursor = 'pointer'
  }}
  onPointerOut={() => {
    setHovered(false)
    document.body.style.cursor = 'default'
  }}
>
\`\`\`

## Event Properties

R3F events include useful data:

\`\`\`jsx
<mesh onClick={(event) => {
  event.stopPropagation() // Stop event bubbling
  console.log(event.point)     // Click position in 3D
  console.log(event.distance)  // Distance from camera
  console.log(event.face)      // Clicked face
}}>
\`\`\`

## Spring Animations

Use react-spring for smooth transitions:

\`\`\`jsx
import { useSpring, animated } from '@react-spring/three'

function AnimatedBox() {
  const [active, setActive] = useState(false)

  const { scale, color } = useSpring({
    scale: active ? 1.5 : 1,
    color: active ? '#ff6b6b' : '#6366f1',
  })

  return (
    <animated.mesh
      scale={scale}
      onClick={() => setActive(!active)}
    >
      <boxGeometry />
      <animated.meshStandardMaterial color={color} />
    </animated.mesh>
  )
}
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create an interactive scene:
1. A cube that changes color when clicked (toggle between two colors)
2. A sphere that scales up on hover
3. Show cursor pointer on hoverable objects
4. Display click count using 3D text
5. Stop event propagation to prevent clicking through objects
        `.trim(),
        starterCode: {
          '/App.tsx': `import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Environment } from '@react-three/drei'

function ClickableCube({ position }: { position: [number, number, number] }) {
  // TODO: Add clicked state
  // TODO: Handle click to toggle color

  return (
    <mesh position={position}>
      <boxGeometry />
      <meshStandardMaterial color="#6366f1" />
    </mesh>
  )
}

function HoverableSphere({ position }: { position: [number, number, number] }) {
  // TODO: Add hovered state
  // TODO: Handle pointer over/out
  // TODO: Change cursor on hover
  // TODO: Scale on hover

  return (
    <mesh position={position}>
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial color="#22c55e" />
    </mesh>
  )
}

function Scene() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <>
      <OrbitControls />
      <Environment preset="city" />

      <ClickableCube position={[-2, 0, 0]} />
      <HoverableSphere position={[2, 0, 0]} />

      {/* TODO: Add 3D text showing click count */}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text, Environment } from '@react-three/drei'

function ClickableCube({
  position,
  onClicked,
}: {
  position: [number, number, number]
  onClicked: () => void
}) {
  const [clicked, setClicked] = useState(false)

  const handleClick = (event: any) => {
    event.stopPropagation()
    setClicked(!clicked)
    onClicked()
  }

  return (
    <mesh
      position={position}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'default')}
    >
      <boxGeometry />
      <meshStandardMaterial color={clicked ? '#f59e0b' : '#6366f1'} />
    </mesh>
  )
}

function HoverableSphere({ position }: { position: [number, number, number] }) {
  const [hovered, setHovered] = useState(false)

  return (
    <mesh
      position={position}
      scale={hovered ? 1.2 : 1}
      onPointerOver={() => {
        setHovered(true)
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        setHovered(false)
        document.body.style.cursor = 'default'
      }}
    >
      <sphereGeometry args={[0.7, 32, 32]} />
      <meshStandardMaterial color={hovered ? '#86efac' : '#22c55e'} />
    </mesh>
  )
}

function Scene() {
  const [clickCount, setClickCount] = useState(0)

  return (
    <>
      <OrbitControls />
      <Environment preset="city" />

      <ClickableCube position={[-2, 0, 0]} onClicked={() => setClickCount((c) => c + 1)} />
      <HoverableSphere position={[2, 0, 0]} />

      <Text position={[0, -2, 0]} fontSize={0.5} color="white" anchorX="center">
        Clicks: {clickCount}
      </Text>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Use useState to track clicked/hovered states',
          'event.stopPropagation() prevents click-through',
          'Change document.body.style.cursor for pointer feedback',
          'Pass callback props to share state with parent',
        ],
      },
      rewards: {
        xp: 125,
      },
    },
    {
      id: 'phase2-lesson6',
      phaseId: 2,
      order: 6,
      title: 'Loading 3D Models',
      description: 'Import and display GLTF/GLB models',
      difficulty: 'intermediate',
      estimatedMinutes: 15,
      theory: {
        content: `
# Loading 3D Models

GLTF (GL Transmission Format) is the standard for 3D models on the web.

## The useGLTF Hook

Drei provides an easy way to load models:

\`\`\`jsx
import { useGLTF } from '@react-three/drei'

function Model() {
  const { scene } = useGLTF('/models/robot.glb')
  return <primitive object={scene} />
}
\`\`\`

## Preloading Models

Preload models to avoid loading delays:

\`\`\`jsx
useGLTF.preload('/models/robot.glb')
\`\`\`

## Accessing Model Parts

GLTF files contain nodes and materials:

\`\`\`jsx
function Model() {
  const { nodes, materials } = useGLTF('/models/robot.glb')

  return (
    <group>
      <mesh
        geometry={nodes.Body.geometry}
        material={materials.Metal}
      />
      <mesh
        geometry={nodes.Head.geometry}
        material={materials.Glass}
      />
    </group>
  )
}
\`\`\`

## Suspense for Loading

Use React Suspense for loading states:

\`\`\`jsx
import { Suspense } from 'react'

function Scene() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Model />
    </Suspense>
  )
}

function LoadingSpinner() {
  return (
    <mesh>
      <sphereGeometry args={[0.5, 16, 16]} />
      <meshBasicMaterial wireframe color="white" />
    </mesh>
  )
}
\`\`\`

## Adjusting Models

Transform loaded models:

\`\`\`jsx
<primitive
  object={scene}
  scale={0.5}
  position={[0, -1, 0]}
  rotation={[0, Math.PI, 0]}
/>
\`\`\`

## GLTF to JSX

Use gltfjsx to convert models to React components:

\`\`\`bash
npx gltfjsx model.glb
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Since we can't upload models in the sandbox, let's simulate model loading:
1. Create a "model" component that represents a loaded 3D object
2. Use Suspense with a loading fallback
3. Create a compound object (robot-like) using basic geometries
4. Add proper positioning and scaling
5. Make parts of the "model" interactive
        `.trim(),
        starterCode: {
          '/App.tsx': `import { Suspense, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { useRef } from 'react'
import * as THREE from 'three'

// Simulated loading delay
function useDelayedLoad(delay: number) {
  const [loaded, setLoaded] = useState(false)
  useState(() => {
    setTimeout(() => setLoaded(true), delay)
  })
  if (!loaded) throw new Promise((resolve) => setTimeout(resolve, delay))
  return loaded
}

function LoadingFallback() {
  // TODO: Create a spinning wireframe sphere as loading indicator
  return null
}

function RobotModel() {
  // Simulate model loading
  useDelayedLoad(1000)

  // TODO: Create a robot-like compound object using:
  // - Box for body
  // - Sphere for head
  // - Cylinders for arms/legs
  // - Make head rotate with useFrame

  return (
    <group>
      {/* Your robot parts here */}
    </group>
  )
}

function Scene() {
  return (
    <>
      <OrbitControls />
      <Environment preset="city" />

      {/* TODO: Wrap model in Suspense with fallback */}
      <RobotModel />
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { Suspense, useState, useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import * as THREE from 'three'

function LoadingFallback() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((_, delta) => {
    meshRef.current.rotation.x += delta
    meshRef.current.rotation.y += delta * 0.5
  })

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry args={[0.5, 1]} />
      <meshBasicMaterial wireframe color="#6366f1" />
    </mesh>
  )
}

function RobotModel() {
  const headRef = useRef<THREE.Mesh>(null!)
  const [eyeColor, setEyeColor] = useState('#00ff00')

  useFrame((state) => {
    // Head looks around
    headRef.current.rotation.y = Math.sin(state.clock.elapsedTime) * 0.3
  })

  return (
    <group position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[1, 1.5, 0.6]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh
        ref={headRef}
        position={[0, 2.2, 0]}
        onClick={() => setEyeColor(eyeColor === '#00ff00' ? '#ff0000' : '#00ff00')}
        onPointerOver={() => (document.body.style.cursor = 'pointer')}
        onPointerOut={() => (document.body.style.cursor = 'default')}
      >
        <boxGeometry args={[0.8, 0.8, 0.8]} />
        <meshStandardMaterial color="#718096" metalness={0.6} roughness={0.3} />

        {/* Eyes */}
        <mesh position={[-0.2, 0.1, 0.41]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.2, 0.1, 0.41]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color={eyeColor} emissive={eyeColor} emissiveIntensity={0.5} />
        </mesh>
      </mesh>

      {/* Arms */}
      <mesh position={[-0.8, 1, 0]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 1, 0]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.25, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.25, 0, 0]}>
        <cylinderGeometry args={[0.12, 0.12, 0.8, 16]} />
        <meshStandardMaterial color="#4a5568" metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

function DelayedRobot() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  if (!ready) {
    throw new Promise((resolve) => setTimeout(resolve, 1500))
  }

  return <RobotModel />
}

function Scene() {
  return (
    <>
      <OrbitControls />
      <Environment preset="city" />

      <Suspense fallback={<LoadingFallback />}>
        <DelayedRobot />
      </Suspense>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#0a0a0f' }}>
      <Canvas camera={{ position: [0, 2, 5] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Use <group> to combine multiple meshes',
          'Suspense catches promises thrown during render',
          'Child meshes inherit parent transforms',
          'useRef + useFrame for per-frame animation',
        ],
      },
      rewards: {
        xp: 125,
      },
    },
    {
      id: 'phase2-lesson7',
      phaseId: 2,
      order: 7,
      title: 'Post-Processing Effects',
      description: 'Add bloom, depth of field, and other visual effects',
      difficulty: 'advanced',
      estimatedMinutes: 20,
      theory: {
        content: `
# Post-Processing Effects

Post-processing adds cinematic effects to your scenes.

## Setup with EffectComposer

\`\`\`jsx
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing'

function Scene() {
  return (
    <>
      <mesh>...</mesh>

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.1}
          luminanceSmoothing={0.9}
        />
      </EffectComposer>
    </>
  )
}
\`\`\`

## Bloom Effect

Makes bright objects glow:

\`\`\`jsx
<Bloom
  intensity={1.5}           // Bloom strength
  luminanceThreshold={0.1}  // Brightness threshold
  luminanceSmoothing={0.9}  // Smoothness
  radius={0.8}              // Blur radius
/>
\`\`\`

For bloom to work, use emissive materials:

\`\`\`jsx
<meshStandardMaterial
  color="#ff6b6b"
  emissive="#ff6b6b"
  emissiveIntensity={2}
/>
\`\`\`

## Depth of Field

Cinematic focus effect:

\`\`\`jsx
<DepthOfField
  focusDistance={0.02}  // Focus distance (0-1)
  focalLength={0.5}     // Focal length
  bokehScale={2}        // Bokeh size
/>
\`\`\`

## Vignette

Darkens edges for cinematic look:

\`\`\`jsx
import { Vignette } from '@react-three/postprocessing'

<Vignette
  offset={0.5}    // Start of darkening
  darkness={0.5}  // Darkness intensity
/>
\`\`\`

## Chromatic Aberration

RGB color fringing:

\`\`\`jsx
import { ChromaticAberration } from '@react-three/postprocessing'

<ChromaticAberration offset={[0.002, 0.002]} />
\`\`\`

## Combining Effects

\`\`\`jsx
<EffectComposer>
  <Bloom intensity={1} />
  <Vignette darkness={0.5} />
  <ChromaticAberration offset={[0.001, 0.001]} />
</EffectComposer>
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Create a visually stunning scene with post-processing:
1. Add glowing objects using emissive materials
2. Apply Bloom effect to make them glow
3. Add Vignette for cinematic edges
4. Create contrast between glowing and non-glowing objects
5. Experiment with effect parameters
        `.trim(),
        starterCode: {
          '/App.tsx': `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
// TODO: Import EffectComposer, Bloom, Vignette from @react-three/postprocessing
import * as THREE from 'three'

function GlowingOrb({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      {/* TODO: Add emissive material for glow */}
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

function NonGlowingCube({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <OrbitControls autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} />

      {/* Glowing orbs */}
      <GlowingOrb position={[-2, 0, 0]} color="#ff6b6b" />
      <GlowingOrb position={[0, 0, 0]} color="#6366f1" />
      <GlowingOrb position={[2, 0, 0]} color="#22c55e" />

      {/* Non-glowing cubes for contrast */}
      <NonGlowingCube position={[-1, -1.5, 0]} />
      <NonGlowingCube position={[1, -1.5, 0]} />

      {/* TODO: Add EffectComposer with Bloom and Vignette */}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function GlowingOrb({ position, color }: { position: [number, number, number], color: string }) {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.2
  })

  return (
    <mesh ref={meshRef} position={position}>
      <sphereGeometry args={[0.3, 32, 32]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={2}
        toneMapped={false}
      />
    </mesh>
  )
}

function NonGlowingCube({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <boxGeometry args={[0.8, 0.8, 0.8]} />
      <meshStandardMaterial color="#374151" metalness={0.5} roughness={0.5} />
    </mesh>
  )
}

function CenterOrb() {
  const meshRef = useRef<THREE.Mesh>(null!)

  useFrame((state) => {
    meshRef.current.rotation.y = state.clock.elapsedTime * 0.5
  })

  return (
    <mesh ref={meshRef} position={[0, 1, 0]}>
      <torusKnotGeometry args={[0.5, 0.15, 100, 16]} />
      <meshStandardMaterial
        color="#f59e0b"
        emissive="#f59e0b"
        emissiveIntensity={3}
        toneMapped={false}
      />
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <OrbitControls autoRotate autoRotateSpeed={0.5} />
      <ambientLight intensity={0.1} />
      <pointLight position={[10, 10, 10]} intensity={0.5} />

      <CenterOrb />

      {/* Glowing orbs */}
      <GlowingOrb position={[-2, 0, 0]} color="#ff6b6b" />
      <GlowingOrb position={[0, 0, 0]} color="#6366f1" />
      <GlowingOrb position={[2, 0, 0]} color="#22c55e" />

      {/* Non-glowing cubes for contrast */}
      <NonGlowingCube position={[-1, -1.5, 0]} />
      <NonGlowingCube position={[1, -1.5, 0]} />

      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#111" />
      </mesh>

      <EffectComposer>
        <Bloom
          intensity={1.5}
          luminanceThreshold={0.2}
          luminanceSmoothing={0.9}
          radius={0.8}
        />
        <Vignette offset={0.3} darkness={0.7} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 6] }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Set emissive and emissiveIntensity on materials for glow',
          'toneMapped={false} prevents color clamping',
          'Lower ambient light makes bloom more visible',
          'Vignette darkness above 0.5 creates strong effect',
        ],
      },
      rewards: {
        xp: 150,
      },
    },
    {
      id: 'phase2-lesson8',
      phaseId: 2,
      order: 8,
      title: 'Project: Interactive Gallery',
      description: 'Build a 3D art gallery with navigation and effects',
      difficulty: 'advanced',
      estimatedMinutes: 30,
      theory: {
        content: `
# Project: Interactive Gallery

Let's build an immersive 3D gallery that showcases everything you've learned!

## Project Features

- 3D room environment
- Multiple interactive "artworks"
- Click to focus on artwork
- Smooth camera transitions
- Post-processing effects
- Ambient sound/music (optional)

## Camera Focus System

Animate camera to focus on clicked items:

\`\`\`jsx
function useCameraFocus() {
  const [focusTarget, setFocusTarget] = useState(null)

  useFrame((state) => {
    if (focusTarget) {
      state.camera.position.lerp(focusTarget.cameraPos, 0.05)
      state.camera.lookAt(focusTarget.lookAt)
    }
  })

  return { setFocusTarget }
}
\`\`\`

## Artwork Component

\`\`\`jsx
function Artwork({ position, imageUrl, title, onFocus }) {
  const [hovered, setHovered] = useState(false)

  return (
    <group position={position}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[2.2, 1.7, 0.1]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Canvas */}
      <mesh position={[0, 0, 0.06]} onClick={onFocus}>
        <planeGeometry args={[2, 1.5]} />
        <meshBasicMaterial>
          <texture attach="map" url={imageUrl} />
        </meshBasicMaterial>
      </mesh>

      {/* Title */}
      <Text position={[0, -1.1, 0]} fontSize={0.15}>
        {title}
      </Text>
    </group>
  )
}
\`\`\`

## Room Environment

\`\`\`jsx
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Walls */}
      <mesh position={[0, 3, -10]}>
        <planeGeometry args={[20, 6]} />
        <meshStandardMaterial color="#2a2a2a" />
      </mesh>

      {/* Ceiling with lights */}
      {/* ... */}
    </group>
  )
}
\`\`\`

## Spotlight for Each Artwork

\`\`\`jsx
<spotLight
  position={[artwork.x, 5, artwork.z + 2]}
  target={artworkRef.current}
  angle={0.3}
  penumbra={0.5}
  intensity={1}
/>
\`\`\`
        `.trim(),
      },
      exercise: {
        instructions: `
Build an interactive 3D gallery:
1. Create a room with floor and walls
2. Add multiple "artwork" displays (colored planes as placeholders)
3. Implement hover effects on artworks
4. Add spotlight lighting on each artwork
5. Add post-processing (bloom on highlights, vignette)
6. Make artworks clickable with visual feedback

Bonus: Add smooth camera focus when clicking artworks!
        `.trim(),
        starterCode: {
          '/App.tsx': `import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text, Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function Artwork({
  position,
  color,
  title,
}: {
  position: [number, number, number]
  color: string
  title: string
}) {
  // TODO: Add hovered state
  // TODO: Create frame and canvas
  // TODO: Add hover/click effects
  // TODO: Add title text

  return (
    <group position={position}>
      {/* Frame */}
      <mesh>
        <boxGeometry args={[2.4, 1.8, 0.1]} />
        <meshStandardMaterial color="#1a1a1a" />
      </mesh>

      {/* Canvas placeholder */}
      <mesh position={[0, 0, 0.06]}>
        <planeGeometry args={[2.2, 1.6]} />
        <meshStandardMaterial color={color} />
      </mesh>
    </group>
  )
}

function Room() {
  // TODO: Create floor, walls, ceiling

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#0a0a0a" />
      </mesh>
    </group>
  )
}

function Scene() {
  const artworks = [
    { position: [-4, 1.5, -5] as [number, number, number], color: '#6366f1', title: 'Indigo Dreams' },
    { position: [0, 1.5, -5] as [number, number, number], color: '#22c55e', title: 'Emerald Forest' },
    { position: [4, 1.5, -5] as [number, number, number], color: '#f59e0b', title: 'Golden Hour' },
  ]

  return (
    <>
      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
        minDistance={3}
        maxDistance={10}
      />

      {/* Ambient light */}
      <ambientLight intensity={0.2} />

      <Room />

      {/* TODO: Add artworks with spotlights */}
      {artworks.map((art, i) => (
        <Artwork key={i} {...art} />
      ))}

      {/* TODO: Add post-processing effects */}
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }}>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        solutionCode: {
          '/App.tsx': `import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, Text } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

function Artwork({
  position,
  color,
  title,
}: {
  position: [number, number, number]
  color: string
  title: string
}) {
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  const groupRef = useRef<THREE.Group>(null!)

  useFrame(() => {
    if (groupRef.current) {
      const targetZ = hovered ? 0.2 : 0
      groupRef.current.position.z = THREE.MathUtils.lerp(
        groupRef.current.position.z,
        targetZ,
        0.1
      )
    }
  })

  return (
    <group position={position}>
      {/* Spotlight */}
      <spotLight
        position={[0, 3, 2]}
        angle={0.4}
        penumbra={0.5}
        intensity={hovered ? 2 : 1}
        color={hovered ? '#ffffff' : '#ffeedd'}
      />

      <group
        ref={groupRef}
        onPointerOver={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
        onClick={() => setClicked(!clicked)}
      >
        {/* Frame */}
        <mesh>
          <boxGeometry args={[2.4, 1.8, 0.15]} />
          <meshStandardMaterial color={hovered ? '#2a2a2a' : '#1a1a1a'} />
        </mesh>

        {/* Canvas */}
        <mesh position={[0, 0, 0.08]}>
          <planeGeometry args={[2.2, 1.6]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={clicked ? 0.3 : 0}
          />
        </mesh>

        {/* Inner glow frame */}
        {hovered && (
          <mesh position={[0, 0, 0.07]}>
            <planeGeometry args={[2.3, 1.7]} />
            <meshBasicMaterial color={color} transparent opacity={0.1} />
          </mesh>
        )}
      </group>

      {/* Title */}
      <Text
        position={[0, -1.2, 0]}
        fontSize={0.12}
        color={hovered ? '#ffffff' : '#666666'}
        anchorX="center"
      >
        {title}
      </Text>
    </group>
  )
}

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#080808" />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 2, -6]}>
        <planeGeometry args={[15, 5]} />
        <meshStandardMaterial color="#0f0f0f" />
      </mesh>

      {/* Left wall */}
      <mesh position={[-7.5, 2, 0]} rotation={[0, Math.PI / 2, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>

      {/* Right wall */}
      <mesh position={[7.5, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
        <planeGeometry args={[12, 5]} />
        <meshStandardMaterial color="#0d0d0d" />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 4.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
    </group>
  )
}

function Scene() {
  const artworks = [
    { position: [-4, 1.5, -5.5] as [number, number, number], color: '#6366f1', title: 'Indigo Dreams' },
    { position: [0, 1.5, -5.5] as [number, number, number], color: '#22c55e', title: 'Emerald Forest' },
    { position: [4, 1.5, -5.5] as [number, number, number], color: '#f59e0b', title: 'Golden Hour' },
  ]

  return (
    <>
      <OrbitControls
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={3}
        maxDistance={10}
        enablePan={false}
      />

      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 0]} intensity={0.3} />

      <Room />

      {artworks.map((art, i) => (
        <Artwork key={i} {...art} />
      ))}

      {/* Gallery title */}
      <Text
        position={[0, 3.5, -5.9]}
        fontSize={0.3}
        color="#333333"
        anchorX="center"
      >
        LUMINA GALLERY
      </Text>

      <EffectComposer>
        <Bloom
          intensity={0.5}
          luminanceThreshold={0.6}
          luminanceSmoothing={0.9}
        />
        <Vignette offset={0.3} darkness={0.8} />
      </EffectComposer>
    </>
  )
}

export default function App() {
  return (
    <div style={{ width: '100vw', height: '100vh', background: '#000' }}>
      <Canvas camera={{ position: [0, 2, 8], fov: 50 }} shadows>
        <Scene />
      </Canvas>
    </div>
  )
}
`,
          '/index.tsx': `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
`,
        },
        hints: [
          'Use groups to organize frame + canvas + light together',
          'Lerp position.z for smooth hover animation',
          'SpotLight with target creates focused lighting',
          'Click state can toggle emissive intensity',
        ],
      },
      rewards: {
        xp: 250,
        achievements: ['phase_2_complete'],
      },
    },
  ],
};

// Export all phases
export const curriculum: Phase[] = [phase1, phase2];

// Helper functions
export function getPhase(phaseId: number): Phase | undefined {
  return curriculum.find((p) => p.id === phaseId);
}

export function getLesson(lessonId: string): Lesson | undefined {
  for (const phase of curriculum) {
    const lesson = phase.lessons.find((l) => l.id === lessonId);
    if (lesson) return lesson;
  }
  return undefined;
}

export function getLessonByPhaseAndOrder(phaseId: number, order: number): Lesson | undefined {
  const phase = getPhase(phaseId);
  return phase?.lessons.find((l) => l.order === order);
}
