import * as THREE from "https://threejs.org/build/three.module.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000, 0);
renderer.setSize(window.innerWidth, window.innerHeight);

// Give the renderer's DOM element an ID
renderer.domElement.id = "canvas";


// Append the renderer's DOM element to the container div
const container = document.getElementById("game-container");
container.appendChild(renderer.domElement);

const confettiMaterials = Array.from(
  { length: 100 },
  () =>
    new THREE.MeshBasicMaterial({
      color: getRandomColor(),
      side: THREE.DoubleSide
    })
);
const confettiGeometry = new THREE.PlaneGeometry(10, 20);
function getRandomColor() {
  return Math.random() * 0xffffff;
}

function createConfetti() {
  const confetti = new THREE.Mesh(
    confettiGeometry,
    confettiMaterials[Math.floor(Math.random() * confettiMaterials.length)]
  );
  confetti.position.set(
    Math.random() * window.innerWidth - window.innerWidth / 2,
    window.innerHeight / 2,
    Math.random() * window.innerWidth - window.innerWidth / 2
  );
  confetti.rotation.set(
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI
  );
  scene.add(confetti);

  const confettiSize = Math.random() * 0.5 + 0.1;
  const confettiSpeed = Math.random() * 10.0 + 1.0;

  const animateConfetti = () => {
    confetti.position.y -= confettiSpeed;
    confetti.position.x += Math.sin((confetti.position.y + confetti.position.x) * 0.05) * 1.0;

    if (confetti.position.y < -window.innerHeight / 2) {
      confetti.position.y = window.innerHeight / 2;
    }

    confetti.rotation.x += 0.01;
    confetti.rotation.y += 0.01;

    requestAnimationFrame(animateConfetti);
  };

  animateConfetti();
}

function animate() {

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", onWindowResize);

for (let i = 0; i < 500; i++) {
  createConfetti();
}

// animate();


export { animate };
