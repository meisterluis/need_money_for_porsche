import { Suspense, useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Porsche } from "./components/Porsche_gt3_rs";
import { Model as MobilePhone } from "./MobilePhone4";
import {
  OrbitControls,
  Environment,
  ContactShadows,
  Hud,
  OrthographicCamera,
} from "@react-three/drei";

function SpinningPhone(props) {
  const ref = useRef();
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.5;
  });
  return (
    <group ref={ref} {...props}>
      <MobilePhone />
    </group>
  );
}

function Loader() {
  return (
    <div className="loading-screen">
      <div className="loading-spinner" />
      <h2>Loading</h2>
    </div>
  );
}

function Overlay({ currentValue, goal }) {
  const progress = Math.min(currentValue / goal, 1);
  const percentage = (progress * 100).toFixed(1);

  return (
    <div className="overlay">
      {/* Header */}
      <div className="header">
        <div>
          <h1>Porsche GT3 RS</h1>
          <span className="subtitle">Donation Fund</span>
        </div>
      </div>

      {/* Donation Panel */}
      <div className="donation-panel">
        <div className="donation-card">
          <div className="donation-amounts">
            <span className="donation-current">
              {currentValue.toLocaleString("de-CH")}
            </span>
            <span className="donation-separator">/</span>
            <span className="donation-goal">
              {goal.toLocaleString("de-CH")}
            </span>
            <span className="donation-currency">CHF</span>
          </div>
          <div className="progress-track">
            <div
              className="progress-fill"
              style={{ width: `${percentage}%` }}
            />
          </div>
          <span className="donation-percent">{percentage}% funded</span>
        </div>
        <a
          className="donate-btn"
          href="twint://home"
          onClick={(e) => {
            e.preventDefault();
            window.location.href = "twint://home";
          }}
        >
          Donate Now
        </a>
      </div>

      {/* Hint */}
      <span className="interaction-hint">Drag to rotate &middot; Scroll to zoom</span>
    </div>
  );
}

function Scene({ isMobile }) {
  return (
    <>
      <Environment preset="city" background={false} />
      <ambientLight intensity={isMobile ? 0.25 : 0.3} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={isMobile ? 1.6 : 2}
        castShadow
        shadow-mapSize={isMobile ? [1024, 1024] : [2048, 2048]}
      />
      <spotLight
        position={[-10, 10, -5]}
        angle={0.4}
        penumbra={1}
        intensity={isMobile ? 0.8 : 1}
        color="#b0c4de"
      />
      <Porsche position={[0, isMobile ? -0.25 : -0.3, 0]} />
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={isMobile ? 0.45 : 0.6}
        scale={isMobile ? 10 : 12}
        blur={isMobile ? 2 : 2.5}
        far={4}
      />
    </>
  );
}

function App() {
  const [currentValue, setCurrentValue] = useState(0);
  const [goal, setGoal] = useState(250000);
  const [viewport, setViewport] = useState({ width: 1200, height: 900 });

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setCurrentValue(data.currentAmount);
        if (data.goal) setGoal(data.goal);
      });
  }, []);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    return () => {
      window.removeEventListener("resize", updateViewport);
    };
  }, []);

  const isMobile = viewport.width <= 768;
  const isNarrowPhone = viewport.width <= 430;
  const isShortScreen = viewport.height <= 700;

  const cameraConfig = isMobile
    ? {
        position: isNarrowPhone ? [3.15, 1.45, 4.35] : [3.45, 1.6, 4.75],
        fov: isNarrowPhone ? 54 : 50,
      }
    : { position: [4, 2, 5], fov: 45 };

  const controlsConfig = isMobile
    ? {
        minPolarAngle: Math.PI / 3.2,
        maxPolarAngle: Math.PI / 1.95,
        minDistance: 2.4,
        maxDistance: 6.8,
        autoRotateSpeed: 0.3,
      }
    : {
        minPolarAngle: Math.PI / 4,
        maxPolarAngle: Math.PI / 2.1,
        minDistance: 3,
        maxDistance: 10,
        autoRotateSpeed: 0.5,
      };

  const phoneHudConfig = isMobile
    ? {
        position: isShortScreen ? [2.15, 1.05, 0] : [2.35, 1.2, 0],
        scale: isNarrowPhone ? 0.52 : 0.6,
      }
    : { position: [3.5, 1.8, 0], scale: 0.8 };

  return (
    <>
      <Canvas
        shadows
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        camera={cameraConfig}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance" }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0a0a0a");
          gl.toneMapping = 1; // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          <Scene isMobile={isMobile} />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={controlsConfig.autoRotateSpeed}
          enablePan={false}
          minPolarAngle={controlsConfig.minPolarAngle}
          maxPolarAngle={controlsConfig.maxPolarAngle}
          minDistance={controlsConfig.minDistance}
          maxDistance={controlsConfig.maxDistance}
        />
        <Hud renderPriority={1}>
          <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
          <ambientLight intensity={isMobile ? 0.65 : 0.8} />
          <pointLight position={[5, 5, 5]} intensity={isMobile ? 0.75 : 1} />
          <SpinningPhone
            position={phoneHudConfig.position}
            scale={phoneHudConfig.scale}
          />
        </Hud>
      </Canvas>
      <Suspense fallback={<Loader />}>
        <Overlay currentValue={currentValue} goal={goal} />
      </Suspense>
    </>
  );
}

export default App;
