import React, { useRef, useEffect } from 'react';
import { useFrame, useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const TransparentImages = ({ position, image1, image2 }) => {
  const texture1 = useLoader(THREE.TextureLoader, image1);
  const texture2 = useLoader(THREE.TextureLoader, image2);
  const groupRef = useRef();
  const { camera } = useThree();
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.lookAt(camera.position);
    }
  });

  return (
    <group position={position} ref={groupRef}>
      {/* First Image */}
      <mesh position={[0, -1.75, 0]}>
        <planeGeometry args={[1, 1]} /> {/* Adjust size as needed */}
        <meshBasicMaterial map={texture1} transparent={true} />
      </mesh>
      {/* Second Image */}
      <mesh position={[0, -1, 0]}>
        <planeGeometry args={[2, 1.75]} /> {/* Adjust size as needed */}
        <meshBasicMaterial map={texture2} transparent={true} />
      </mesh>
    </group>
  );
};

export default TransparentImages;
