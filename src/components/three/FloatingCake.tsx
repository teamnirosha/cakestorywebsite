import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows } from "@react-three/drei";
import { useRef, Suspense } from "react";
import * as THREE from "three";

function SpinningCake() {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current) {
      ref.current.rotation.y += dt * 0.4;
      ref.current.position.y = Math.sin(performance.now() * 0.001) * 0.2;
    }
  });
  return (
    <group ref={ref}>
      <mesh castShadow position={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
        <meshStandardMaterial color="#ffc7d9" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.4, 0]}>
        <cylinderGeometry args={[0.6, 0.6, 0.3, 32]} />
        <meshStandardMaterial color="#ff7eb3" roughness={0.4} />
      </mesh>
      <mesh castShadow position={[0, 0.7, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.25, 32]} />
        <meshStandardMaterial color="#ffd3e2" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.95, 0]}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color="#ff3358" emissive="#ff5c97" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function FloatingCake({ height = 200 }: { height?: number }) {
  return (
    <div style={{ width: "100%", height }}>
      <Canvas camera={{ position: [0, 0.5, 3], fov: 40 }} dpr={[1, 2]}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[3, 3, 3]} intensity={1.1} />
        <Suspense fallback={null}>
          <SpinningCake />
          <ContactShadows position={[0, -0.6, 0]} opacity={0.3} scale={4} blur={2} far={2} />
          <Environment preset="sunset" />
        </Suspense>
      </Canvas>
    </div>
  );
}
