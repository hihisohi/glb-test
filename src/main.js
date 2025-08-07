import * as THREE from "three";
import { GUI } from "dat.gui";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
// controls.enableZoom = false;

// 수직 회전 금지 (위아래 고정)
// controls.minPolarAngle = Math.PI / 80; // 90도
// controls.maxPolarAngle = Math.PI / 80; // 90도

// 좌우 회전도 제한 (360도 자유 회전 막기)
// controls.minAzimuthAngle = -Math.PI / 160; // -45도
// controls.maxAzimuthAngle = Math.PI / 160; // +45도

scene.add(new THREE.AmbientLight(0xffffff, 0.6));
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
scene.add(light);

// 축 가시화
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

//
// ✅ 1. 마스크용 Shape (곡선 형태)
// 여기서는 예시로 둥근 사각형
//
const svgPathData =
  "M444 1H51C39.9543 1 31 9.95428 31 21V236.632C31 243.778 27.188 250.38 21 253.953L11 259.727C4.81198 263.299 1 269.902 1 277.047V454.5C1 465.546 9.95432 474.5 21 474.5H403.716C409.02 474.5 414.107 472.393 417.858 468.642L458.142 428.358C461.893 424.607 464 419.52 464 414.216V21C464 9.95431 455.046 1 444 1Z";
const svgLoader = new SVGLoader();
const svgData = svgLoader.parse(`<path d="${svgPathData}" />`);
const shape = svgData.paths[0].toShapes(true)[0];

// const shape = new THREE.Shape();
// shape.moveTo(-1, -1);
// shape.lineTo(1, -1);
// shape.quadraticCurveTo(1.2, 0, 1, 1);
// shape.lineTo(-1, 1);
// shape.quadraticCurveTo(-1.2, 0, -1, -1);

const maskGeometry = new THREE.ShapeGeometry(shape);
const maskMaterial = new THREE.MeshBasicMaterial({
  colorWrite: false,
  depthWrite: false,
  stencilWrite: true,
  stencilRef: 1,
  stencilFunc: THREE.AlwaysStencilFunc,
  stencilZPass: THREE.ReplaceStencilOp,
});

const maskMesh = new THREE.Mesh(maskGeometry, maskMaterial);
// maskMesh.position.z = 0.5;
maskMesh.scale.set(0.007, -0.007, 1); // 보통 SVG는 좌표가 큼
scene.add(maskMesh);

// 🔧 마스크 중심 계산 (GLB와 정렬을 위해)
const maskBox = new THREE.Box3().setFromObject(maskMesh);
const maskCenter = new THREE.Vector3();
maskBox.getCenter(maskCenter);

//
// ✅ 2. GLB 모델 불러오기 + 마스크 적용
//
const ktx2Loader = new KTX2Loader()
  .setTranscoderPath("/basis/")
  .detectSupport(renderer);

const loader = new GLTFLoader();
loader.setKTX2Loader(ktx2Loader);

loader.load(
  "/assets/glb/landing-2048.glb",
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);
    model.position.z = 0;

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.stencilWrite = true;
        child.material.stencilRef = 1;
        child.material.stencilFunc = THREE.EqualStencilFunc;
        child.material.stencilZPass = THREE.KeepStencilOp;
      }
    });

    // 🔧 GLB 중심 계산
    const modelBox = new THREE.Box3().setFromObject(model);
    const modelCenter = new THREE.Vector3();
    modelBox.getCenter(modelCenter);

    // 🔧 마스크와 모델 중심 차이 계산
    const offset = new THREE.Vector3();
    offset.subVectors(maskCenter, modelCenter);

    // 🔧 중심 맞추기
    model.position.add(offset);

    // ✅ 카메라를 중심으로 이동 + 보기
    camera.position.set(maskCenter.x, maskCenter.y, 3);
    camera.lookAt(maskCenter);

    scene.add(model);
  },
  undefined,
  (err) => console.error("GLB load error:", err)
);

const gui = new GUI();
const cameraFolder = gui.addFolder("Camera");
cameraFolder.add(camera.position, "z", 1, 20);
cameraFolder.open();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  camera.lookAt(maskCenter);

  renderer.render(scene, camera);
}
animate();
