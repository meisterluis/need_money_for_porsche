import { Canvas } from "@react-three/fiber";
import { Porsche } from "./components/Porsche_gt3_rs";
import { OrbitControls } from "@react-three/drei";
import ProgressBar from "./components/ProgressBar";
import TransparentImages from "./components/TransparentImages";

function App() {
  const currentValue = 150000;

  return (
    <Canvas>
      <OrbitControls />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <Porsche position={[0, -0.3, 0]} />
      <TransparentImages position={[0, -0.5, 0]} image1="/img/Twint.png" image2="/img/donateNow.png" />
      <ProgressBar position={[0, 2, 0]} currentValue={currentValue} />
    </Canvas>
  );
}

export default App;
