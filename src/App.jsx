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
          href="#donate"
          onClick={(e) => e.preventDefault()}
        >
          Donate Now
        </a>
      </div>

      {/* Hint */}
      <span className="interaction-hint">Drag to rotate &middot; Scroll to zoom</span>
    </div>
  );
}

function Scene() {
  return (
    <>
      <Environment preset="city" background={false} />
      <ambientLight intensity={0.3} />
      <spotLight
        position={[10, 15, 10]}
        angle={0.3}
        penumbra={1}
        intensity={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />
      <spotLight
        position={[-10, 10, -5]}
        angle={0.4}
        penumbra={1}
        intensity={1}
        color="#b0c4de"
      />
      <Porsche position={[0, -0.3, 0]} />
      <ContactShadows
        position={[0, -1.05, 0]}
        opacity={0.6}
        scale={12}
        blur={2.5}
        far={4}
      />
    </>
  );
}

function App() {
  const [currentValue, setCurrentValue] = useState(0);
  const [goal, setGoal] = useState(250000);

  useEffect(() => {
    fetch("/config.json")
      .then((res) => res.json())
      .then((data) => {
        setCurrentValue(data.currentAmount);
        if (data.goal) setGoal(data.goal);
      });
  }, []);

  return (
    <>
      <Canvas
        shadows
        camera={{ position: [4, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        onCreated={({ gl }) => {
          gl.setClearColor("#0a0a0a");
          gl.toneMapping = 1; // ACESFilmicToneMapping
          gl.toneMappingExposure = 1.2;
        }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
        <OrbitControls
          autoRotate
          autoRotateSpeed={0.5}
          enablePan={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={3}
          maxDistance={10}
        />
        <Hud renderPriority={1}>
          <OrthographicCamera makeDefault position={[0, 0, 10]} zoom={100} />
          <ambientLight intensity={0.8} />
          <pointLight position={[5, 5, 5]} intensity={1} />
          <SpinningPhone position={[3.5, 1.8, 0]} scale={0.8} />
        </Hud>
      </Canvas>
      <Suspense fallback={<Loader />}>
        <Overlay currentValue={currentValue} goal={goal} />
      </Suspense>
    </>
  );
}

export default App;
