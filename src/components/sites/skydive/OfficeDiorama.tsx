"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// Procedural warm parquet oak floor texture
function createParquetTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#dfc39a";
  ctx.fillRect(0, 0, 1024, 1024);

  const plankW = 128;
  const plankH = 32;
  const shades = ["#e5c89f", "#ddbe94", "#dfc096", "#d7b78b", "#e9cca3", "#d9ba8d", "#cca879"];

  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(100, 70, 40, 0.35)";

  for (let y = 0; y < 1024; y += plankH) {
    const rowOffset = ((y / plankH) % 2) * (plankW / 2);
    for (let x = -plankW; x < 1024 + plankW; x += plankW) {
      const px = x + rowOffset;
      const shade = shades[Math.floor(Math.random() * shades.length)];
      ctx.fillStyle = shade;
      ctx.fillRect(px, y, plankW, plankH);

      // Fine wood grain lines
      ctx.fillStyle = "rgba(90, 60, 30, 0.05)";
      for (let g = 3; g < plankH; g += 5) {
        ctx.fillRect(px, y + g, plankW, 1.2);
      }

      ctx.strokeRect(px, y, plankW, plankH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1.5, 1.5);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// 5-petal circular pinwheel rug texture
function createPinwheelRugTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f5eee4";
  ctx.beginPath();
  ctx.arc(256, 256, 250, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#e5ddce";
  ctx.lineWidth = 6;
  ctx.stroke();

  // 5 Petals: coral pink, deep orange, golden yellow, leaf green, cyan teal
  const colors = ["#e95f74", "#ef7e22", "#f5be2b", "#51a853", "#2296b7"];
  const petalCount = 5;
  const centerR = 36;
  const petalLen = 95;
  const petalW = 62;

  ctx.save();
  ctx.translate(256, 256);

  for (let i = 0; i < petalCount; i++) {
    const angle = (i * 2 * Math.PI) / petalCount - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);

    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.moveTo(0, -centerR);
    ctx.bezierCurveTo(
      -petalW / 2,
      -centerR - petalLen * 0.35,
      -petalW / 2,
      -centerR - petalLen,
      0,
      -centerR - petalLen
    );
    ctx.bezierCurveTo(
      petalW / 2,
      -centerR - petalLen,
      petalW / 2,
      -centerR - petalLen * 0.35,
      0,
      -centerR
    );
    ctx.fill();
    ctx.restore();
  }

  ctx.fillStyle = "#f5eee4";
  ctx.beginPath();
  ctx.arc(0, 0, centerR - 2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Vending machine "INTEGRATIONS" texture
function createVendingSignTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 96;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#2e2b28";
  ctx.fillRect(0, 0, 512, 96);

  ctx.fillStyle = "#fbf8f2";
  ctx.font = "800 46px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("INTEGRATIONS", 256, 50);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Nameplate texture
function createNameplateTexture(name: string): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 72;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#f8f5ee";
  ctx.fillRect(0, 0, 256, 72);

  ctx.strokeStyle = "#ded7cb";
  ctx.lineWidth = 4;
  ctx.strokeRect(3, 3, 250, 66);

  ctx.fillStyle = "#2c2825";
  ctx.font = "700 34px Inter, system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(name, 128, 38);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Laptop logo texture
function createLaptopLogoTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext("2d")!;

  const colors = ["#e95f74", "#ef7e22", "#f5be2b", "#51a853", "#2296b7"];
  ctx.translate(64, 64);
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate((i * 2 * Math.PI) / 5);
    ctx.fillStyle = colors[i];
    ctx.beginPath();
    ctx.arc(0, -20, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.fillStyle = "#cfd2d8";
  ctx.beginPath();
  ctx.arc(0, 0, 9, 0, Math.PI * 2);
  ctx.fill();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Soft radial contact shadow texture
function createSoftShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext("2d")!;

  const grad = ctx.createRadialGradient(256, 256, 80, 256, 256, 250);
  grad.addColorStop(0, "rgba(28, 24, 20, 0.18)");
  grad.addColorStop(0.5, "rgba(28, 24, 20, 0.08)");
  grad.addColorStop(1, "rgba(28, 24, 20, 0)");

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

export interface OfficeDioramaProps {
  onEnterPinboard?: () => void;
  onOpenRegister?: () => void;
  onTriggerKillerDemo?: () => void;
  onScrollToFeatures?: () => void;
}

export function OfficeDiorama({
  onEnterPinboard,
  onOpenRegister,
  onTriggerKillerDemo,
  onScrollToFeatures,
}: OfficeDioramaProps = {}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const resetCameraRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- 1. THREE.JS SCENE SETUP ---
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      28,
      container.clientWidth / container.clientHeight,
      1,
      4000
    );
    // Camera looking down along isometric line of sight
    camera.position.set(0, 310, 800);
    camera.lookAt(0, 32, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 32, 0);
    controls.maxPolarAngle = Math.PI / 2 - 0.08;
    controls.minDistance = 350;
    controls.maxDistance = 1200;
    controls.enablePan = false;

    resetCameraRef.current = () => {
      camera.position.set(0, 310, 800);
      camera.lookAt(0, 32, 0);
      controls.target.set(0, 32, 0);
      controls.update();
    };

    // --- 2. LIGHTING ---
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xfffaef, 2.5);
    keyLight.position.set(300, 520, 380);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 50;
    keyLight.shadow.camera.far = 1500;
    keyLight.shadow.camera.left = -260;
    keyLight.shadow.camera.right = 260;
    keyLight.shadow.camera.top = 260;
    keyLight.shadow.camera.bottom = -260;
    keyLight.shadow.bias = -0.0003;
    keyLight.shadow.radius = 2.5;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xdde8fc, 0.95);
    fillLight.position.set(-280, 260, -180);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xfff0db, 0.6);
    rimLight.position.set(0, 300, -380);
    scene.add(rimLight);

    // --- 3. DIORAMA BASE SLAB & FLOOR ---
    const dioramaGroup = new THREE.Group();
    // 45 degrees rotation so corner points forward
    dioramaGroup.rotation.y = Math.PI / 4;
    scene.add(dioramaGroup);

    // Soft radial ground shadow (no harsh edges)
    const shadowGeo = new THREE.PlaneGeometry(440, 440);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createSoftShadowTexture(),
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -0.1;
    scene.add(shadowMesh);

    // Base slab (warm cream wooden podium with rounded corners)
    const slabW = 260;
    const slabD = 260;
    const slabH = 12;
    const slabRadius = 14;

    const slabShape = new THREE.Shape();
    const halfW = slabW / 2;
    const halfD = slabD / 2;

    slabShape.moveTo(-halfW + slabRadius, -halfD);
    slabShape.lineTo(halfW - slabRadius, -halfD);
    slabShape.quadraticCurveTo(halfW, -halfD, halfW, -halfD + slabRadius);
    slabShape.lineTo(halfW, halfD - slabRadius);
    slabShape.quadraticCurveTo(halfW, halfD, halfW - slabRadius, halfD);
    slabShape.lineTo(-halfW + slabRadius, halfD);
    slabShape.quadraticCurveTo(-halfW, halfD, -halfW, halfD - slabRadius);
    slabShape.lineTo(-halfW, -halfD + slabRadius);
    slabShape.quadraticCurveTo(-halfW, -halfD, -halfW + slabRadius, -halfD);

    const slabGeo = new THREE.ExtrudeGeometry(slabShape, {
      depth: slabH,
      bevelEnabled: true,
      bevelSegments: 4,
      steps: 1,
      bevelSize: 2,
      bevelThickness: 2,
    });
    slabGeo.rotateX(Math.PI / 2);

    const slabMat = new THREE.MeshStandardMaterial({
      color: 0xede6d8,
      roughness: 0.85,
      metalness: 0.04,
    });
    const slabMesh = new THREE.Mesh(slabGeo, slabMat);
    slabMesh.position.y = slabH;
    slabMesh.receiveShadow = true;
    slabMesh.castShadow = true;
    dioramaGroup.add(slabMesh);

    // Top surface of slab is at y = 14
    const floorY = 14.1;

    // Parquet Floor Plane
    const parquetTexture = createParquetTexture();
    const floorGeo = new THREE.PlaneGeometry(slabW - 4, slabD - 4);
    const floorMat = new THREE.MeshStandardMaterial({
      map: parquetTexture,
      roughness: 0.55,
      metalness: 0.05,
    });
    const floorMesh = new THREE.Mesh(floorGeo, floorMat);
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.position.y = floorY;
    floorMesh.receiveShadow = true;
    dioramaGroup.add(floorMesh);

    // --- 4. CENTER PINWHEEL RUG ---
    const rugTexture = createPinwheelRugTexture();
    const rugGeo = new THREE.CylinderGeometry(44, 44, 0.4, 64);
    const rugMat = new THREE.MeshStandardMaterial({
      map: rugTexture,
      roughness: 0.9,
    });
    const rugMesh = new THREE.Mesh(rugGeo, rugMat);
    rugMesh.position.set(-6, floorY + 0.25, 6);
    rugMesh.receiveShadow = true;
    dioramaGroup.add(rugMesh);

    // --- 5. MODERN COUCH (LEFT SIDE FACING INWARD) ---
    const couchGroup = new THREE.Group();
    couchGroup.position.set(-68, floorY, 14);
    // Couch faces inward towards rug and desk
    couchGroup.rotation.y = Math.PI / 2;
    dioramaGroup.add(couchGroup);

    const upholsteryMat = new THREE.MeshStandardMaterial({
      color: 0xdde2ec,
      roughness: 0.8,
    });
    const underCushionMat = new THREE.MeshStandardMaterial({
      color: 0xc6d0dc,
      roughness: 0.85,
    });
    const darkWoodMat = new THREE.MeshStandardMaterial({
      color: 0x2e241c,
      roughness: 0.7,
    });

    // Base frame
    const couchBase = new THREE.Mesh(new THREE.BoxGeometry(78, 9, 28), underCushionMat);
    couchBase.position.set(0, 7.5, 0);
    couchBase.castShadow = true;
    couchBase.receiveShadow = true;
    couchGroup.add(couchBase);

    // Backrest
    const couchBack = new THREE.Mesh(new THREE.BoxGeometry(78, 19, 8), upholsteryMat);
    couchBack.position.set(0, 20, -10);
    couchBack.castShadow = true;
    couchGroup.add(couchBack);

    // Armrests
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(8, 17, 28), upholsteryMat);
      arm.position.set(side * 39, 13, 0);
      arm.castShadow = true;
      couchGroup.add(arm);
    }

    // Seat cushions
    for (const side of [-1, 1]) {
      const seatCushion = new THREE.Mesh(new THREE.BoxGeometry(32, 6, 21), upholsteryMat);
      seatCushion.position.set(side * 17, 14.5, 2.5);
      seatCushion.castShadow = true;
      couchGroup.add(seatCushion);
    }

    // Legs
    for (const x of [-34, 34]) {
      for (const z of [-10, 10]) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.0, 4, 10), darkWoodMat);
        leg.position.set(x, 2, z);
        leg.castShadow = true;
        couchGroup.add(leg);
      }
    }

    // Throw pillows
    const orangePillow = new THREE.Mesh(
      new THREE.BoxGeometry(10, 9, 4),
      new THREE.MeshStandardMaterial({ color: 0xef7a18, roughness: 0.7 })
    );
    orangePillow.position.set(-24, 19, -4);
    orangePillow.rotation.z = 0.16;
    orangePillow.castShadow = true;
    couchGroup.add(orangePillow);

    const creamPillow = new THREE.Mesh(
      new THREE.BoxGeometry(10, 9, 4),
      new THREE.MeshStandardMaterial({ color: 0xf6f0e4, roughness: 0.7 })
    );
    creamPillow.position.set(25, 19, -4);
    creamPillow.rotation.z = -0.14;
    creamPillow.castShadow = true;
    couchGroup.add(creamPillow);

    // Pumpkin on floor beside couch
    const pumpkinGroup = new THREE.Group();
    pumpkinGroup.position.set(-68, floorY, 52);
    dioramaGroup.add(pumpkinGroup);

    const pumpkinMesh = new THREE.Mesh(
      new THREE.SphereGeometry(5.2, 14, 12),
      new THREE.MeshStandardMaterial({ color: 0xec6e10, roughness: 0.6 })
    );
    pumpkinMesh.scale.set(1.2, 0.85, 1.2);
    pumpkinMesh.position.y = 4.4;
    pumpkinMesh.castShadow = true;
    pumpkinGroup.add(pumpkinMesh);

    const stemMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(0.7, 1.0, 2.8, 8),
      new THREE.MeshStandardMaterial({ color: 0x487937, roughness: 0.7 })
    );
    stemMesh.position.set(0.3, 8.5, 0);
    stemMesh.rotation.z = 0.2;
    stemMesh.castShadow = true;
    pumpkinGroup.add(stemMesh);

    // --- 6. POTTED PLANT / FICUS ---
    const plantGroup = new THREE.Group();
    plantGroup.position.set(-36, floorY, -24);
    dioramaGroup.add(plantGroup);

    const potMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(5.2, 4.2, 10.5, 18),
      new THREE.MeshStandardMaterial({ color: 0xe8dfd2, roughness: 0.8 })
    );
    potMesh.position.y = 5.25;
    potMesh.castShadow = true;
    plantGroup.add(potMesh);

    const soilMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(5, 5, 0.8, 16),
      new THREE.MeshStandardMaterial({ color: 0x3d3024, roughness: 0.9 })
    );
    soilMesh.position.y = 10;
    plantGroup.add(soilMesh);

    const leafMatDark = new THREE.MeshStandardMaterial({ color: 0x447246, roughness: 0.7, flatShading: true });
    const leafMatLight = new THREE.MeshStandardMaterial({ color: 0x588c5a, roughness: 0.7, flatShading: true });

    const plantTiers = [
      { y: 14, r: 6.2, mat: leafMatDark },
      { y: 20, r: 5.4, mat: leafMatLight },
      { y: 25, r: 4.4, mat: leafMatDark },
      { y: 30, r: 3.3, mat: leafMatLight },
    ];
    for (const t of plantTiers) {
      const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(t.r, 0), t.mat);
      foliage.position.y = t.y;
      foliage.rotation.y = t.y * 0.5;
      foliage.castShadow = true;
      plantGroup.add(foliage);
    }

    // --- 7. WALNUT DESK & ACCESSORIES (FACING FORWARD) ---
    const deskGroup = new THREE.Group();
    deskGroup.position.set(10, floorY, -26);
    // Desk positioned with seated agent behind it
    dioramaGroup.add(deskGroup);

    const walnutMat = new THREE.MeshStandardMaterial({
      color: 0x38271b,
      roughness: 0.65,
    });

    // Desktop
    const deskTop = new THREE.Mesh(new THREE.BoxGeometry(70, 3, 30), walnutMat);
    deskTop.position.set(0, 38, 0);
    deskTop.castShadow = true;
    deskTop.receiveShadow = true;
    deskGroup.add(deskTop);

    // Legs
    for (const x of [-31, 31]) {
      for (const z of [-11.5, 11.5]) {
        const leg = new THREE.Mesh(new THREE.BoxGeometry(2.5, 36.5, 2.5), walnutMat);
        leg.position.set(x, 18.25, z);
        leg.castShadow = true;
        deskGroup.add(leg);
      }
    }

    // Nameplate ("MeetMind")
    const nameplateMesh = new THREE.Mesh(
      new THREE.BoxGeometry(14, 4.2, 1),
      new THREE.MeshStandardMaterial({ map: createNameplateTexture("MeetMind"), roughness: 0.5 })
    );
    nameplateMesh.position.set(-18, 40.5, 10);
    nameplateMesh.rotation.x = -0.25;
    nameplateMesh.castShadow = true;
    deskGroup.add(nameplateMesh);

    // Orange Mug
    const mugMesh = new THREE.Mesh(
      new THREE.CylinderGeometry(2, 2, 3.6, 12),
      new THREE.MeshStandardMaterial({ color: 0xee7416, roughness: 0.5 })
    );
    mugMesh.position.set(20, 41.3, -4);
    mugMesh.castShadow = true;
    deskGroup.add(mugMesh);

    // Laptop
    const laptopGroup = new THREE.Group();
    laptopGroup.position.set(0, 39.5, -3);
    deskGroup.add(laptopGroup);

    const aluminumMat = new THREE.MeshStandardMaterial({ color: 0xd6dade, roughness: 0.35, metalness: 0.6 });
    const laptopBase = new THREE.Mesh(new THREE.BoxGeometry(19, 1, 13), aluminumMat);
    laptopBase.position.y = 0.5;
    laptopBase.castShadow = true;
    laptopGroup.add(laptopBase);

    const keyboardMesh = new THREE.Mesh(
      new THREE.BoxGeometry(15.5, 0.2, 6.5),
      new THREE.MeshStandardMaterial({ color: 0x24262b, roughness: 0.8 })
    );
    keyboardMesh.position.set(0, 1.1, 1.2);
    laptopGroup.add(keyboardMesh);

    // Screen Lid (Angled back)
    const screenHinge = new THREE.Group();
    screenHinge.position.set(0, 1.0, -6.2);
    screenHinge.rotation.x = 0.34;
    laptopGroup.add(screenHinge);

    const screenLid = new THREE.Mesh(new THREE.BoxGeometry(19, 13, 0.9), aluminumMat);
    screenLid.position.y = 6.5;
    screenLid.castShadow = true;
    screenHinge.add(screenLid);

    // Screen Display
    const screenDisplay = new THREE.Mesh(
      new THREE.PlaneGeometry(17, 11),
      new THREE.MeshStandardMaterial({
        color: 0x161c24,
        emissive: 0x2d3a4d,
        emissiveIntensity: 0.45,
        roughness: 0.2,
      })
    );
    screenDisplay.position.set(0, 6.5, 0.5);
    screenHinge.add(screenDisplay);

    // Laptop Logo (facing front towards viewer)
    const logoMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(5.2, 5.2),
      new THREE.MeshBasicMaterial({ map: createLaptopLogoTexture(), transparent: true })
    );
    logoMesh.rotation.y = Math.PI;
    logoMesh.position.set(0, 6.5, -0.5);
    screenHinge.add(logoMesh);

    // Chair
    const chairGroup = new THREE.Group();
    chairGroup.position.set(10, floorY, -6);
    dioramaGroup.add(chairGroup);

    const chairFabric = new THREE.MeshStandardMaterial({ color: 0xebe2d5, roughness: 0.8 });
    const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(20, 3, 19), chairFabric);
    chairSeat.position.y = 22;
    chairSeat.castShadow = true;
    chairGroup.add(chairSeat);

    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(20, 19, 2.8), chairFabric);
    chairBack.position.set(0, 33, 9);
    chairBack.rotation.x = 0.08;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    for (const x of [-8, 8]) {
      for (const z of [-7, 7]) {
        const cLeg = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.8, 20.5, 10), darkWoodMat);
        cLeg.position.set(x, 10.25, z);
        cLeg.castShadow = true;
        chairGroup.add(cLeg);
      }
    }

    // --- 8. AGENT CHARACTER SEATED AT DESK (FACING FORWARD) ---
    const agentGroup = new THREE.Group();
    agentGroup.position.set(10, floorY, -8);
    dioramaGroup.add(agentGroup);

    const skinMat = new THREE.MeshStandardMaterial({ color: 0xfaaf9a, roughness: 0.6 });
    const hoodieMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e8, roughness: 0.8 });
    const hairMat = new THREE.MeshStandardMaterial({ color: 0x4d3626, roughness: 0.8 });
    const pantsMat = new THREE.MeshStandardMaterial({ color: 0x3d424c, roughness: 0.8 });

    // Torso
    const torso = new THREE.Mesh(new THREE.BoxGeometry(14, 16, 10), hoodieMat);
    torso.position.y = 31;
    torso.castShadow = true;
    agentGroup.add(torso);

    // Head
    const head = new THREE.Mesh(new THREE.SphereGeometry(6, 16, 14), skinMat);
    head.position.set(0, 43, 0);
    head.castShadow = true;
    agentGroup.add(head);

    // Hair
    const hair = new THREE.Mesh(new THREE.DodecahedronGeometry(6.8, 1), hairMat);
    hair.position.set(0, 44.5, -0.6);
    hair.castShadow = true;
    agentGroup.add(hair);

    // Arms typing on laptop
    for (const side of [-1, 1]) {
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(2, 1.8, 12, 10), hoodieMat);
      arm.position.set(side * 8, 33, -5);
      arm.rotation.x = -1.0;
      arm.rotation.z = side * 0.25;
      arm.castShadow = true;
      agentGroup.add(arm);

      const hand = new THREE.Mesh(new THREE.SphereGeometry(1.8, 8, 8), skinMat);
      hand.position.set(side * 5, 39, -14);
      agentGroup.add(hand);
    }

    // Legs
    for (const side of [-1, 1]) {
      const thigh = new THREE.Mesh(new THREE.BoxGeometry(4.6, 4.5, 12), pantsMat);
      thigh.position.set(side * 4.8, 23.5, -5);
      thigh.castShadow = true;
      agentGroup.add(thigh);

      const shin = new THREE.Mesh(new THREE.CylinderGeometry(1.9, 1.7, 14, 10), pantsMat);
      shin.position.set(side * 4.8, 14.5, -11);
      shin.castShadow = true;
      agentGroup.add(shin);
    }

    // --- 9. INTEGRATIONS VENDING MACHINE (RIGHT WALL FACING INWARD) ---
    const vendingGroup = new THREE.Group();
    vendingGroup.position.set(65, floorY, -35);
    // Turned towards the room and camera
    vendingGroup.rotation.y = -Math.PI / 2;
    dioramaGroup.add(vendingGroup);

    const vendingCabinetMat = new THREE.MeshStandardMaterial({
      color: 0xf5eee4,
      roughness: 0.75,
    });
    const darkTrimMat = new THREE.MeshStandardMaterial({
      color: 0x32302d,
      roughness: 0.7,
    });

    // Cabinet body
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(46, 114, 28), vendingCabinetMat);
    cabinet.position.set(0, 57, 0);
    cabinet.castShadow = true;
    cabinet.receiveShadow = true;
    vendingGroup.add(cabinet);

    // Top "INTEGRATIONS" marquee banner
    const marquee = new THREE.Mesh(
      new THREE.PlaneGeometry(42, 10),
      new THREE.MeshStandardMaterial({ map: createVendingSignTexture(), roughness: 0.4 })
    );
    marquee.position.set(0, 106, 14.1);
    vendingGroup.add(marquee);

    // Recessed showcase chamber
    const chamber = new THREE.Mesh(
      new THREE.BoxGeometry(34, 60, 10),
      new THREE.MeshStandardMaterial({ color: 0xefeae0, roughness: 0.9 })
    );
    chamber.position.set(-3.5, 66, 9.5);
    vendingGroup.add(chamber);

    // Glass panel
    const glassPanel = new THREE.Mesh(
      new THREE.PlaneGeometry(34, 60),
      new THREE.MeshPhysicalMaterial({
        color: 0xe6f2fa,
        transparent: true,
        opacity: 0.28,
        roughness: 0.08,
        metalness: 0.1,
        transmission: 0.75,
        depthWrite: false,
      })
    );
    glassPanel.position.set(-3.5, 66, 14.2);
    vendingGroup.add(glassPanel);

    // Shelves of integration boxes
    const shelfLevels = [46, 66, 86];
    const appColors = [
      0x24292e, 0x4a154b, 0x5865f2, 0x0f9d58,
      0xea4335, 0x000000, 0x5e6ad2, 0x635bff,
      0x0061ff, 0x1da1f2, 0x202124, 0xf24e1e,
    ];

    let colorCount = 0;
    for (const sy of shelfLevels) {
      const shelfRail = new THREE.Mesh(
        new THREE.BoxGeometry(32, 1.2, 8),
        new THREE.MeshStandardMaterial({ color: 0x363330, roughness: 0.6 })
      );
      shelfRail.position.set(-3.5, sy, 10);
      vendingGroup.add(shelfRail);

      for (let c = 0; c < 4; c++) {
        const boxColor = appColors[colorCount % appColors.length];
        colorCount++;
        const pBox = new THREE.Mesh(
          new THREE.BoxGeometry(5.8, 9.6, 4.2),
          new THREE.MeshStandardMaterial({ color: boxColor, roughness: 0.6 })
        );
        pBox.position.set(-14.5 + c * 7.5, sy + 5.5, 10.5);
        pBox.castShadow = true;
        vendingGroup.add(pBox);
      }
    }

    // Keypad panel (Right side)
    const keypadBase = new THREE.Mesh(
      new THREE.BoxGeometry(8, 36, 1),
      vendingCabinetMat
    );
    keypadBase.position.set(17.5, 74, 14.1);
    vendingGroup.add(keypadBase);

    // Keypad buttons
    const btnMat = new THREE.MeshStandardMaterial({ color: 0x282624, roughness: 0.5 });
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 3; c++) {
        const btn = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 0.5), btnMat);
        btn.position.set(15.5 + c * 2, 81 - r * 3.2, 14.6);
        vendingGroup.add(btn);
      }
    }

    // Dispenser slot
    const dispenserSlot = new THREE.Mesh(
      new THREE.BoxGeometry(34, 11, 1.5),
      darkTrimMat
    );
    dispenserSlot.position.set(-3.5, 18, 14.2);
    dispenserSlot.rotation.x = -0.12;
    vendingGroup.add(dispenserSlot);

    // --- 10. ANIMATION & PARALLAX ---
    let animId: number;
    const clock = new THREE.Clock();

    let mouseTargetX = 0;
    let mouseTargetY = 0;
    let mouseCurrentX = 0;
    let mouseCurrentY = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseTargetX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseTargetY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    window.addEventListener("mousemove", onPointerMove);

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Mouse parallax
      mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.05;
      mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.05;

      // Subtle breathing motion
      dioramaGroup.position.y = Math.sin(elapsed * 1.6) * 0.7;
      head.position.y = 43 + Math.sin(elapsed * 3) * 0.25;

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", onPointerMove);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animId);
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full h-screen min-h-[600px] flex flex-col items-center justify-between overflow-hidden select-none bg-transparent">
      {/* 3D Scene Viewport */}
      <div
        ref={containerRef}
        className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing z-10"
      />

      {/* Hero Title ("MeetMind") */}
      <header className="relative z-20 pt-8 sm:pt-12 text-center pointer-events-none select-none flex flex-col items-center">
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-[-0.04em] text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.6)] leading-none select-none">
          MeetMind
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-[#e2eeb2] font-semibold tracking-normal mt-2 sm:mt-2.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.5)] select-none">
          Stop discussing. Start doing.
        </p>
      </header>

      {/* Center Spacer */}
      <div className="flex-1 w-full pointer-events-none" />

      {/* Action Buttons: Register & Enter Workspace */}
      <footer className="relative z-20 pb-10 sm:pb-14 flex flex-col items-center">
        <div className="backdrop-blur-xl bg-[#072417]/80 border border-[#2d5f44] shadow-[0_12px_40px_rgba(0,0,0,0.5)] rounded-full p-1.5 flex items-center gap-2 select-none">
          {/* Register Button */}
          <button
            type="button"
            onClick={() => {
              if (onOpenRegister) {
                onOpenRegister();
              } else if (onEnterPinboard) {
                onEnterPinboard();
              }
            }}
            className="flex items-center gap-1 px-6 py-3 rounded-full text-sm sm:text-base font-bold text-white bg-white/10 hover:bg-white/20 active:scale-95 transition-all shadow-xs border border-white/20 cursor-pointer select-none"
          >
            <span>Register</span>
          </button>

          {/* Enter Workspace Button */}
          <button
            type="button"
            onClick={() => {
              if (onEnterPinboard) {
                onEnterPinboard();
              }
            }}
            className="flex items-center gap-2 px-7 py-3 rounded-full text-sm sm:text-base font-bold text-stone-950 bg-[#ffea55] hover:bg-[#ffe338] active:scale-95 transition-all shadow-md cursor-pointer select-none ring-1 ring-amber-400"
          >
            <span>Enter Workspace</span>
            <span className="text-base font-bold">→</span>
          </button>
        </div>
      </footer>
    </div>
  );
}
