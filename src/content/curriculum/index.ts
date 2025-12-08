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
