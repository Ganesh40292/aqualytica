import { useRef, useEffect, useState, useCallback } from "react";
import * as THREE from "three";
import { motion } from "framer-motion";

const DURATION = 6.5;
const STAGE_BOUNDARIES = [0, 1.1, 2.6, 4.1, DURATION];
const STAGE_NAMES = [
  "Sensor Genesis",
  "Molecular Assembly",
  "Water Convergence",
  "Intelligence Reveal",
];
const TAGLINE = "REAL-TIME WATER QUALITY INTELLIGENCE";

const clamp = (value, minimum = 0, maximum = 1) =>
  Math.min(maximum, Math.max(minimum, value));

const smoothstep = (start, end, time) => {
  const progress = clamp((time - start) / (end - start));
  return progress * progress * (3 - 2 * progress);
};

const easeInOutCubic = (value) =>
  value < 0.5
    ? 4 * value * value * value
    : 1 - Math.pow(-2 * value + 2, 3) / 2;

const easeOutBack = (value) => {
  value = clamp(value);
  const constant = 1.70158;
  return (
    1 +
    (constant + 1) * Math.pow(value - 1, 3) +
    constant * Math.pow(value - 1, 2)
  );
};

const createRandom = (seed) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let value = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value;
  return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
};

const vertexShader = `
  uniform float uTime;
  uniform float uWobble;

  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;

  void main() {
    vec3 transformed = vec3(position);

    float wave =
      sin(transformed.y * 5.0 + uTime * 2.6 + transformed.x * 3.0) * 0.018 +
      sin(transformed.y * 9.0 - uTime * 3.4 + transformed.z * 4.0) * 0.01;

    transformed += normal * wave * uWobble;

    vLocal = transformed;
    vNormal = normalize(mat3(modelMatrix) * normal);
    vWorld = (modelMatrix * vec4(transformed, 1.0)).xyz;

    gl_Position =
      projectionMatrix *
      viewMatrix *
      vec4(vWorld, 1.0);
  }
`;

const fragmentShader = `
  uniform float uTime;
  uniform float uAlpha;
  uniform float uEnergy;
  uniform float uMaxAlpha;

  varying vec3 vNormal;
  varying vec3 vWorld;
  varying vec3 vLocal;

  float hash(vec3 value) {
    return fract(
      sin(dot(value, vec3(12.9898, 78.233, 37.719))) * 43758.5453
    );
  }

  float noise(vec3 value) {
    vec3 integer = floor(value);
    vec3 fraction = fract(value);
    fraction = fraction * fraction * (3.0 - 2.0 * fraction);

    return mix(
      mix(
        mix(hash(integer), hash(integer + vec3(1.0, 0.0, 0.0)), fraction.x),
        mix(hash(integer + vec3(0.0, 1.0, 0.0)), hash(integer + vec3(1.0, 1.0, 0.0)), fraction.x),
        fraction.y
      ),
      mix(
        mix(hash(integer + vec3(0.0, 0.0, 1.0)), hash(integer + vec3(1.0, 0.0, 1.0)), fraction.x),
        mix(hash(integer + vec3(0.0, 1.0, 1.0)), hash(integer + vec3(1.0, 1.0, 1.0)), fraction.x),
        fraction.y
      ),
      fraction.z
    );
  }

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 view = normalize(cameraPosition - vWorld);

    if (!gl_FrontFacing) {
      normal = -normal;
    }

    float facing = clamp(dot(normal, view), 0.0, 1.0);
    float fresnel = pow(1.0 - facing, 2.2);

    vec3 noisePosition =
      vLocal * 2.2 +
      vec3(0.0, -uTime * 0.5, uTime * 0.3);

    float surfaceNoise =
      noise(noisePosition + noise(noisePosition * 1.7 + uTime * 0.4) * 1.5);

    float caustic =
      smoothstep(0.55, 0.9, surfaceNoise) *
      (0.35 + 0.65 * facing);

    vec3 color = mix(
      vec3(0.01, 0.16, 0.24),
      vec3(0.08, 0.72, 0.72),
      smoothstep(-1.0, 1.0, vLocal.y * 0.6 + surfaceNoise * 0.6)
    );

    color = mix(color, vec3(0.25, 0.88, 1.0), fresnel * 0.9);
    color += caustic * vec3(0.3, 0.9, 0.95) * 0.5;

    vec3 lightOne = normalize(vec3(-0.5, 0.8, 0.7));
    vec3 lightTwo = normalize(vec3(0.7, -0.3, 0.5));

    float specularOne =
      pow(max(dot(reflect(-lightOne, normal), view), 0.0), 70.0);
    float specularTwo =
      pow(max(dot(reflect(-lightTwo, normal), view), 0.0), 40.0) * 0.5;

    color += vec3(1.0) * specularOne;
    color += vec3(0.5, 1.0, 1.0) * specularTwo;

    float streak =
      (1.0 - smoothstep(0.0, 0.06, abs(normal.x * 0.9 + normal.y * 0.25 + 0.45))) *
      smoothstep(-0.2, 0.6, normal.y) *
      0.3;

    color += streak;

    float waveY = -0.15 + sin(vLocal.x * 7.0 + uTime * 2.4) * 0.05;
    float energyLine = 1.0 - smoothstep(0.0, 0.05, abs(vLocal.y - waveY));

    color += uEnergy * energyLine * vec3(0.6, 1.0, 1.0) * 1.2;
    color = mix(
      color,
      color * 1.25 + vec3(0.0, 0.12, 0.14),
      uEnergy * fresnel
    );

    float alpha =
      mix(0.16, 0.92, fresnel) +
      specularOne +
      caustic * 0.25 +
      uEnergy * energyLine * 0.6 +
      0.12;

    gl_FragColor = vec4(color, clamp(alpha, 0.0, 1.0) * uAlpha * uMaxAlpha);
  }
`;

function WaterDropIcon() {
  return (
    <svg className="tag-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5C15.5 8 18 11.2 18 14.2A6 6 0 0 1 6 14.2C6 11.2 8.5 8 12 3.5Z"
        stroke="#5fe3f2"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.6 14.4a2.4 2.4 0 0 0 2.4 2.4"
        stroke="rgba(191, 238, 247, 0.75)"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DataPulseIcon() {
  return (
    <svg className="tag-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle className="pulse-dot" cx="5" cy="12" r="1.1" fill="#5fe3f2" />
      <circle className="pulse-dot" cx="12" cy="12" r="1.4" fill="#8ff1ff" />
      <circle className="pulse-dot" cx="19" cy="12" r="1.1" fill="#5fe3f2" />
    </svg>
  );
}

const InitialLoader = ({ onComplete }) => {
  const mountReference = useRef(null);
  const animationApi = useRef({});
  const audioContextReference = useRef(null);
  const ambientGainReference = useRef(null);
  const masterGainReference = useRef(null);
  const noiseBufferReference = useRef(null);
  const soundEnabledReference = useRef(false);
  const debugReference = useRef(null);

  const [, setFinished] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const enterDashboard = useCallback(() => {
    window.dispatchEvent(new CustomEvent("aqualytica:enter"));
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const element = mountReference.current;
    if (!element) return undefined;

    const query = (selector) => element.querySelector(selector);
    const queryAll = (selector) => Array.from(element.querySelectorAll(selector));

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      const fallbackEl = query(".fallback");
      if (fallbackEl) fallbackEl.classList.add("visible");
      return undefined;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    const canvasHost = query("#cv");
    if (canvasHost) canvasHost.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030a16, 0.032);

    const backgroundCanvas = document.createElement("canvas");
    backgroundCanvas.width = 512;
    backgroundCanvas.height = 512;
    const backgroundContext = backgroundCanvas.getContext("2d");
    const backgroundGradient = backgroundContext.createRadialGradient(256, 215, 10, 256, 256, 360);
    backgroundGradient.addColorStop(0, "#0b2c48");
    backgroundGradient.addColorStop(0.5, "#041429");
    backgroundGradient.addColorStop(1, "#010409");
    backgroundContext.fillStyle = backgroundGradient;
    backgroundContext.fillRect(0, 0, 512, 512);
    const backgroundTexture = new THREE.CanvasTexture(backgroundCanvas);
    scene.background = backgroundTexture;

    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);

    scene.add(new THREE.AmbientLight(0x2a4a5a, 0.8));
    const keyLight = new THREE.PointLight(0x4fdcf0, 1.35, 40);
    keyLight.position.set(3, 3, 5);
    scene.add(keyLight);
    const fillLight = new THREE.PointLight(0x14b8a6, 0.95, 40);
    fillLight.position.set(-4, -2, 3);
    scene.add(fillLight);

    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const glowContext = glowCanvas.getContext("2d");
    const glowGradient = glowContext.createRadialGradient(64, 64, 0, 64, 64, 64);
    glowGradient.addColorStop(0, "rgba(255, 255, 255, 1)");
    glowGradient.addColorStop(0.25, "rgba(255, 255, 255, 0.35)");
    glowGradient.addColorStop(1, "rgba(255, 255, 255, 0)");
    glowContext.fillStyle = glowGradient;
    glowContext.fillRect(0, 0, 128, 128);
    const glowTexture = new THREE.CanvasTexture(glowCanvas);
    const glowSprites = [];

    const createGlow = (color, opacity = 1) => {
      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: glowTexture,
          color,
          transparent: true,
          opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        })
      );
      scene.add(sprite);
      glowSprites.push(sprite);
      return sprite;
    };

    const random = createRandom(23);
    const vector = (x, y, z) => new THREE.Vector3(x, y, z);

    const sphereGeometry = new THREE.SphereGeometry(1, 40, 28);
    const cylinderGeometry = new THREE.CylinderGeometry(1, 1, 1, 10, 1, true);

    const oxygenMaterial = new THREE.MeshStandardMaterial({
      color: 0x35d8ee,
      emissive: 0x0a7f95,
      emissiveIntensity: 0.85,
      roughness: 0.25,
      metalness: 0.1,
    });
    const hydrogenMaterial = new THREE.MeshStandardMaterial({
      color: 0xf2fbfd,
      emissive: 0x5f8793,
      emissiveIntensity: 0.5,
      roughness: 0.3,
    });

    const moleculeCount = 9;
    const bondLength = 0.95;
    const bondAngle = 52.25 * (Math.PI / 180);
    const molecules = [];

    for (let index = 0; index < moleculeCount; index += 1) {
      const vertical = ((index / (moleculeCount - 1)) * 2 - 1) * 0.8;
      const ringRadius = Math.sqrt(Math.max(0, 1 - vertical * vertical));
      const angle = index * 2.39996;
      const distance = 2.9 + random() * 0.5;

      const molecule = {
        center: vector(
          Math.cos(angle) * ringRadius * distance,
          vertical * distance,
          Math.sin(angle) * ringRadius * distance * 0.6 - 0.5
        ),
        initialRotation: new THREE.Quaternion().setFromEuler(
          new THREE.Euler(random() * 6, random() * 6, random() * 6)
        ),
        atoms: [],
        bonds: [],
      };

      const atomDefinitions = [
        ["O", vector(0, 0, 0)],
        ["H", vector(Math.sin(bondAngle) * bondLength, -Math.cos(bondAngle) * bondLength, 0)],
        ["H", vector(-Math.sin(bondAngle) * bondLength, -Math.cos(bondAngle) * bondLength, 0)],
      ];

      atomDefinitions.forEach(([type, localPosition]) => {
        const isOxygen = type === "O";
        const mesh = new THREE.Mesh(sphereGeometry, isOxygen ? oxygenMaterial : hydrogenMaterial);
        scene.add(mesh);
        const flightAngle = random() * 6.28;
        const flightRadius = 9 + random() * 4;

        molecule.atoms.push({
          isOxygen,
          mesh,
          glow: createGlow(isOxygen ? 0x35d8ee : 0xcfeff5),
          local: localPosition,
          radius: isOxygen ? 0.36 : 0.22,
          delay: random() * 0.6,
          start: vector(
            Math.cos(flightAngle) * flightRadius,
            Math.sin(flightAngle) * flightRadius * 0.7,
            -10 + random() * 12
          ),
          loose: vector(random() - 0.5, random() - 0.5, random() - 0.5)
            .normalize()
            .multiplyScalar(0.9 + random() * 0.7),
          position: vector(0, 0, 0),
          target: vector(0, 0, 0),
        });
      });

      for (let bondIndex = 0; bondIndex < 2; bondIndex += 1) {
        const bondMesh = new THREE.Mesh(
          cylinderGeometry,
          new THREE.MeshBasicMaterial({
            color: 0x8ff1ff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
          })
        );
        scene.add(bondMesh);
        molecule.bonds.push({ mesh: bondMesh, pulse: createGlow(0xbff6ff, 0) });
      }

      molecules.push(molecule);
    }

    const dustCount = 320;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let index = 0; index < dustCount; index += 1) {
      dustPositions[index * 3] = (random() - 0.5) * 22;
      dustPositions[index * 3 + 1] = (random() - 0.5) * 13;
      dustPositions[index * 3 + 2] = random() * 16 - 9;
    }
    const dustGeometry = new THREE.BufferGeometry();
    dustGeometry.setAttribute("position", new THREE.BufferAttribute(dustPositions, 3));
    const dust = new THREE.Points(
      dustGeometry,
      new THREE.PointsMaterial({
        size: 0.07,
        map: glowTexture,
        color: 0x7fdcea,
        transparent: true,
        opacity: 0.55,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    scene.add(dust);

    const vaporCount = reducedMotion ? 120 : 260;
    const vaporPositions = new Float32Array(vaporCount * 3);
    const vaporVelocities = new Float32Array(vaporCount * 3);
    const vaporLife = new Float32Array(vaporCount);
    for (let index = 0; index < vaporCount; index += 1) {
      vaporLife[index] = random();
      vaporVelocities[index * 3] = (random() - 0.5) * 0.7;
      vaporVelocities[index * 3 + 1] = 0.5 + random() * 1.2;
      vaporVelocities[index * 3 + 2] = (random() - 0.5) * 0.7;
    }
    const vaporGeometry = new THREE.BufferGeometry();
    vaporGeometry.setAttribute("position", new THREE.BufferAttribute(vaporPositions, 3));
    const vapor = new THREE.Points(
      vaporGeometry,
      new THREE.PointsMaterial({
        size: 0.09,
        map: glowTexture,
        color: 0x9ff4ff,
        transparent: true,
        opacity: 0,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    vapor.visible = false;
    scene.add(vapor);

    const dropletProfile = [];
    for (let index = 0; index <= 80; index += 1) {
      const angle = Math.PI - (index / 80) * Math.PI;
      dropletProfile.push(
        new THREE.Vector2(
          0.8 * Math.sin(angle) * Math.pow(Math.sin(angle / 2), 0.75),
          Math.cos(angle) - 0.1
        )
      );
    }
    const dropletGeometry = new THREE.LatheGeometry(dropletProfile, 96);

    const createDropletMaterial = (side, alpha) =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        side,
        uniforms: {
          uTime: { value: 0 },
          uAlpha: { value: 0 },
          uEnergy: { value: 0 },
          uWobble: { value: 1 },
          uMaxAlpha: { value: alpha },
        },
      });

    const dropletBackMaterial = createDropletMaterial(THREE.BackSide, 0.55);
    const dropletFrontMaterial = createDropletMaterial(THREE.FrontSide, 1);
    const dropletBack = new THREE.Mesh(dropletGeometry, dropletBackMaterial);
    const dropletFront = new THREE.Mesh(dropletGeometry, dropletFrontMaterial);
    dropletBack.renderOrder = 2;
    dropletFront.renderOrder = 3;
    const droplet = new THREE.Group();
    droplet.add(dropletBack, dropletFront);
    droplet.visible = false;
    scene.add(droplet);

    const halo = createGlow(0x22c7dc, 0);
    const core = createGlow(0x7ff0ff, 0);
    const flash = createGlow(0xbff6ff, 0);

    const rippleTimings = [4.35, 4.65, 4.95, 5.55, 5.85];
    const ripples = rippleTimings.map(() => {
      const ripple = new THREE.Mesh(
        new THREE.RingGeometry(0.985, 1, 128),
        new THREE.MeshBasicMaterial({
          color: 0x6fe8f4,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          side: THREE.DoubleSide,
        })
      );
      ripple.visible = false;
      scene.add(ripple);
      return ripple;
    });

    const splashCount = 32;
    const splashes = [];
    const splashGeometry = new THREE.SphereGeometry(1, 8, 6);
    const splashMaterial = new THREE.MeshBasicMaterial({
      color: 0xbff6ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    for (let i = 0; i < splashCount; i += 1) {
      const mesh = new THREE.Mesh(splashGeometry, splashMaterial.clone());
      scene.add(mesh);
      glowSprites.push(mesh);
      splashes.push({
        mesh,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        active: false,
      });
    }

    let visibleHeight = 6.63;
    let baseCameraZ = 8;
    let spread = 1;
    let fontSize = 0.9;
    let brandY = 1;

    const ringElement = query("#telemetry-ring");

    const pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const handlePointerMove = (event) => {
      pointer.targetX = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.targetY = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);

    const resize = () => {
      const width = element.clientWidth || window.innerWidth || 1;
      const height = element.clientHeight || window.innerHeight || 1;
      const aspect = width / height;

      renderer.setSize(width, height);
      camera.aspect = aspect;

      visibleHeight = aspect >= 1 ? 6.63 : 6.63 / aspect;
      baseCameraZ = visibleHeight / 2 / Math.tan(Math.PI / 8);
      spread = Math.min(1, aspect * 0.9);
      fontSize = Math.min(visibleHeight * 0.11, 0.95);
      brandY = (0.5 - 0.335) * visibleHeight;

      if (ringElement) {
        const ringSize = ((fontSize * 2 * 1.75) / visibleHeight) * height;
        ringElement.style.width = `${ringSize}px`;
        ringElement.style.height = `${ringSize}px`;
      }

      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize);
    resize();

    const letters = queryAll(".logo span");
    const tagline = query("#tagline");
    const features = queryAll(".feature");
    const status = query("#system-status");
    const fade = query("#fade");
    const technicalTag = query("#technical-tag");
    const arc = query("#arc");
    const orb = query("#orb");
    const cta = query("#cta");
    const logoBadge = query("#logo-badge");

    const temporaryVector = vector(0, 0, 0);
    const direction = vector(0, 0, 0);
    const moleculeQuaternion = new THREE.Quaternion();
    const spinQuaternion = new THREE.Quaternion();
    const yAxis = vector(0, 1, 0);
    const zAxis = vector(0, 0, 1);
    const moleculeCenter = vector(0, 0, 0);

    const state = {
      time: 0,
      finished: false,
      stage: -1,
      last: performance.now(),
      impactPlayed: false,
      sweepPlayed: false,
      revealPlayed: false,
      chimePlayed: false,
      nextBubbleTime: 0,
      splashTriggered: false,
      frameSamples: [],
      debugVisible: false,
    };

    const startAudio = () => {
      const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextConstructor) return;

      if (!audioContextReference.current) {
        const context = new AudioContextConstructor();
        audioContextReference.current = context;

        const master = context.createGain();
        master.gain.value = 1;
        master.connect(context.destination);
        masterGainReference.current = master;

        const bufferSize = context.sampleRate * 2;
        const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
        const data = buffer.getChannelData(0);
        for (let index = 0; index < bufferSize; index += 1) {
          data[index] = Math.random() * 2 - 1;
        }
        noiseBufferReference.current = buffer;

        const noiseSource = context.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;

        const noiseFilter = context.createBiquadFilter();
        noiseFilter.type = "lowpass";
        noiseFilter.frequency.value = 420;
        noiseFilter.Q.value = 0.7;

        const ambientGain = context.createGain();
        ambientGain.gain.value = 0.0001;
        ambientGain.connect(master);

        noiseSource.connect(noiseFilter);
        noiseFilter.connect(ambientGain);

        const lfo = context.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.13;
        const lfoGain = context.createGain();
        lfoGain.gain.value = 170;
        lfo.connect(lfoGain);
        lfoGain.connect(noiseFilter.frequency);

        noiseSource.start();
        lfo.start();
        ambientGainReference.current = ambientGain;

        const droneGain = context.createGain();
        droneGain.gain.value = 0.02;
        droneGain.connect(master);

        const oscillatorOne = context.createOscillator();
        const oscillatorTwo = context.createOscillator();
        oscillatorOne.type = "sine";
        oscillatorTwo.type = "sine";
        oscillatorOne.frequency.value = 58;
        oscillatorTwo.frequency.value = 87.5;
        oscillatorOne.connect(droneGain);
        oscillatorTwo.connect(droneGain);
        oscillatorOne.start();
        oscillatorTwo.start();
      }

      const context = audioContextReference.current;
      const now = context.currentTime;
      const ambientGain = ambientGainReference.current;
      context.resume();
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(0.05, now, 0.4);
    };

    const stopAudio = () => {
      const context = audioContextReference.current;
      const ambientGain = ambientGainReference.current;
      if (!context || !ambientGain) return;
      const now = context.currentTime;
      ambientGain.gain.cancelScheduledValues(now);
      ambientGain.gain.setTargetAtTime(0.0001, now, 0.2);
    };

    const playBubble = (pitch, volume) => {
      const context = audioContextReference.current;
      const master = masterGainReference.current;
      if (!context || !master) return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(pitch, now);
      oscillator.frequency.exponentialRampToValueAtTime(pitch * 2.2, now + 0.08);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(volume, now + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 0.16);
    };

    const playSweep = () => {
      const context = audioContextReference.current;
      const master = masterGainReference.current;
      const noiseBuffer = noiseBufferReference.current;
      if (!context || !master || !noiseBuffer) return;
      const now = context.currentTime;
      const duration = 1.5;
      const noise = context.createBufferSource();
      noise.buffer = noiseBuffer;
      noise.loop = true;
      const bandpass = context.createBiquadFilter();
      bandpass.type = "bandpass";
      bandpass.Q.value = 4;
      bandpass.frequency.setValueAtTime(180, now);
      bandpass.frequency.exponentialRampToValueAtTime(1400, now + duration);
      const noiseGain = context.createGain();
      noiseGain.gain.setValueAtTime(0.0001, now);
      noiseGain.gain.linearRampToValueAtTime(0.06, now + duration * 0.7);
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      noise.connect(bandpass);
      bandpass.connect(noiseGain);
      noiseGain.connect(master);
      noise.start(now);
      noise.stop(now + duration + 0.1);

      const glide = context.createOscillator();
      const glideGain = context.createGain();
      glide.type = "sine";
      glide.frequency.setValueAtTime(110, now);
      glide.frequency.exponentialRampToValueAtTime(440, now + duration);
      glideGain.gain.setValueAtTime(0.0001, now);
      glideGain.gain.linearRampToValueAtTime(0.03, now + duration * 0.8);
      glideGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      glide.connect(glideGain);
      glideGain.connect(master);
      glide.start(now);
      glide.stop(now + duration + 0.1);
    };

    const playImpact = () => {
      const context = audioContextReference.current;
      const master = masterGainReference.current;
      if (!context || !master) return;
      const now = context.currentTime;
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.setValueAtTime(320, now);
      oscillator.frequency.exponentialRampToValueAtTime(48, now + 0.55);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.16, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.7);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(now);
      oscillator.stop(now + 0.75);

      const plink = context.createOscillator();
      const plinkGain = context.createGain();
      plink.type = "sine";
      plink.frequency.setValueAtTime(880, now);
      plink.frequency.exponentialRampToValueAtTime(1760, now + 0.06);
      plinkGain.gain.setValueAtTime(0.0001, now);
      plinkGain.gain.exponentialRampToValueAtTime(0.09, now + 0.01);
      plinkGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);
      plink.connect(plinkGain);
      plinkGain.connect(master);
      plink.start(now);
      plink.stop(now + 0.4);
    };

    const playShimmer = () => {
      const context = audioContextReference.current;
      const master = masterGainReference.current;
      if (!context || !master) return;
      const now = context.currentTime;
      const notes = [1046.5, 1318.5, 1568, 2093];
      notes.forEach((frequency, index) => {
        const start = now + index * 0.12;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.045, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + 1);
      });
    };

    const playChime = () => {
      const context = audioContextReference.current;
      const master = masterGainReference.current;
      if (!context || !master) return;
      const now = context.currentTime;
      const notes = [880, 1320];
      notes.forEach((frequency, index) => {
        const start = now + index * 0.09;
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, start);
        gain.gain.exponentialRampToValueAtTime(0.07, start + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, start + 1.1);
        oscillator.connect(gain);
        gain.connect(master);
        oscillator.start(start);
        oscillator.stop(start + 1.2);
      });
    };

    const triggerSplash = () => {
      splashes.forEach((splash, i) => {
        const angle = (i / splashCount) * Math.PI * 2;
        const speed = 1.5 + random() * 2.5;
        splash.pos.set(0, brandY, 0);
        splash.vel.set(
          Math.cos(angle) * speed,
          1.5 + random() * 2.5,
          Math.sin(angle) * speed * 0.6
        );
        splash.life = 0;
        splash.active = true;
        splash.mesh.position.copy(splash.pos);
        splash.mesh.scale.setScalar(0.05 + random() * 0.06);
        splash.mesh.material.opacity = 0.9;
        splash.mesh.visible = true;
      });
    };

    const seekTo = (targetTime) => {
      const target = clamp(targetTime, 0, DURATION);
      const movingForward = target >= state.time;
      state.time = target;
      state.finished = target >= DURATION;

      if (!movingForward) {
        state.impactPlayed = target >= 3.5;
        state.sweepPlayed = target >= 2.7;
        state.revealPlayed = target >= 4.3;
        state.chimePlayed = target >= 6.05;
        state.nextBubbleTime = target;
        if (target < 3.5) {
          state.splashTriggered = false;
          splashes.forEach((splash) => {
            splash.active = false;
            splash.mesh.visible = false;
          });
        }
      } else {
        if (target < 2.7) state.sweepPlayed = false;
        if (target < 3.5) {
          state.impactPlayed = false;
          state.splashTriggered = false;
        }
        if (target < 4.3) state.revealPlayed = false;
        if (target < 6.05) state.chimePlayed = false;
        state.nextBubbleTime = target;
      }

      setFinished(target >= DURATION);
    };

    animationApi.current = {
      replay() {
        seekTo(0);
      },
      skip() {
        enterDashboard();
      },
      toggleSound() {
        const next = !soundEnabledReference.current;
        soundEnabledReference.current = next;
        setSoundEnabled(next);
        if (next) {
          if (state.time > 2.7) state.sweepPlayed = true;
          if (state.time > 3.5) state.impactPlayed = true;
          if (state.time > 4.3) state.revealPlayed = true;
          if (state.time > 6.05) state.chimePlayed = true;
          state.nextBubbleTime = state.time;
          startAudio();
        } else {
          stopAudio();
        }
      },
      toggleDebug() {
        state.debugVisible = !state.debugVisible;
        if (debugReference.current) {
          debugReference.current.classList.toggle("visible", state.debugVisible);
        }
      },
    };

    const updateMolecules = (time) => {
      const convergence = easeInOutCubic(clamp((time - 2.6) / 0.9));
      const bondOpacity = smoothstep(1.9, 2.4, time) * (1 - smoothstep(3.1, 3.5, time));

      molecules.forEach((molecule, moleculeIndex) => {
        spinQuaternion.setFromAxisAngle(yAxis, time * 0.5 + moleculeIndex);
        moleculeQuaternion.copy(molecule.initialRotation).multiply(spinQuaternion);

        moleculeCenter.set(
          molecule.center.x * spread,
          molecule.center.y + Math.sin(time * 1.3 + moleculeIndex * 1.7) * 0.08,
          molecule.center.z
        );

        const flashIntensity = Math.exp(-Math.pow((time - 2.2 - moleculeIndex * 0.05) * 5, 2));

        molecule.atoms.forEach((atom) => {
          atom.target.copy(atom.local).applyQuaternion(moleculeQuaternion).add(moleculeCenter);

          const approach = 1 - Math.pow(1 - clamp((time - atom.delay) / (1.1 - atom.delay)), 3);

          temporaryVector.copy(atom.loose).add(moleculeCenter);
          atom.position
            .copy(atom.start)
            .lerp(temporaryVector, approach)
            .lerp(atom.target, easeInOutCubic(clamp((time - 1.1) / 1.3)));

          atom.position.applyAxisAngle(zAxis, convergence * 2.4);
          atom.position.multiplyScalar(1 - convergence * 0.98);

          const appearance = smoothstep(atom.delay, atom.delay + 0.4, time);
          const scale = atom.radius * appearance * (1 - smoothstep(3.2, 3.7, time));

          atom.mesh.position.copy(atom.position);
          atom.mesh.scale.setScalar(Math.max(scale, 0.0001));
          atom.mesh.visible = scale > 0.003;

          atom.glow.position.copy(atom.position);
          atom.glow.scale.setScalar(
            atom.radius *
              6 *
              appearance *
              (1 - smoothstep(3.1, 3.6, time)) *
              (1 + (atom.isOxygen ? 0.7 : 0.3) * flashIntensity)
          );

          atom.glow.material.opacity =
            0.5 * appearance * (1 - smoothstep(3.1, 3.6, time)) + 0.3 * flashIntensity;
        });

        molecule.bonds.forEach((bond, bondIndex) => {
          const oxygen = molecule.atoms[0].position;
          const hydrogen = molecule.atoms[bondIndex + 1].position;
          direction.subVectors(hydrogen, oxygen);
          const length = direction.length() + 0.00001;
          direction.normalize();

          bond.mesh.position.copy(oxygen).addScaledVector(direction, length / 2);
          bond.mesh.quaternion.setFromUnitVectors(yAxis, direction);
          bond.mesh.scale.set(0.045, length, 0.045);
          bond.mesh.material.opacity = 0.55 * bondOpacity;
          bond.mesh.visible = bondOpacity > 0.01;

          const pulsePosition = (time * 1.3 + moleculeIndex * 0.3 + bondIndex * 0.5) % 1;
          bond.pulse.position.copy(oxygen).addScaledVector(direction, length * pulsePosition);
          bond.pulse.scale.setScalar(0.45);
          bond.pulse.material.opacity = bondOpacity * Math.sin(Math.PI * pulsePosition) * 0.9;
        });
      });
    };

    const updateVapor = (time, delta) => {
      const active = time > 4.05 && time < 6.2;
      vapor.visible = active;
      vapor.material.opacity =
        0.55 * smoothstep(4.05, 4.45, time) * (1 - smoothstep(5.4, 6.2, time));

      if (!active) return;

      const positions = vapor.geometry.attributes.position.array;
      for (let index = 0; index < vaporCount; index += 1) {
        vaporLife[index] += delta * 0.55;
        if (vaporLife[index] > 1) {
          vaporLife[index] = 0;
          positions[index * 3] = droplet.position.x + (random() - 0.5) * 0.4;
          positions[index * 3 + 1] = droplet.position.y - 0.25;
          positions[index * 3 + 2] = droplet.position.z + (random() - 0.5) * 0.4;
          vaporVelocities[index * 3] = (random() - 0.5) * 0.7;
          vaporVelocities[index * 3 + 1] = 0.5 + random() * 1.2;
          vaporVelocities[index * 3 + 2] = (random() - 0.5) * 0.7;
        }
        positions[index * 3] += vaporVelocities[index * 3] * delta;
        positions[index * 3 + 1] += vaporVelocities[index * 3 + 1] * delta;
        positions[index * 3 + 2] += vaporVelocities[index * 3 + 2] * delta;
      }
      vapor.geometry.attributes.position.needsUpdate = true;
    };

    const updateDroplet = (time) => {
      const emerge = easeInOutCubic(smoothstep(4.1, 4.8, time));
      const birth = easeOutBack((time - 3.3) / 0.75);
      const startScale = 1.3;
      const age = time - 3.5;
      const squash = 1 + 0.07 * Math.sin(age * 14) * Math.exp(-Math.max(age, 0) * 3);
      const scale = (startScale + (fontSize - startScale) * emerge) * birth * (time > 3.3 ? 1 : 0);

      droplet.visible = time > 3.3;
      droplet.position.set(0, brandY * emerge, 0);
      droplet.scale.set(scale * squash, scale / squash, scale * squash);

      [dropletBackMaterial, dropletFrontMaterial].forEach((material, index) => {
        material.uniforms.uTime.value = time;
        material.uniforms.uAlpha.value = smoothstep(3.3, 3.65, time) * (index ? 1 : 0.55);
        material.uniforms.uEnergy.value = smoothstep(4.1, 4.9, time);
        material.uniforms.uWobble.value = 1 + smoothstep(3.3, 3.75, time) * 0.6 * (1 - emerge);
      });

      core.position.copy(droplet.position);
      core.scale.setScalar(scale * 2.6);
      core.material.opacity = 0.4 * smoothstep(3.3, 3.8, time) * (1 - 0.4 * emerge);

      halo.position.copy(droplet.position);
      halo.scale.setScalar((startScale + (fontSize - startScale) * emerge) * 6);
      halo.material.opacity =
        (0.1 * smoothstep(3.4, 4.1, time) + 0.22 * emerge) * (1 + 0.15 * Math.sin(time * 3));

      flash.position.copy(droplet.position);
      flash.scale.setScalar(2 + 5 * Math.exp(-Math.pow((time - 3.5) * 4, 2)));
      flash.material.opacity = 0.9 * Math.exp(-Math.pow((time - 3.5) * 4, 2));

      ripples.forEach((ripple, index) => {
        const rippleAge = time - rippleTimings[index];
        const active = rippleAge > 0 && rippleAge < 1.7;
        ripple.visible = active;
        if (active) {
          ripple.position.set(0, droplet.position.y, -0.2);
          ripple.scale.setScalar((startScale + (fontSize - startScale) * emerge) * (1.05 + rippleAge * 2));
          ripple.material.opacity = 0.5 * Math.pow(1 - rippleAge / 1.7, 2);
        }
      });
    };

    const updateSplashes = (delta) => {
      splashes.forEach((splash) => {
        if (!splash.active) return;
        splash.life += delta;
        splash.vel.y -= 9.8 * delta * 0.6;
        splash.pos.addScaledVector(splash.vel, delta);
        splash.mesh.position.copy(splash.pos);
        splash.mesh.material.opacity = Math.max(0, 0.9 - splash.life * 1.6);
        if (splash.life > 0.7) {
          splash.active = false;
          splash.mesh.visible = false;
        }
      });
    };

    const updateInterface = (time) => {
      const technicalTagOpacity = smoothstep(1.9, 2.3, time) * (1 - smoothstep(3.1, 3.4, time));
      if (technicalTag) technicalTag.style.opacity = technicalTagOpacity;

      const ringOpacity = smoothstep(4.2, 4.8, time);
      if (ringElement) {
        ringElement.style.opacity = ringOpacity;
        ringElement.style.transform = `translate(-50%, -50%) scale(${
          0.92 + 0.08 * smoothstep(4.2, 5, time)
        })`;
      }
      if (logoBadge) {
        const logoProgress = smoothstep(3.8, 4.7, time);
        logoBadge.style.opacity = logoProgress;
        const logoScale = 0.75 + 0.25 * easeInOutCubic(logoProgress);
        logoBadge.style.transform = `translate(-50%, -50%) scale(${logoScale})`;
      }
      if (arc) arc.setAttribute("stroke-dashoffset", 528 * (1 - smoothstep(4.4, 5.7, time)));
      if (orb) orb.setAttribute("transform", `rotate(${time * 35})`);

      letters.forEach((letter, index) => {
        const progress = easeInOutCubic(clamp((time - 4.65 - index * 0.05) / 0.55));
        letter.style.opacity = progress;
        letter.style.transform = `translateY(${(1 - progress) * 16}px)`;
        letter.style.filter = `blur(${(1 - progress) * 8}px)`;
      });

      const taglineProgress = smoothstep(5.05, 5.55, time);
      if (tagline) {
        tagline.style.opacity = taglineProgress;
        tagline.style.transform = `translateY(${(1 - taglineProgress) * 8}px)`;
      }

      features.forEach((feature, index) => {
        const progress = smoothstep(5.25 + index * 0.15, 5.4 + index * 0.15, time);
        feature.style.opacity = 0.28 + 0.72 * progress;
        feature.style.color = progress > 0.5 ? "#bff6ff" : "";
        const indicator = feature.firstElementChild;
        if (indicator) {
          indicator.style.background = progress > 0.5 ? "#5fe3f2" : "";
          indicator.style.boxShadow = progress > 0.5 ? "0 0 8px #5fe3f2" : "none";
        }
      });

      if (status) status.style.opacity = smoothstep(5.6, 5.85, time);

      if (cta) {
        const ctaProgress = smoothstep(6.05, 6.45, time);
        cta.style.opacity = ctaProgress;
        cta.style.pointerEvents = ctaProgress > 0.5 ? "auto" : "none";
        cta.style.transform = `translateY(${(1 - ctaProgress) * 10}px)`;
      }

      if (fade) fade.style.opacity = 0;

      const nextStage =
        time < STAGE_BOUNDARIES[1]
          ? 0
          : time < STAGE_BOUNDARIES[2]
          ? 1
          : time < STAGE_BOUNDARIES[3]
          ? 2
          : 3;
      if (nextStage !== state.stage) state.stage = nextStage;

      if (time >= DURATION && !state.finished) {
        state.finished = true;
        setFinished(true);
      }
    };

    const frame = (time, delta) => {
      pointer.x += (pointer.targetX - pointer.x) * Math.min(1, delta * 4);
      pointer.y += (pointer.targetY - pointer.y) * Math.min(1, delta * 4);

      const parallaxStrength = reducedMotion ? 0 : 1;

      const cameraX =
        Math.sin(time * 0.35) * 0.85 * (1 - smoothstep(2.8, 4.1, time)) +
        pointer.x * 0.45 * parallaxStrength;
      const cameraY =
        Math.cos(time * 0.28) * 0.35 * (1 - smoothstep(2.8, 4.1, time)) -
        pointer.y * 0.28 * parallaxStrength;
      const cameraZ =
        baseCameraZ * (1.25 - 0.25 * smoothstep(0, 4.1, time)) -
        smoothstep(3.4, 3.65, time) * 0.35 +
        smoothstep(4.6, 5.4, time) * 0.55;

      camera.position.set(cameraX, cameraY, cameraZ);
      camera.lookAt(0, 0, 0);

      updateMolecules(time);
      updateDroplet(time);
      updateVapor(time, delta);
      updateSplashes(delta);

      dust.rotation.y = time * 0.03;
      dust.position.y = time * 0.04;
      dust.material.opacity = 0.55 * (1 - smoothstep(3.2, 4, time) * 0.4);

      updateInterface(time);

      if (soundEnabledReference.current && audioContextReference.current) {
        if (!state.sweepPlayed && time >= 2.7) {
          state.sweepPlayed = true;
          playSweep();
        }
        if (!state.impactPlayed && time >= 3.5) {
          state.impactPlayed = true;
          playImpact();
        }
        if (!state.splashTriggered && time >= 3.5) {
          state.splashTriggered = true;
          triggerSplash();
        }
        if (!state.revealPlayed && time >= 4.3) {
          state.revealPlayed = true;
          playShimmer();
        }
        if (!state.chimePlayed && time >= 6.05) {
          state.chimePlayed = true;
          playChime();
        }
        if (time > 1.1 && time < 3.4 && time >= state.nextBubbleTime) {
          playBubble(180 + Math.random() * 260, 0.02 + Math.random() * 0.03);
          state.nextBubbleTime = time + 0.12 + Math.random() * 0.3;
        }
      } else if (!state.splashTriggered && time >= 3.5) {
        state.splashTriggered = true;
        triggerSplash();
      }
    };

    let animationFrame;
    const loop = (now) => {
      const rawDelta = (now - state.last) / 1000;
      const delta = Math.min(0.05, rawDelta);
      state.last = now;

      state.frameSamples.push(rawDelta);
      if (state.frameSamples.length > 30) state.frameSamples.shift();

      if (!state.finished) {
        state.time = Math.min(DURATION, state.time + delta);
      }

      frame(state.time, delta);

      if (state.debugVisible && debugReference.current) {
        const avg =
          state.frameSamples.reduce((a, b) => a + b, 0) /
          Math.max(1, state.frameSamples.length);
        const fps = avg > 0 ? (1 / avg).toFixed(1) : "—";
        debugReference.current.textContent =
          `TIME  ${state.time.toFixed(3)}s / ${DURATION}s\n` +
          `STAGE ${state.stage + 1} · ${STAGE_NAMES[state.stage] || "—"}\n` +
          `FPS   ${fps}\n` +
          `TRI   ${renderer.info.render.triangles}\n` +
          `CALLS ${renderer.info.render.calls}\n` +
          `CUES  sw:${state.sweepPlayed ? 1 : 0} im:${state.impactPlayed ? 1 : 0} rv:${
            state.revealPlayed ? 1 : 0
          } ch:${state.chimePlayed ? 1 : 0}`;
      }

      renderer.render(scene, camera);
      animationFrame = requestAnimationFrame(loop);
    };
    animationFrame = requestAnimationFrame(loop);

    const handleKeyDown = (event) => {
      if (typeof event.key !== "string") return;
      const key = event.key.toLowerCase();
      if (key === "m") animationApi.current.toggleSound();
      if (key === "d") animationApi.current.toggleDebug();
      if (event.key === "Escape" || event.code === "Space") {
        enterDashboard();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // Auto-enter dashboard after 7.4 seconds
    const autoEnterTimer = setTimeout(() => {
      enterDashboard();
    }, 7400);

    return () => {
      clearTimeout(autoEnterTimer);
      cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("keydown", handleKeyDown);

      if (audioContextReference.current) {
        audioContextReference.current.close();
        audioContextReference.current = null;
        ambientGainReference.current = null;
        masterGainReference.current = null;
        noiseBufferReference.current = null;
      }

      renderer.dispose();
      backgroundTexture.dispose();
      glowTexture.dispose();
      sphereGeometry.dispose();
      cylinderGeometry.dispose();
      dustGeometry.dispose();
      vaporGeometry.dispose();
      dropletGeometry.dispose();
      splashGeometry.dispose();
      dust.material.dispose();
      vapor.material.dispose();
      splashMaterial.dispose();

      ripples.forEach((ripple) => {
        ripple.geometry.dispose();
        ripple.material.dispose();
      });

      glowSprites.forEach((sprite) => {
        if (sprite.material && sprite.material.dispose) sprite.material.dispose();
      });

      molecules.forEach((molecule) => {
        molecule.atoms.forEach((atom) => atom.mesh.material.dispose());
        molecule.bonds.forEach((bond) => bond.mesh.material.dispose());
      });

      oxygenMaterial.dispose();
      hydrogenMaterial.dispose();
      dropletBackMaterial.dispose();
      dropletFrontMaterial.dispose();
    };
  }, [enterDashboard]);

  const ticks = [];
  for (let index = 0; index < 72; index += 1) {
    const angle = index * 5 * (Math.PI / 180);
    const outerRadius = index % 6 === 0 ? 91 : 93;
    const tickLength = index % 6 === 0 ? 0 : 3;
    ticks.push(
      <line
        key={index}
        x1={Math.cos(angle) * 95.5}
        y1={Math.sin(angle) * 95.5}
        x2={Math.cos(angle) * outerRadius + Math.cos(angle) * tickLength}
        y2={Math.sin(angle) * outerRadius + Math.sin(angle) * tickLength}
        stroke="rgba(95, 227, 242, 0.35)"
        strokeWidth={index % 6 === 0 ? 0.6 : 0.3}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(12px)", transition: { duration: 0.7 } }}
      ref={mountReference}
      id="stage"
      className="fixed inset-0 z-[99999] bg-[#02060f] font-sans overflow-hidden select-none"
    >
      <style>{`
        :root {
          color-scheme: dark;
          --ink: #e6f6fa;
          --mute: #6f93a3;
          --cyan: #5fe3f2;
          --ice: #cfeef7;
          --deep: #02060f;
        }
        #cv {
          position: absolute;
          inset: 0;
        }
        #cv canvas {
          display: block;
          width: 100%;
          height: 100%;
        }
        .vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(
            ellipse at 50% 44%,
            transparent 36%,
            rgba(0, 0, 0, 0.74) 100%
          );
        }
        .scanlines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.04;
          background: repeating-linear-gradient(
            to bottom,
            rgba(120, 220, 255, 0.09) 0 1px,
            transparent 1px 4px
          );
        }
        .grain {
          position: absolute;
          inset: -50%;
          pointer-events: none;
          opacity: 0.045;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='240' height='240' filter='url(%23noise)' opacity='0.55'/%3E%3C/svg%3E");
          animation: grain 0.7s steps(3) infinite;
        }
        @keyframes grain {
          0% { transform: translate(0, 0); }
          33% { transform: translate(-2%, 1%); }
          66% { transform: translate(1%, -2%); }
          100% { transform: translate(0, 0); }
        }
        .fade {
          position: absolute;
          inset: 0;
          background: #000;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.65s ease;
        }
        .mono {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
        }
        .technical-tag {
          position: absolute;
          top: 11.5%;
          left: 0;
          right: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 14px;
          font-size: 10.5px;
          letter-spacing: 0.28em;
          color: #8fd9e6;
          opacity: 0;
          pointer-events: none;
        }
        .telemetry-ring {
          position: absolute;
          left: 50%;
          top: 33%;
          transform: translate(-50%, -50%);
          opacity: 0;
          pointer-events: none;
          box-shadow: none !important;
          border: none !important;
          outline: none !important;
        }
        .telemetry-ring svg {
          display: block;
          width: 100%;
          height: 100%;
          border: none !important;
          outline: none !important;
          box-shadow: none !important;
        }
        .logo-badge {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%) scale(0.8);
          width: 66%;
          height: 66%;
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
        }
        .logo-glow-back {
          position: absolute;
          inset: 6%;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(95, 227, 242, 0.48) 0%, rgba(14, 165, 233, 0.22) 50%, transparent 75%);
          filter: blur(14px);
          animation: logo-pulse 3s ease-in-out infinite;
        }
        @keyframes logo-pulse {
          0%, 100% { opacity: 0.65; transform: scale(0.96); }
          50% { opacity: 1; transform: scale(1.06); }
        }
        .logo-img {
          position: relative;
          width: 82%;
          height: 82%;
          object-fit: contain;
          filter: drop-shadow(0 0 16px rgba(95, 227, 242, 0.65)) drop-shadow(0 0 32px rgba(14, 165, 233, 0.4));
          z-index: 2;
        }
        .brand {
          position: absolute;
          left: 0;
          right: 0;
          top: 54%;
          text-align: center;
          pointer-events: none;
          padding: 0 4vw;
        }
        .logo {
          display: flex;
          justify-content: center;
          font-family: 'Manrope', system-ui, sans-serif;
          font-weight: 200;
          font-size: clamp(24px, 6.3vw, 78px);
          letter-spacing: 0.3em;
          padding-left: 0.3em;
          line-height: 1.08;
        }
        .logo span {
          display: inline-block;
          opacity: 0;
          color: #effcff;
          text-shadow:
            0 0 26px rgba(53, 216, 238, 0.42),
            0 0 2px rgba(255, 255, 255, 0.38);
        }
        .tagline {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 13px;
          margin-top: 1.7vh;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-weight: 300;
          font-size: clamp(8.5px, 1.15vw, 14.5px);
          letter-spacing: 0.36em;
          padding-left: 0.36em;
          text-transform: uppercase;
          color: var(--ice);
          line-height: 1.25;
          opacity: 0;
          text-shadow:
            0 0 18px rgba(95, 227, 242, 0.2),
            0 0 2px rgba(255, 255, 255, 0.16);
        }
        .tag-icon {
          width: 15px;
          height: 15px;
          flex: 0 0 auto;
          opacity: 0.88;
        }
        .pulse-dot {
          animation: pulse-dot 1.8s ease-in-out infinite;
        }
        .pulse-dot:nth-of-type(2) {
          animation-delay: 0.18s;
        }
        .pulse-dot:nth-of-type(3) {
          animation-delay: 0.36s;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .features {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: clamp(10px, 2.4vw, 28px);
          margin-top: 4.2vh;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: clamp(7.5px, 1vw, 10px);
          letter-spacing: 0.22em;
          color: var(--mute);
          flex-wrap: wrap;
        }
        .feature {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.28;
        }
        .feature i {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #2a4452;
          transition: 0.3s ease;
        }
        .system-status {
          margin-top: 2.4vh;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: clamp(9px, 1.15vw, 11.5px);
          letter-spacing: 0.4em;
          padding-left: 0.4em;
          color: #bff6ff;
          opacity: 0;
        }
        .system-status i {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #2dd4bf;
          box-shadow: 0 0 10px #2dd4bf;
        }
        .cta {
          margin-top: 3.2vh;
          opacity: 0;
          pointer-events: none;
          transform: translateY(10px);
        }
        .cta button {
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #04121a;
          background: linear-gradient(90deg, #5fe3f2, #2dd4bf);
          border: 0;
          padding: 13px 30px;
          border-radius: 999px;
          cursor: pointer;
          box-shadow:
            0 0 24px rgba(95, 227, 242, 0.26),
            0 12px 32px rgba(0, 0, 0, 0.35);
          transition: 0.25s ease;
        }
        .cta button:hover,
        .cta button:focus-visible {
          transform: translateY(-1px);
          box-shadow:
            0 0 36px rgba(95, 227, 242, 0.45),
            0 14px 36px rgba(0, 0, 0, 0.4);
          outline: none;
        }
        .controls {
          position: absolute;
          top: calc(14px + env(safe-area-inset-top, 0px));
          right: 14px;
          display: flex;
          gap: 8px;
          z-index: 60;
        }
        .controls button {
          font: 400 10px 'JetBrains Mono', monospace;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #bfe9f2;
          background: rgba(10, 30, 45, 0.52);
          border: 1px solid rgba(95, 227, 242, 0.25);
          padding: 9px 14px;
          border-radius: 999px;
          backdrop-filter: blur(8px);
          cursor: pointer;
          transition: 0.25s ease;
        }
        .controls button:hover,
        .controls button:focus-visible {
          border-color: rgba(95, 227, 242, 0.7);
          background: rgba(20, 60, 80, 0.58);
          outline: none;
        }
        .debug {
          position: absolute;
          left: 14px;
          top: calc(14px + env(safe-area-inset-top, 0px));
          font-family: 'JetBrains Mono', monospace;
          font-size: 9px;
          letter-spacing: 0.1em;
          line-height: 1.6;
          color: #8fd9e6;
          background: rgba(6, 18, 30, 0.7);
          border: 1px solid rgba(95, 227, 242, 0.2);
          border-radius: 6px;
          padding: 8px 10px;
          backdrop-filter: blur(8px);
          display: none;
          white-space: pre;
          pointer-events: none;
          z-index: 8;
        }
        .debug.visible {
          display: block;
        }
        .fallback {
          position: absolute;
          inset: 0;
          display: none;
          place-items: center;
          text-align: center;
          padding: 24px;
          background: radial-gradient(circle at 50% 40%, #072238 0%, #02060f 70%);
        }
        .fallback.visible {
          display: grid;
        }
        .fallback-logo {
          font-weight: 200;
          font-size: clamp(28px, 7vw, 72px);
          letter-spacing: 0.3em;
          padding-left: 0.3em;
          color: #effcff;
        }
        .fallback-tagline {
          margin-top: 18px;
          font-family: 'JetBrains Mono', ui-monospace, monospace;
          font-size: clamp(9px, 1.2vw, 14px);
          letter-spacing: 0.34em;
          padding-left: 0.34em;
          text-transform: uppercase;
          color: var(--ice);
        }
        .fallback-button {
          margin-top: 34px;
        }
      `}</style>

      <div id="cv" />
      <div className="vignette" />
      <div className="scanlines" />
      <div className="grain" />

      <div ref={debugReference} className="debug" id="debug">
        DEBUG
      </div>

      <div id="technical-tag" className="mono technical-tag">
        SENSOR MESH · DATA STREAM · AI ANALYSIS
      </div>

      <div id="telemetry-ring" className="telemetry-ring">
        <svg viewBox="-100 -100 200 200" width="100%" height="100%">
          <circle r={97} fill="none" stroke="rgba(95, 227, 242, 0.2)" strokeWidth={0.4} />
          {ticks}
          <circle
            id="arc"
            r={84}
            fill="none"
            stroke="#5fe3f2"
            strokeWidth={1}
            strokeLinecap="round"
            strokeDasharray={528}
            strokeDashoffset={528}
            transform="rotate(-90)"
          />
          <g id="orb">
            {[0, 120, 240].map((angle) => (
              <circle
                key={angle}
                cx={Math.cos(angle * (Math.PI / 180)) * 97}
                cy={Math.sin(angle * (Math.PI / 180)) * 97}
                r={1.8}
                fill="#bff6ff"
              />
            ))}
          </g>
        </svg>

        {/* Dynamic Glowing Aqualytica Central Logo Emblem */}
        <div id="logo-badge" className="logo-badge">
          <div className="logo-glow-back" />
          <img src="/logo_loader.png" alt="Aqualytica Logo Emblem" className="logo-img" />
        </div>
      </div>

      <div className="brand">
        <div className="logo">
          {[..."AQUALYTICA"].map((character, index) => (
            <span key={index}>{character}</span>
          ))}
        </div>
        <div id="tagline" className="tagline">
          <WaterDropIcon />
          {TAGLINE}
          <DataPulseIcon />
        </div>
        <div className="features">
          {["Sensor Mesh", "Analytics Core", "Telemetry"].map((label) => (
            <div key={label} className="feature mono">
              <i />
              {label.toUpperCase()}
            </div>
          ))}
        </div>
        <div id="system-status" className="system-status mono">
          <i />
          SYSTEM INITIALIZED
        </div>
        <div id="cta" className="cta">
          <button onClick={enterDashboard}>Enter Dashboard</button>
        </div>
      </div>

      <div id="fade" className="fade" />

      <div className="controls">
        <button
          onClick={() => animationApi.current.toggleSound?.()}
          title="Press 'M' to toggle sound"
        >
          {soundEnabled ? "Sound On" : "Sound Off"}
        </button>
        <button onClick={enterDashboard} title="Skip Intro (Esc / Space)">
          Skip Intro
        </button>
      </div>

      <div className="fallback">
        <div>
          <div className="fallback-logo">AQUALYTICA</div>
          <div className="fallback-tagline mono">{TAGLINE}</div>
          <div className="fallback-button">
            <button onClick={enterDashboard}>Enter Dashboard</button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InitialLoader;
