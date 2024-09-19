import React, { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three';

const ProgressBar = ({ position, currentValue, goal = 250000 }) => {
  const barRef = useRef();
  const groupRef = useRef();
  const { camera } = useThree();

  // Calculate the progress percentage
  const progress = Math.min(currentValue / goal, 1);
  const percentage = (progress * 100).toFixed(2); // Percentage progress

  useFrame(() => {
    if (barRef.current) {
      // Update the scale of the bar based on the progress
      barRef.current.scale.x = progress;
    }
    if (groupRef.current) {
      // Make the progress bar face the camera
      groupRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* Background Bar centered */}
      <mesh position={[0, 0, 0]}> {/* Centered position */}
        <boxGeometry args={[2, 0.3, 0.1]} />
        <meshStandardMaterial color="lightgrey" />
      </mesh>
      {/* Outline using edgesGeometrgreeny */}
      <lineSegments position={[0, 0, 0]}> {/* Centered position */}
        <edgesGeometry args={[new THREE.BoxGeometry(2, 0.3, 0.1)]} />
        <lineBasicMaterial color="green" />
      </lineSegments>
      {/* Progress Bar */}
      <mesh position={[(progress - 1), 0, 0]} ref={barRef}> {/* Centered Progress */}
        <boxGeometry args={[2, 0.3, 0.1]} />
        <shaderMaterial
          attach="material"
          uniforms={{
            color1: { value: new THREE.Color('#00aaff') }, // Light blue start
            color2: { value: new THREE.Color('#004488') }, // Dark blue end
          }}
          vertexShader={`
            varying vec2 vUv;
            void main() {
              vUv = uv;
              gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
            }
          `}
          fragmentShader={`
            uniform vec3 color1;
            uniform vec3 color2;
            varying vec2 vUv;
            void main() {
              gl_FragColor = vec4(mix(color1, color2, vUv.x), 1.0);
            }
          `}
        />
      </mesh>
      {/* Text Display for Current Value / Goal */}
      <Text
        position={[0, 0.35, 0]}  // Centered text
        fontSize={0.15}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {currentValue.toLocaleString()}.- / {goal.toLocaleString()}.- 
      </Text>
      {/* Percentage Text Display */}
      <Text
        position={[0, -0.35, 0]}  // Centered percentage text
        fontSize={0.15}
        color="red"
        anchorX="center"
        anchorY="middle"
      >
        {percentage}% 
      </Text>
    </group>
  );
};

export default ProgressBar;
