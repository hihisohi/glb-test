import * as THREE from "three";
import { GUI } from "dat.gui";
import { gsap } from "gsap";

import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { KTX2Loader } from "three/examples/jsm/loaders/KTX2Loader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { BrightnessContrastShader } from "three/examples/jsm/shaders/BrightnessContrastShader.js";
import { ColorCorrectionShader } from "three/examples/jsm/shaders/ColorCorrectionShader.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";

console.log('dfd')

const canvasContainer = document.querySelector(".canvas-container");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xffffff);

const camera = new THREE.PerspectiveCamera(
  20, // 시야각을 75에서 60으로 줄여서 더 넓은 뷰 제공
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, stencil: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 픽셀 비율 최적화
canvasContainer.appendChild(renderer.domElement);

// EffectComposer 설정
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

// Brightness 조절을 위한 패스 추가
// const brightnessContrastPass = new ShaderPass(BrightnessContrastShader);
// brightnessContrastPass.uniforms["brightness"].value = 0.5; // Adjust brightness
// brightnessContrastPass.uniforms["contrast"].value = 0; // Adjust contrast
// composer.addPass(brightnessContrastPass);

// 색상보정
// const colorCorrectionPass = new ShaderPass(ColorCorrectionShader);
// colorCorrectionPass.uniforms.powRGB.value = new THREE.Vector3(1.1, 1.0, 0.9); // RGB 각각 조절
// colorCorrectionPass.uniforms.mulRGB.value = new THREE.Vector3(1.0, 1.1, 1.0);
// composer.addPass(colorCorrectionPass);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.screenSpacePanning = false;
controls.minDistance = 1;
controls.maxDistance = 50;

// 카메라 회전 민감도 조정 (매우 작게)
controls.rotateSpeed = 0.1;
controls.panSpeed = 0.3;
controls.zoomSpeed = 0.5;

// zoom과 pan 기능 비활성화
controls.enableZoom = false;
controls.enablePan = false;

// 마우스 움직임에 따른 카메라 제어를 위한 변수들
let mouseX = 0;
let mouseY = 0;
let targetCameraX = 0;
let targetCameraY = 0;
let currentCameraX = 0;
let currentCameraY = 0;
let currentScrollProgress = 0;

// 마스크 회전을 위한 변수들 (위치 대신)
let targetMaskRotationX = 0; // 마스크 X축 회전
let targetMaskRotationY = 0; // 마스크 Y축 회전
let currentMaskRotationX = 0; // 마스크 현재 X축 회전
let currentMaskRotationY = 0; // 마스크 현재 Y축 회전

// 스크롤 애니메이션을 위한 변수들
let currentModel = null;
let currentMaskMesh = null;
let initialCameraZ = 3; // 초기 카메라 z 위치
let initialMaskScale = 0.007; // 초기 마스크 스케일

// 수직 회전 제한 (위아래 회전 범위를 극도로 작게)
controls.minPolarAngle = Math.PI / 2 - Math.PI / 24; // 위쪽 제한
controls.maxPolarAngle = Math.PI / 2 + Math.PI / 24; // 아래쪽 제한

// 좌우 회전 제한 (360도 자유 회전을 극도로 작게 제한)
controls.minAzimuthAngle = -Math.PI / 36;
controls.maxAzimuthAngle = Math.PI / 36;

// 카메라가 z축으로 움직이지 않도록 추가 제한
controls.enableDamping = true;
controls.dampingFactor = 0.1;

const ambientLight = new THREE.AmbientLight(0xffffff, -1.2);
scene.add(ambientLight);

const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(2, 2, 2);
scene.add(light);

// 축 가시화
// const axesHelper = new THREE.AxesHelper(2);
// scene.add(axesHelper);

//
// ✅ 1. 마스크용 Shape
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


// 🔧 마스크의 회전 중심점을 (0,0,0)으로 설정
// geometry의 중심점을 계산하고 조정
maskMesh.geometry.computeBoundingBox();
const geometryCenter = new THREE.Vector3();
maskMesh.geometry.boundingBox.getCenter(geometryCenter);

// geometry를 중심점만큼 이동하여 회전 중심을 (0,0,0)으로 설정
maskMesh.geometry.translate(
  -geometryCenter.x,
  -geometryCenter.y,
  -geometryCenter.z
);

scene.add(maskMesh);

// 🔧 마스크 중심 계산 (GLB와 정렬을 위해)
const maskBox = new THREE.Box3().setFromObject(maskMesh);
const maskCenter = new THREE.Vector3();
maskBox.getCenter(maskCenter);

//
// ✅ 2. GLB 모델 불러오기 + 마스크 적용
//
const ktx2Loader = new KTX2Loader()
  .setTranscoderPath("./basis/")
  .detectSupport(renderer);

const loader = new GLTFLoader();
loader.setKTX2Loader(ktx2Loader);

loader.load(
  "./assets/glb/landing-2048.glb",
  (gltf) => {
    const model = gltf.scene;
    model.scale.set(1, 1, 1);

    model.traverse((child) => {
      if (child.isMesh) {
        child.material.stencilWrite = true;
        child.material.stencilRef = 1;
        child.material.stencilFunc = THREE.EqualStencilFunc;
        child.material.stencilZPass = THREE.KeepStencilOp;
      }
    });

    // 🔧 모델의 바운딩 박스 계산
    const modelBox = new THREE.Box3().setFromObject(model);
    const modelCenter = new THREE.Vector3();
    modelBox.getCenter(modelCenter);

    // 🔧 모델을 (0,0,0)에 위치시키기 위해 중심점만큼 이동
    model.position.sub(modelCenter);

    // 🔧 모델의 y축을 원점보다 살짝 위로 이동
    model.position.y += 0.2;
    model.position.x += 0;

    model.rotation.y = -Math.PI / 30;

    // 🔧 마스크도 (0,0,0)에 맞춰서 위치 조정
    maskMesh.position.sub(maskCenter);

    maskMesh.position.y -= 0.1;
    maskMesh.position.x += 0.1;

    // ✅ 카메라를 (0,0,0)을 바라보도록 설정
    camera.position.set(0, 0, initialCameraZ);
    camera.lookAt(0, 0, 0);

    // 초기 카메라 위치 설정
    currentCameraX = 0;
    currentCameraY = 0;
    targetCameraX = 0;
    targetCameraY = 0;

    // 🔧 전역 변수에 모델과 마스크 할당
    currentModel = model;
    currentMaskMesh = maskMesh;

    // 🔧 디버깅 정보 출력
    console.log("모델 로드 완료!");
    console.log("모델 중심:", modelCenter);
    console.log("마스크 중심:", maskCenter);
    console.log("모델 위치:", model.position);
    console.log("마스크 위치:", maskMesh.position);

    scene.add(model);

    // 스크롤 애니메이션 시작
    setupScrollAnimation();
  },
  undefined,
  (err) => console.error("GLB load error:", err)
);

// const gui = new GUI();
// const cameraFolder = gui.addFolder("Camera");
// cameraFolder.add(camera.position, "z", 1, 20);
// cameraFolder.open();

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 마우스 움직임 이벤트 리스너
window.addEventListener("mousemove", (event) => {
  // 마우스 위치를 -1 ~ 1 범위로 정규화
  mouseX = (event.clientX / window.innerWidth) * 2 - 1;
  mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

  // 스크롤 진행률에 따라 카메라 이동 범위를 동적으로 조정
  const baseRangeX = 0.3; // 기본 좌우 이동 범위
  const baseRangeY = 0.3; // 기본 위아래 이동 범위

  // 스크롤 진행률에 따라 범위 증가 (0.3 -> 1.5, 0.2 -> 1.0)
  const dynamicRangeX = baseRangeX + currentScrollProgress * 0.3;
  const dynamicRangeY = baseRangeY + currentScrollProgress * 0.2;

  // 카메라 이동 범위 설정 (동적으로 조정됨)
  targetCameraX = -mouseX * dynamicRangeX;
  targetCameraY = -mouseY * dynamicRangeY;

  // 마스크 회전 범위 설정 (카메라보다 2배 더 많이 회전)
  const maskRotationMultiplier = -2.0;
  // X축 회전 (위아래 마우스 움직임에 따라)
  targetMaskRotationX = mouseY * dynamicRangeY * maskRotationMultiplier * 0.3; // 0.3은 회전 강도 조절
  // Y축 회전 (좌우 마우스 움직임에 따라)
  targetMaskRotationY = -mouseX * dynamicRangeX * maskRotationMultiplier * 0.3;
});

// 스크롤 애니메이션 설정
function setupScrollAnimation() {
  gsap.to(
    {},
    {
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: `+=${window.innerHeight}`,
        scrub: 1,
        onUpdate: (self) => {
          // 스크롤 진행률에 따라 카메라 z 위치 계산 (3에서 10으로)
          const progress = self.progress;

          currentScrollProgress = self.progress;

          const targetCameraZ = initialCameraZ + progress * 7; // 3 -> 10

          // 카메라 z 위치 업데이트
          camera.position.z = targetCameraZ;

          // 마스크 크기 조정 (중앙을 중심으로 약간 작아짐)
          if (currentMaskMesh) {
            const maskScale = 1 - progress * 0.5; // 1 -> 0.5 (50% 작아짐)

            // 마스크의 원래 중심점 저장
            const originalMaskCenter = new THREE.Vector3();
            const maskBox = new THREE.Box3().setFromObject(currentMaskMesh);
            maskBox.getCenter(originalMaskCenter);

            // 마스크 스케일 적용
            currentMaskMesh.scale.set(
              maskScale * initialMaskScale,
              -maskScale * initialMaskScale,
              maskScale
            );

            const targetY = -0.1 - (progress * 0.6); // -0.1에서 -0.7까지 변화
            currentMaskMesh.position.y = targetY;

            // 스케일 변경 후 새로운 중심점 계산
            const newMaskBox = new THREE.Box3().setFromObject(currentMaskMesh);
            const newMaskCenter = new THREE.Vector3();
            newMaskBox.getCenter(newMaskCenter);

            // 중심점 차이만큼 위치 조정하여 원래 중심 유지
            const centerOffset = new THREE.Vector3();
            centerOffset.subVectors(originalMaskCenter, newMaskCenter);
            currentMaskMesh.position.add(centerOffset);

            // 중심점 조정 후 y 위치 재설정 (중요!)
            currentMaskMesh.position.y = targetY;

            // 카메라가 항상 (0, 0, 0)을 바라보도록 설정
            camera.lookAt(0, 0, 0);

          }

          if (currentModel) {
            const targetModelY = -0.1 - (progress * 0.8); // -0.1에서 -0.7까지 변화
            currentModel.position.y = targetModelY;
          }

          // AmbientLight 밝기: 0.1 -> 1.2로 증가
          if (progress < 0.5) {
            ambientLight.intensity = THREE.MathUtils.lerp(-1.2, 6.0, progress * 2);
          }
          else {
            const normalizedProgress = (progress - 0.5) * 2; // 0 → 1
            ambientLight.intensity = THREE.MathUtils.lerp(6.0, -1.2, normalizedProgress);
          }
        },
      },
    }
  );
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();

  // 마우스 움직임에 따른 카메라 부드러운 이동 (x, y만)
  currentCameraX += (targetCameraX - currentCameraX) * 0.05; // 부드러운 보간
  currentCameraY += (targetCameraY - currentCameraY) * 0.05; // 부드러운 보간

  // 마스크 부드러운 회전 (카메라보다 더 빠르게)
  currentMaskRotationX += (targetMaskRotationX - currentMaskRotationX) * 0.08;
  currentMaskRotationY += (targetMaskRotationY - currentMaskRotationY) * 0.08;

  // 카메라 위치 업데이트 (x, y만 변경, z는 스크롤에 따라 변경됨)
  camera.position.x = currentCameraX;
  camera.position.y = currentCameraY;
  // z 위치는 스크롤 애니메이션에서 제어됨

  // 마스크 회전 업데이트 (위치 대신)
  if (currentMaskMesh) {
    currentMaskMesh.rotation.x = currentMaskRotationX;
    currentMaskMesh.rotation.y = currentMaskRotationY;
  }

  // 카메라가 항상 (0, 0, 0)을 바라보도록 설정
  camera.lookAt(0, 0, 0);

  // renderer.render(scene, camera); // 이 줄을 아래로 변경
  composer.render();
}
animate();
